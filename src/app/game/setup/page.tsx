"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { useGame } from "@/components/game/GameProvider";
import {
  getInitialSetupState,
  resizePlayerNames,
  resolveCategoryId,
} from "@/lib/game/setupState";
import { loadWordsDatabase } from "@/lib/words/wordsRepository";
import {
  categoryHasEnoughWords,
  getCategoryById,
} from "@/lib/words/wordsRepository";
import {
  getValidationMessage,
  normalizePlayerNames,
  validateGameSettings,
} from "@/lib/game/validation";

const TIMER_OPTIONS = [
  { value: 0 as const, label: "Без таймера" },
  { value: 3 as const, label: "3 мин" },
  { value: 5 as const, label: "5 мин" },
  { value: 10 as const, label: "10 мин" },
];

export default function GameSetupPage() {
  const router = useRouter();
  const { startGame, isReady } = useGame();

  const [db] = useState(() => loadWordsDatabase());
  const [form, setForm] = useState(getInitialSetupState);
  const [error, setError] = useState<string | null>(null);

  const { mode, playerCount, spiesCount, timerMinutes, playerNames } = form;

  const availableCategories = useMemo(
    () => db.categories.filter((c) => categoryHasEnoughWords(c, mode)),
    [db, mode]
  );

  const categoryId = resolveCategoryId(
    form.categoryId,
    availableCategories.map((c) => c.id)
  );

  const category = getCategoryById(db, categoryId);

  const updateForm = (patch: Partial<typeof form>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      if (patch.playerCount !== undefined) {
        next.playerNames = resizePlayerNames(prev.playerNames, patch.playerCount);
      }
      if (patch.mode !== undefined && patch.mode !== prev.mode) {
        const cats = db.categories.filter((c) =>
          categoryHasEnoughWords(c, patch.mode!)
        );
        next.categoryId = resolveCategoryId(prev.categoryId, cats.map((c) => c.id));
      }
      return next;
    });
  };

  const handleStart = () => {
    const errors = validateGameSettings(
      {
        mode,
        playerCount,
        spiesCount,
        categoryId,
        timerMinutes,
        playerNames,
      },
      category
    );
    const msg = getValidationMessage(errors);
    if (msg) {
      setError(msg);
      return;
    }

    const players = normalizePlayerNames(playerCount, playerNames);
    startGame(
      { mode, players, spiesCount, categoryId, timerMinutes },
      category!
    );
    router.push("/game/cards");
  };

  if (!isReady) {
    return (
      <PageContainer title="Настройка игры" backHref="/">
        <p className="text-slate-400 text-center py-12">Загрузка...</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Настройка игры"
      subtitle="Выберите режим, игроков и категорию слов"
      backHref="/"
    >
      <Card className="space-y-5">
        <fieldset>
          <legend className="text-sm font-medium text-slate-300 mb-3">
            Режим игры
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { id: "classic" as const, label: "Обычный", desc: "Шпион знает, что он шпион" },
                { id: "hardcore" as const, label: "Хардкор", desc: "Все видят слово, роли скрыты" },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => updateForm({ mode: m.id })}
                className={[
                  "rounded-2xl border-2 p-4 text-left transition-all",
                  mode === m.id
                    ? "border-indigo-500 bg-indigo-500/15"
                    : "border-slate-700 bg-slate-800/50 hover:border-slate-600",
                ].join(" ")}
              >
                <div className="font-semibold text-white">{m.label}</div>
                <div className="text-xs text-slate-400 mt-1">{m.desc}</div>
              </button>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Количество игроков: {playerCount}
          </label>
          <input
            type="range"
            min={3}
            max={15}
            value={playerCount}
            onChange={(e) => updateForm({ playerCount: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>3</span>
            <span>15</span>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Количество шпионов: {spiesCount}
          </label>
          <input
            type="range"
            min={1}
            max={3}
            value={spiesCount}
            onChange={(e) => updateForm({ spiesCount: Number(e.target.value) })}
            className="w-full accent-indigo-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>3</span>
          </div>
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-medium text-slate-300 block mb-2"
          >
            Категория
          </label>
          {availableCategories.length === 0 ? (
            <p className="text-amber-400 text-sm">
              Нет подходящих категорий.{" "}
              <a href="/words" className="underline">
                Добавьте слова
              </a>
            </p>
          ) : (
            <select
              id="category"
              value={categoryId}
              onChange={(e) => updateForm({ categoryId: e.target.value })}
              className="w-full rounded-2xl border border-slate-600 bg-slate-800 px-4 py-3 text-white focus:border-indigo-500 focus:outline-none"
            >
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.words.length} слов)
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">
            Таймер обсуждения
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TIMER_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => updateForm({ timerMinutes: t.value })}
                className={[
                  "rounded-xl py-2.5 text-sm font-medium transition-all",
                  timerMinutes === t.value
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700",
                ].join(" ")}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="space-y-3">
        <h2 className="text-sm font-medium text-slate-300">Имена игроков</h2>
        <p className="text-xs text-slate-500">
          Пустые поля станут «Игрок 1», «Игрок 2» и т.д.
        </p>
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {playerNames.map((name, i) => (
            <input
              key={i}
              type="text"
              placeholder={`Игрок ${i + 1}`}
              value={name}
              onChange={(e) => {
                const next = [...playerNames];
                next[i] = e.target.value;
                updateForm({ playerNames: next });
              }}
              className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
              maxLength={24}
            />
          ))}
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl bg-red-500/15 border border-red-500/30 px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      <Button
        size="lg"
        fullWidth
        onClick={handleStart}
        disabled={availableCategories.length === 0}
      >
        Начать игру
      </Button>
    </PageContainer>
  );
}
