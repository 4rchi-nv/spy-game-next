"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

interface TimerProps {
  minutes: number;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function DiscussionTimer({ minutes }: TimerProps) {
  const totalSeconds = minutes * 60;
  const [remaining, setRemaining] = useState(totalSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!running) {
      clearTimer();
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearTimer();
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return clearTimer;
  }, [running, clearTimer]);

  if (minutes === 0) {
    return (
      <div className="text-center py-4 text-slate-400">
        Таймер не установлен — обсуждайте сколько нужно
      </div>
    );
  }

  const progress = totalSeconds > 0 ? (remaining / totalSeconds) * 100 : 0;
  const isLow = remaining <= 30 && remaining > 0;

  return (
    <div className="space-y-4">
      <div
        className={[
          "text-center text-5xl font-mono font-bold tabular-nums transition-colors",
          isLow ? "text-red-400 animate-pulse" : "text-white",
          remaining === 0 ? "text-amber-400" : "",
        ].join(" ")}
      >
        {remaining === 0 ? "Время!" : formatTime(remaining)}
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={[
            "h-full rounded-full transition-all duration-1000",
            isLow ? "bg-red-500" : "bg-indigo-500",
          ].join(" ")}
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          fullWidth
          onClick={() => setRunning((r) => !r)}
        >
          {running ? "Пауза" : "Старт"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => {
            setRunning(false);
            setRemaining(totalSeconds);
          }}
        >
          Сброс
        </Button>
      </div>
    </div>
  );
}
