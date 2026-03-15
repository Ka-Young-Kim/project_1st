import { Card } from "@/components/ui/card";
import type { InvestmentItemCategory } from "@/features/investment-items/lib/category";

export function InvestmentItemGuideCard({
  portfolioName,
  selectedCategory,
  itemCount,
}: Readonly<{
  portfolioName?: string;
  selectedCategory?: InvestmentItemCategory | "all";
  itemCount: number;
}>) {
  const categoryLabel =
    !selectedCategory || selectedCategory === "all"
      ? "전체 항목"
      : selectedCategory === "stock"
        ? "주식"
        : selectedCategory === "etf"
          ? "ETF"
          : selectedCategory === "bond"
            ? "채권"
            : "기타";

  return (
    <Card className="sticky top-5 border-white/8 bg-[linear-gradient(180deg,rgba(18,28,52,.98),rgba(14,22,42,.98))] p-5 text-white">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#93a4c7]">
        Inspector
      </p>
      <h2 className="mt-3 text-[1.15rem] font-semibold tracking-tight">
        항목 관리 안내
      </h2>
      <p className="mt-2 text-[13px] leading-6 text-[#9fb4d8]">
        상세 목록 구성은 그대로 두고, 각 항목에서 코드 복사와 수정 다이얼로그를 바로 열 수 있게 유지했습니다.
      </p>

      <div className="mt-5 rounded-[1rem] border border-dashed border-white/10 bg-white/4 px-4 py-4 text-[13px] leading-6 text-[#89a0c7]">
        <p>
          {portfolioName ? `${portfolioName} 포트폴리오` : "선택된 포트폴리오"} 기준
          으로 {categoryLabel}을 보고 있습니다.
        </p>
        <p className="mt-2">현재 목록 항목 수는 {itemCount}개입니다.</p>
      </div>
    </Card>
  );
}
