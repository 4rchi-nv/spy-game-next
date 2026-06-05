"use client";

import { GameProvider } from "@/components/game/GameProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}
