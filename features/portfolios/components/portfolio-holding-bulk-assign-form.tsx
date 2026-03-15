"use client";

import { useId, useState } from "react";

import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { bulkAssignPortfolioHoldingsAction } from "@/features/portfolios/actions/bulk-assign-portfolio-holdings";
import { createManualPortfolioHoldingsAction } from "@/features/portfolios/actions/create-manual-portfolio-holdings";

type HoldingOption = {
  id: string;
  name: string;
  code: string;
};

type AccountOption = {
  id: string;
  name: string;
  bank: string;
  displayId: string;
};

type Row = {
  id: string;
  value: string;
};

type ManualRow = {
  id: string;
  name: string;
  code: string;
  quantity: string;
  price: string;
  portfolioAccountId: string;
};

function createRow() {
  return {
    id: crypto.randomUUID(),
    value: "",
  };
}

function createManualRow(defaultAccountId: string) {
  return {
    id: crypto.randomUUID(),
    name: "",
    code: "",
    quantity: "",
    price: "",
    portfolioAccountId: defaultAccountId,
  };
}

export function PortfolioHoldingBulkAssignForm({
  portfolioId,
  portfolioAssetGroupId,
  groupName,
  options,
  accountOptions,
  fieldClassName,
}: Readonly<{
  portfolioId: string;
  portfolioAssetGroupId: string;
  groupName: string;
  options: HoldingOption[];
  accountOptions: AccountOption[];
  fieldClassName: string;
}>) {
  const datalistId = useId();
  const supportsManualEntry = !groupName.includes("주식");
  const defaultMode = supportsManualEntry ? "manual" : "existing";
  const [mode, setMode] = useState<"existing" | "manual">(defaultMode);
  const [rows, setRows] = useState<Row[]>([createRow()]);
  const [manualRows, setManualRows] = useState<ManualRow[]>([
    createManualRow(accountOptions[0]?.id ?? ""),
  ]);

  return (
    <div className="mt-4 space-y-3 rounded-[1rem] border border-white/8 bg-black/10 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">항목 추가</p>
          <p className="mt-1 text-xs leading-4 text-[#93a4c7]">
            {supportsManualEntry
              ? "기존 항목을 선택하거나, 직접 입력한 자산을 새로 만들어 바로 편입합니다."
              : "등록된 투자 항목을 선택해 이 자산군에 편입합니다."}
          </p>
        </div>
        {supportsManualEntry ? (
          <div className="inline-flex rounded-full border border-white/8 bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("existing")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === "existing" ? "bg-white/12 text-white" : "text-[#93a4c7]"
              }`}
            >
              등록 항목 선택
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                mode === "manual" ? "bg-white/12 text-white" : "text-[#93a4c7]"
              }`}
            >
              직접 입력
            </button>
          </div>
        ) : null}
      </div>

      {mode === "existing" ? (
        <form action={bulkAssignPortfolioHoldingsAction} className="space-y-3">
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input type="hidden" name="portfolioAssetGroupId" value={portfolioAssetGroupId} />
          <datalist id={datalistId}>
            {options.map((option) => (
              <option key={option.id} value={`${option.name} (${option.code})`} />
            ))}
          </datalist>
          <div className="space-y-2">
            {rows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-2">
                <Input
                  list={datalistId}
                  name="investmentItemRef"
                  value={row.value}
                  placeholder={index === 0 ? "항목 선택 또는 코드 입력" : "추가 항목"}
                  className={`${fieldClassName} py-2.5`}
                  onChange={(event) => {
                    const nextValue = event.target.value;
                    setRows((current) =>
                      current.map((item) =>
                        item.id === row.id ? { ...item, value: nextValue } : item,
                      ),
                    );
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRows((current) => [...current, createRow()])}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl font-semibold text-white transition hover:bg-white/12"
                  aria-label="항목 행 추가"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRows((current) =>
                      current.length === 1
                        ? current.map((item) =>
                            item.id === row.id ? { ...item, value: "" } : item,
                          )
                        : current.filter((item) => item.id !== row.id),
                    )
                  }
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl font-semibold text-white transition hover:bg-white/12"
                  aria-label="항목 행 제거"
                >
                  -
                </button>
              </div>
            ))}
          </div>
          <SubmitButton
            className="w-full rounded-[1rem] bg-white/10 text-white shadow-none hover:bg-white/15"
            pendingLabel="추가 중..."
          >
            이 자산군에 추가
          </SubmitButton>
        </form>
      ) : (
        <form action={createManualPortfolioHoldingsAction} className="space-y-3">
          <input type="hidden" name="portfolioId" value={portfolioId} />
          <input type="hidden" name="portfolioAssetGroupId" value={portfolioAssetGroupId} />
          <input type="hidden" name="groupName" value={groupName} />
          <div className="space-y-3">
            {manualRows.map((row) => (
              <div key={row.id} className="rounded-[1rem] border border-white/8 bg-white/[0.03] p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    name="manualName"
                    value={row.name}
                    placeholder="종목 이름"
                    className={`${fieldClassName} py-2.5`}
                    onChange={(event) =>
                      setManualRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, name: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    name="manualCode"
                    value={row.code}
                    placeholder="종목 코드(선택)"
                    className={`${fieldClassName} py-2.5`}
                    onChange={(event) =>
                      setManualRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, code: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    name="manualQuantity"
                    type="number"
                    min="0"
                    step="0.0001"
                    value={row.quantity}
                    placeholder="수량"
                    className={`${fieldClassName} py-2.5`}
                    onChange={(event) =>
                      setManualRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, quantity: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <Input
                    name="manualPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.price}
                    placeholder="평단가"
                    className={`${fieldClassName} py-2.5`}
                    onChange={(event) =>
                      setManualRows((current) =>
                        current.map((item) =>
                          item.id === row.id ? { ...item, price: event.target.value } : item,
                        ),
                      )
                    }
                  />
                  <div className="sm:col-span-2">
                    <Select
                      name="manualPortfolioAccountId"
                      value={row.portfolioAccountId}
                      className={`${fieldClassName} py-2.5 [&>option]:bg-[#15203a] [&>option]:text-white`}
                      onChange={(event) =>
                        setManualRows((current) =>
                          current.map((item) =>
                            item.id === row.id
                              ? { ...item, portfolioAccountId: event.target.value }
                              : item,
                          ),
                        )
                      }
                    >
                      {accountOptions.map((account) => (
                        <option key={account.id} value={account.id} className="bg-[#15203a] text-white">
                          {account.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setManualRows((current) => [...current, createManualRow(accountOptions[0]?.id ?? "")])
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl font-semibold text-white transition hover:bg-white/12"
                    aria-label="직접 입력 행 추가"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setManualRows((current) =>
                        current.length === 1
                          ? current.map((item) =>
                              item.id === row.id
                                ? {
                                    ...item,
                                    name: "",
                                    code: "",
                                    quantity: "",
                                    price: "",
                                  }
                                : item,
                            )
                          : current.filter((item) => item.id !== row.id),
                      )
                    }
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/6 text-xl font-semibold text-white transition hover:bg-white/12"
                    aria-label="직접 입력 행 제거"
                  >
                    -
                  </button>
                </div>
              </div>
            ))}
          </div>
          <SubmitButton
            className="w-full rounded-[1rem] bg-white/10 text-white shadow-none hover:bg-white/15"
            pendingLabel="추가 중..."
          >
            직접 입력으로 추가
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
