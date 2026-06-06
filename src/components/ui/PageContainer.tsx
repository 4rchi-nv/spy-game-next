import { type ReactNode } from "react";
import Link from "next/link";

interface PageContainerProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
}

export function PageContainer({
  children,
  title,
  subtitle,
  backHref,
  backLabel = "Назад",
}: PageContainerProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950">
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col px-4 py-6 pb-10">
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 transition-colors w-fit"
          >
            <span aria-hidden>←</span> {backLabel}
          </Link>
        )}
        {(title || subtitle) && (
          <header className="mb-6">
            {title && (
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-slate-400 text-sm sm:text-base leading-relaxed">
                {subtitle}
              </p>
            )}
          </header>
        )}
        <div className="flex-1 flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}
