type AccountReturnPathInput = {
  fallbackPath: string;
  returnTo?: string;
  portfolioId?: string;
  status: string;
};

export function buildAccountReturnPath({
  fallbackPath,
  returnTo,
  portfolioId,
  status,
}: AccountReturnPathInput) {
  const basePath = returnTo && returnTo.startsWith("/") ? returnTo : fallbackPath;
  const url = new URL(basePath, "http://localhost");

  if (portfolioId) {
    url.searchParams.set("portfolio", portfolioId);
  }

  url.searchParams.set("status", status);

  const search = url.searchParams.toString();

  return `${url.pathname}${search ? `?${search}` : ""}`;
}
