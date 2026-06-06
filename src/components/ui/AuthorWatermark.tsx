"use client";

import Image from "next/image";
import Link from "next/link";

const PORTFOLIO_URL = "https://arslan-agajanov.vercel.app/";

export function AuthorWatermark() {
  return (
    <footer className="relative z-10 mt-6 px-4 pb-6 pt-2">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
          <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-slate-600">
            crafted
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
        </div>

        <Link
          href={PORTFOLIO_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Портфолио arslan-agajanov — открыть в новой вкладке"
          className="group relative block overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-indigo-950/30 p-[1px] shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-indigo-500/25 hover:shadow-[0_8px_40px_rgba(99,102,241,0.12)]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          >
            <span className="absolute -inset-full block -skew-x-12 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          </span>

          <span className="relative flex items-center gap-4 rounded-[15px] bg-slate-950/60 px-4 py-3.5 backdrop-blur-md">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              <span
                aria-hidden
                className="watermark-glow absolute inset-0 rounded-xl bg-indigo-500/30 blur-md"
              />
              <span className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 transition-transform duration-500 group-hover:scale-105 group-hover:border-indigo-400/30">
                <Image
                  src="/author-logo.png"
                  alt=""
                  width={26}
                  height={26}
                  className="h-[26px] w-[26px] object-contain"
                  aria-hidden
                />
              </span>
            </span>

            <span className="min-w-0 flex-1 text-left">
              <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500 transition-colors group-hover:text-indigo-300/80">
                Frontend · React · TS
              </span>
              <span className="mt-0.5 block truncate font-mono text-sm font-semibold watermark-shimmer transition-all group-hover:tracking-wide">
                Arslan Agajanov
              </span>
            </span>

            <span className="flex shrink-0 flex-col items-end gap-1">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700/60 bg-slate-900/80 text-slate-500 transition-all duration-300 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                ↗
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                portfolio
              </span>
            </span>
          </span>
        </Link>
      </div>
    </footer>
  );
}
