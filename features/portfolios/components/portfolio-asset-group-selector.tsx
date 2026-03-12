"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { PORTFOLIO_ASSET_GROUP_OPTIONS } from "@/features/portfolios/lib/asset-group";
import { cx } from "@/lib/utils";

const defaultAssetGroupOptions: string[] = PORTFOLIO_ASSET_GROUP_OPTIONS.map(
  (item) => item.value,
);

export function PortfolioAssetGroupSelector({
  fieldClassName,
}: Readonly<{
  fieldClassName: string;
}>) {
  const [options, setOptions] = useState<string[]>(defaultAssetGroupOptions);
  const [selectedGroup, setSelectedGroup] = useState<string>(defaultAssetGroupOptions[0] ?? "");
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [customGroup, setCustomGroup] = useState("");
  const isSelectedCustomGroup = !defaultAssetGroupOptions.includes(selectedGroup);

  function startAddGroup() {
    setIsAddingGroup(true);
    setCustomGroup("");
  }

  function addCustomGroup() {
    const trimmed = customGroup.trim();

    if (!trimmed) {
      return;
    }

    setOptions((current) => (current.includes(trimmed) ? current : [...current, trimmed]));
    setSelectedGroup(trimmed);
    setIsAddingGroup(false);
    setCustomGroup("");
  }

  function removeCustomGroup() {
    if (!isSelectedCustomGroup) {
      return;
    }

    setOptions((current) => current.filter((item) => item !== selectedGroup));
    setSelectedGroup(defaultAssetGroupOptions[0] ?? "");
  }

  return (
    <label className="space-y-1.5">
      <span className="text-sm font-medium">자산군</span>
      <input type="hidden" name="name" value={selectedGroup} />
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select
            value={selectedGroup}
            onChange={(event) => setSelectedGroup(event.target.value)}
            className={`${fieldClassName} py-2`}
          >
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
          <button
            type="button"
            onClick={startAddGroup}
            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-[#6ea8fe]/28 bg-[#6ea8fe]/12 text-lg font-semibold text-[#dbe7ff] transition hover:bg-[#6ea8fe]/18"
            aria-label="자산군 선택지 추가"
          >
            +
          </button>
          <button
            type="button"
            onClick={removeCustomGroup}
            disabled={!isSelectedCustomGroup}
            className={cx(
              "inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border text-lg font-semibold transition",
              isSelectedCustomGroup
                ? "border-rose-300/18 bg-rose-400/10 text-rose-100 hover:bg-rose-400/18"
                : "cursor-not-allowed border-white/8 bg-white/4 text-[#62779f] opacity-60",
            )}
            aria-label="선택한 커스텀 자산군 제거"
          >
            -
          </button>
        </div>

        {isAddingGroup ? (
          <div className="flex gap-2">
            <Input
              value={customGroup}
              onChange={(event) => setCustomGroup(event.target.value)}
              placeholder="새 자산군 입력"
              className={`${fieldClassName} py-2`}
            />
            <button
              type="button"
              onClick={addCustomGroup}
              className="inline-flex h-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-[#8fb6ff]/28 bg-[#203764] px-4 text-sm font-semibold text-white transition hover:bg-[#29457a]"
            >
              추가
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingGroup(false);
                setCustomGroup("");
              }}
              className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[1rem] border border-white/10 bg-white/4 text-lg font-semibold text-[#9db2d8] transition hover:bg-white/8 hover:text-white"
              aria-label="자산군 추가 취소"
            >
              ×
            </button>
          </div>
        ) : null}
      </div>
    </label>
  );
}
