import { cx } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: Readonly<PageHeaderProps>) {
  return (
    <section
      className={cx(
        "flex flex-col gap-3 border-b border-white/6 pb-5 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="space-y-2.5">
        <p className="page-kicker">{eyebrow}</p>
        <div className="space-y-1.5">
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-description">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
    </section>
  );
}
