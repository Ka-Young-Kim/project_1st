import { prisma } from "@/lib/prisma";

export async function getInvestmentItems({
  activeOnly = false,
}: { activeOnly?: boolean } = {}) {
  const items = await prisma.investmentItem.findMany({
    where: activeOnly ? { active: true } : undefined,
    include: {
      _count: {
        select: {
          logs: true,
        },
      },
    },
    orderBy: [{ active: "desc" }, { updatedAt: "desc" }],
  });

  return items.map((item) => ({
    id: item.id,
    name: item.name,
    code: item.code,
    category: item.category,
    industry: item.industry,
    notes: item.notes,
    active: item.active,
    logCount: item._count.logs,
    updatedAt: item.updatedAt,
  }));
}
