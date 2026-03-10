import { getPortfolioManagementData } from "@/features/portfolios/services/portfolio-management-service";

export async function getPortfolioManagement(portfolioId: string) {
  return getPortfolioManagementData(portfolioId);
}
