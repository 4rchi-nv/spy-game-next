"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageContainer } from "@/components/ui/PageContainer";
import { FlipCard } from "@/components/game/FlipCard";
import { useGame } from "@/components/game/GameProvider";
import { getCardDisplayText } from "@/lib/game/engine";

export default function GameCardsPage() {
  const router = useRouter();
  const { state, isReady, revealCard, hideCardAndNext, setPhase } = useGame();

  useEffect(() => {
    if (!isReady) return;
    if (!state) {
      router.replace("/game/setup");
    }
  }, [isReady, state, router]);

  if (!isReady || !state) {
    return (
      <PageContainer title="Раздача карт" backHref="/game/setup">
        <p className="text-slate-400 text-center py-12">Загрузка...</p>
      </PageContainer>
    );
  }

  const { game, currentCardIndex, cardRevealed } = state;
  const total = game.cards.length;
  const allDone = currentCardIndex >= total;
  const currentCard = allDone ? null : game.cards[currentCardIndex];

  const handleHideAndNext = () => {
    hideCardAndNext();
  };

  const handleStartDiscussion = () => {
    setPhase("discussion");
    router.push("/game/discussion");
  };

  return (
    <PageContainer
      title="Раздача карт"
      subtitle={
        allDone
          ? "Все карты розданы"
          : `Игрок ${currentCardIndex + 1} из ${total} — передайте телефон`
      }
    >
      {!allDone && currentCard && (
        <div className="flex-1 flex flex-col gap-6">
          <div className="text-center">
            <p className="text-sm text-slate-400 mb-1">Сейчас смотрит</p>
            <h2 className="text-3xl font-bold text-white">
              {currentCard.playerName}
            </h2>
          </div>

          <FlipCard
            revealed={cardRevealed}
            front={
              <Card
                className="w-full h-full min-h-[280px] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/80 to-slate-900 border-indigo-500/30"
                padding="lg"
              >
                <span className="text-6xl mb-4" aria-hidden>
                  🃏
                </span>
                <p className="text-slate-300 text-lg">Карта закрыта</p>
                <p className="text-slate-500 text-sm mt-2">
                  Нажмите, чтобы посмотреть
                </p>
              </Card>
            }
            back={
              <Card
                className={[
                  "w-full h-full min-h-[280px] flex flex-col items-center justify-center",
                  game.settings.mode === "classic" &&
                  currentCard.word === "__SPY__"
                    ? "bg-gradient-to-br from-red-900/80 to-slate-900 border-red-500/40"
                    : "bg-gradient-to-br from-emerald-900/60 to-slate-900 border-emerald-500/30",
                ].join(" ")}
                padding="lg"
              >
                <p className="text-sm text-slate-400 mb-3 uppercase tracking-wider">
                  {game.settings.mode === "hardcore"
                    ? "Твоё слово"
                    : currentCard.word === "__SPY__"
                      ? "Твоя роль"
                      : "Твоё слово"}
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-white text-center leading-tight">
                  {getCardDisplayText(currentCard, game.settings.mode)}
                </p>
              </Card>
            }
          />

          <div className="space-y-3 mt-auto">
            {!cardRevealed ? (
              <Button size="lg" fullWidth onClick={revealCard}>
                Показать карту
              </Button>
            ) : (
              <Button size="lg" fullWidth onClick={handleHideAndNext}>
                Скрыть и передать следующему
              </Button>
            )}
          </div>

          <p className="text-center text-xs text-slate-600">
            Не показывайте карту другим игрокам
          </p>
        </div>
      )}

      {allDone && (
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <Card className="text-center space-y-3" padding="lg">
            <span className="text-5xl" aria-hidden>
              ✅
            </span>
            <h2 className="text-xl font-semibold text-white">
              Все посмотрели карты
            </h2>
            <p className="text-slate-400 text-sm">
              Положите телефон в центр и начинайте обсуждение
            </p>
          </Card>
          <Button size="lg" fullWidth onClick={handleStartDiscussion}>
            Начать обсуждение
          </Button>
        </div>
      )}
    </PageContainer>
  );
}
