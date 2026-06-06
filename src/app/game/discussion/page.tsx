"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageContainer } from "@/components/ui/PageContainer";
import { DiscussionTimer } from "@/components/game/DiscussionTimer";
import { useGame } from "@/components/game/GameProvider";
import { getModeLabel } from "@/lib/game/engine";

export default function GameDiscussionPage() {
  const router = useRouter();
  const { state, isReady, setPhase } = useGame();

  useEffect(() => {
    if (!isReady) return;
    if (!state) router.replace("/game/setup");
  }, [isReady, state, router]);

  if (!isReady || !state) {
    return <LoadingScreen />;
  }

  const { game } = state;

  const goToVote = () => {
    setPhase("voting");
    router.push("/game/vote");
  };

  const revealDirectly = () => {
    setPhase("results");
    router.push("/game/results");
  };

  return (
    <PageContainer
      title="Обсуждение"
      subtitle="Называйте ассоциации, не раскрывая слово слишком явно"
    >
      <Card className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-500">Категория</span>
            <p className="font-medium text-white">{game.categoryName}</p>
          </div>
          <div>
            <span className="text-slate-500">Режим</span>
            <p className="font-medium text-white">
              {getModeLabel(game.settings.mode)}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <DiscussionTimer minutes={game.settings.timerMinutes} />
      </Card>

      <Card>
        <h2 className="text-sm font-medium text-slate-400 mb-3">
          Игроки ({game.cards.length})
        </h2>
        <ul className="space-y-2">
          {game.cards.map((card, i) => (
            <li
              key={card.playerId}
              className="flex items-center gap-3 rounded-xl bg-slate-800/60 px-4 py-3"
            >
              <span className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 text-sm flex items-center justify-center font-medium">
                {i + 1}
              </span>
              <span className="text-white font-medium">{card.playerName}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-3 mt-auto">
        <Button size="lg" fullWidth onClick={goToVote}>
          Перейти к голосованию
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={revealDirectly}>
          Завершить и раскрыть роли
        </Button>
      </div>
    </PageContainer>
  );
}
