type TradeActionToggleProps = {
  name: string;
  defaultValue?: "buy" | "sell";
};

const ACTIONS = [
  { value: "buy", label: "Buy", icon: "B", tone: "peer-checked:border-emerald-300/40 peer-checked:bg-emerald-400/12 peer-checked:text-emerald-100" },
  { value: "sell", label: "Sell", icon: "S", tone: "peer-checked:border-sky-300/40 peer-checked:bg-sky-400/12 peer-checked:text-sky-100" },
] as const;

export function TradeActionToggle({
  name,
  defaultValue = "buy",
}: Readonly<TradeActionToggleProps>) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {ACTIONS.map((action) => (
        <label key={action.value} className="block">
          <input
            type="radio"
            name={name}
            value={action.value}
            aria-label={action.label}
            defaultChecked={defaultValue === action.value}
            className="peer sr-only"
          />
          <span
            className={`flex h-10 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/4 text-sm font-semibold text-white/72 transition hover:bg-white/8 ${action.tone}`}
          >
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold uppercase">
              {action.icon}
            </span>
            {action.label}
          </span>
        </label>
      ))}
    </div>
  );
}
