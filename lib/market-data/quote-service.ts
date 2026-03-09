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
  source: "live";
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

async function getQuoteWithFallback(input: QuoteLookupInput) {
  try {
    return await getNaverFinanceQuote(input);
  } catch (error) {
    if (!env.TWELVE_DATA_API_KEY) {
      throw error;
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

function resolveNaverFinanceCode(input: QuoteLookupInput) {
  const candidate = (input.quoteSymbol || input.code).trim();

  if (/^\d{6}$/.test(candidate)) {
    return candidate;
  }

  return null;
}

function decodeEucKr(buffer: ArrayBuffer) {
  return new TextDecoder("euc-kr").decode(buffer);
}
