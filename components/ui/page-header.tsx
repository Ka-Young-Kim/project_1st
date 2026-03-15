import { cx } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  desktopToolbar?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  desktopToolbar,
  className,
}: Readonly<PageHeaderProps>) {
  return (
    <section
      className={cx(
        "space-y-3 border-b border-white/6 pb-4",
        className,
      )}
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="page-kicker">{eyebrow}</p>
          <div className="space-y-1.5">
            <h1 className="page-title">{title}</h1>
            {description ? <p className="page-description">{description}</p> : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>
      {desktopToolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-3">
          {desktopToolbar}
        </div>
      ) : null}
    </section>
  );
}
