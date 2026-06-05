"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { useGame } from "@/components/game/GameProvider";
import { getModeLabel, getSpiesFromGame } from "@/lib/game/engine";
import {
  getCategoryById,
  loadWordsDatabase,
} from "@/lib/words/wordsRepository";

export default function GameResultsPage() {
  const router = useRouter();
  const { state, isReady, startGame, resetGame } = useGame();

  useEffect(() => {
    if (!isReady) return;
    if (!state) router.replace("/game/setup");
  }, [isReady, state, router]);

  const category = useMemo(() => {
    if (!state) return undefined;
    const db = loadWordsDatabase();
    return getCategoryById(db, state.game.settings.categoryId);
  }, [state]);

  if (!isReady || !state) {
    return (
      <PageContainer title="Результаты" backHref="/">
        <p className="text-slate-400 text-center py-12">Загрузка...</p>
      </PageContainer>
    );
  }

  const { game } = state;
  const spies = getSpiesFromGame(game);

  const handleReplay = () => {
    if (!category) return;
    startGame(game.settings, category);
    router.push("/game/cards");
  };

  const handleNewGame = () => {
    resetGame();
    router.push("/game/setup");
  };

  const handleHome = () => {
    resetGame();
    router.push("/");
  };

  return (
    <PageContainer
      title="Игра окончена"
      subtitle="Все роли и слова раскрыты"
    >
      <Card className="space-y-4 border-indigo-500/30 bg-indigo-950/20">
        <div>
          <span className="text-xs uppercase tracking-wider text-indigo-400">
            Шпион{spies.length > 1 ? "ы" : ""}
          </span>
          <p className="text-2xl font-bold text-white mt-1">
            {spies.map((s) => s.playerName).join(", ")}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-3 pt-2 border-t border-slate-700/50">
          <div>
            <span className="text-sm text-slate-500">Слово обычных игроков</span>
            <p className="text-xl font-semibold text-emerald-400">
              {game.mainWord}
            </p>
          </div>
          {game.settings.mode === "hardcore" && game.spyWord && (
            <div>
              <span className="text-sm text-slate-500">Слово шпионов</span>
              <p className="text-xl font-semibold text-red-400">
                {game.spyWord}
              </p>
            </div>
          )}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-slate-500">Категория</span>
              <p className="text-white">{game.categoryName}</p>
            </div>
            <div>
              <span className="text-slate-500">Режим</span>
              <p className="text-white">{getModeLabel(game.settings.mode)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-slate-400 mb-3">Все игроки</h2>
        <ul className="space-y-2">
          {game.cards.map((card) => (
            <li
              key={card.playerId}
              className={[
                "flex items-center justify-between rounded-xl px-4 py-3",
                card.role === "spy"
                  ? "bg-red-950/40 border border-red-500/20"
                  : "bg-slate-800/60",
              ].join(" ")}
            >
              <span className="font-medium text-white">{card.playerName}</span>
              <div className="text-right">
                <span
                  className={[
                    "text-xs font-medium uppercase",
                    card.role === "spy" ? "text-red-400" : "text-emerald-400",
                  ].join(" ")}
                >
                  {card.role === "spy" ? "Шпион" : "Свой"}
                </span>
                {game.settings.mode === "hardcore" && (
                  <p className="text-sm text-slate-400">{card.word}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3 mt-auto">
        <Button size="lg" fullWidth onClick={handleReplay} disabled={!category}>
          Сыграть ещё раз с теми же игроками
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={handleNewGame}>
          Новая игра
        </Button>
        <Link href="/" onClick={handleHome} className="block">
          <Button variant="outline" size="lg" fullWidth>
            На главную
          </Button>
        </Link>
      </div>
    </PageContainer>
  );
}
