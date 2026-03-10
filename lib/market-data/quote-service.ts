import { env } from "@/lib/env";

type QuoteLookupInput = {
  code: string;
  quoteSymbol?: string | null;
  exchange?: string | null;
  currency?: string | null;
};

export type ResolvedQuote = {
  code: string;
  currency: string;
  price: number;
  asOf: string | null;
  source: "live" | "delayed";
};

type TwelveDataQuoteResponse = {
  code?: number;
  status?: string;
  message?: string;
  price?: string;
  close?: string;
  currency?: string;
  datetime?: string;
  exchange?: string;
  symbol?: string;
};

const TWELVE_DATA_QUOTE_URL = "https://api.twelvedata.com/quote";
const NAVER_FINANCE_QUOTE_URL = "https://finance.naver.com/item/sise.naver";
const STOOQ_QUOTE_URL = "https://stooq.com/q/l/";

export async function getLatestQuotes(inputs: QuoteLookupInput[]) {
  const uniqueInputs = new Map<string, QuoteLookupInput>();

  inputs.forEach((input) => {
    uniqueInputs.set(input.code, input);
  });

  const results = await Promise.allSettled(
    Array.from(uniqueInputs.values()).map(async (input) => {
      const quote = await getQuoteWithFallback(input);

      return [input.code, quote] as const;
    }),
  );

  return results.reduce((acc, result) => {
    if (result.status === "fulfilled") {
      const [code, quote] = result.value;
      acc.set(code, quote);
    }

    return acc;
  }, new Map<string, ResolvedQuote>());
}

export async function getUsdToKrwRate() {
  const [, , , , , , close] = await getStooqCsvRow("usdkrw");
  const rate = Number(close);

  if (!Number.isFinite(rate)) {
    throw new Error("USDKRW rate is invalid");
  }

  return rate;
}

async function getQuoteWithFallback(input: QuoteLookupInput) {
  try {
    return await getNaverFinanceQuote(input);
  } catch {
    try {
      return await getStooqQuote(input);
    } catch (error) {
      if (!env.TWELVE_DATA_API_KEY) {
        throw error;
      }
    }
  }

  return getTwelveDataQuote(input);
}

async function getTwelveDataQuote(input: QuoteLookupInput) {
  const url = new URL(TWELVE_DATA_QUOTE_URL);
  url.searchParams.set("symbol", input.quoteSymbol || input.code);
  url.searchParams.set("apikey", env.TWELVE_DATA_API_KEY!);

  if (input.exchange) {
    url.searchParams.set("exchange", input.exchange);
  }

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
    },
    next: {
      revalidate: env.MARKET_DATA_CACHE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Market data request failed with ${response.status}`);
  }

  const payload = (await response.json()) as TwelveDataQuoteResponse;

  if (payload.status === "error") {
    throw new Error(payload.message || "Market data provider returned an error");
  }

  const rawPrice = payload.price ?? payload.close;
  const price = Number(rawPrice);

  if (!Number.isFinite(price)) {
    throw new Error("Market data provider returned an invalid price");
  }

  return {
    code: input.code,
    currency: payload.currency || input.currency || "KRW",
    price,
    asOf: payload.datetime ?? null,
    source: "live" as const,
  };
}

async function getNaverFinanceQuote(input: QuoteLookupInput) {
  const code = resolveNaverFinanceCode(input);

  if (!code) {
    throw new Error("Naver Finance requires a 6-digit stock code");
  }

  const url = new URL(NAVER_FINANCE_QUOTE_URL);
  url.searchParams.set("code", code);

  const response = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      Referer: "https://finance.naver.com/",
    },
    next: {
      revalidate: env.MARKET_DATA_CACHE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Naver Finance request failed with ${response.status}`);
  }

  const html = decodeEucKr(await response.arrayBuffer());
  const priceMatch = html.match(/id=["']_nowVal["'][^>]*>([^<]+)</i);
  const price = Number((priceMatch?.[1] ?? "").replace(/,/g, "").trim());

  if (!Number.isFinite(price)) {
    throw new Error("Naver Finance returned an invalid price");
  }

  return {
    code: input.code,
    currency: input.currency || "KRW",
    price,
    asOf: new Date().toISOString(),
    source: "live" as const,
  };
}

async function getStooqQuote(input: QuoteLookupInput) {
  const symbol = resolveStooqSymbol(input);

  if (!symbol) {
    throw new Error("Stooq symbol could not be resolved");
  }

  const [, date, time, , , , close] = await getStooqCsvRow(symbol);
  const price = Number(close);

  if (!date || date === "N/D" || !Number.isFinite(price)) {
    throw new Error("Stooq returned an invalid price");
  }

  const asOf =
    time && time !== "N/D"
      ? `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}Z`
      : `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00Z`;

  return {
    code: input.code,
    currency: inferCurrencyFromStooqSymbol(symbol) || input.currency || "USD",
    price,
    asOf,
    source: "delayed" as const,
  };
}

async function getStooqCsvRow(symbol: string) {
  const url = new URL(STOOQ_QUOTE_URL);
  url.searchParams.set("s", symbol);
  url.searchParams.set("i", "d");

  const response = await fetch(url, {
    headers: {
      Accept: "text/plain,text/csv",
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
    next: {
      revalidate: env.MARKET_DATA_CACHE_SECONDS,
    },
  });

  if (!response.ok) {
    throw new Error(`Stooq request failed with ${response.status}`);
  }

  return (await response.text()).trim().split(",");
}

function resolveNaverFinanceCode(input: QuoteLookupInput) {
  const candidate = (input.quoteSymbol || input.code).trim();

  if (/^\d{6}$/.test(candidate)) {
    return candidate;
  }

  return null;
}

function resolveStooqSymbol(input: QuoteLookupInput) {
  const candidate = (input.quoteSymbol || input.code).trim().toLowerCase();

  if (!candidate) {
    return null;
  }

  if (candidate.includes(".")) {
    return candidate;
  }

  if (/^[a-z]+$/.test(candidate)) {
    return `${candidate}.us`;
  }

  return null;
}

function inferCurrencyFromStooqSymbol(symbol: string) {
  if (symbol.endsWith(".us")) {
    return "USD";
  }

  return null;
}

function decodeEucKr(buffer: ArrayBuffer) {
  return new TextDecoder("euc-kr").decode(buffer);
}
