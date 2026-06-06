"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { PageContainer } from "@/components/ui/PageContainer";
import { useGame } from "@/components/game/GameProvider";

export default function GameVotePage() {
  const router = useRouter();
  const { state, isReady, setVotedPlayer, setPhase } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(
    () => state?.votedPlayerId ?? null
  );
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!state) router.replace("/game/setup");
  }, [isReady, state, router]);

  if (!isReady || !state) {
    return <LoadingScreen />;
  }

  const { game } = state;
  const selectedCard = game.cards.find((c) => c.playerId === selectedId);

  const handleShowResult = () => {
    if (!selectedId) return;
    setVotedPlayer(selectedId);
    setShowResult(true);
  };

  const goToFinal = () => {
    setPhase("results");
    router.push("/game/results");
  };

  return (
    <PageContainer
      title="Голосование"
      subtitle="Кого подозреваете в шпионаже?"
      backHref="/game/discussion"
    >
      <Card className="space-y-2">
        {game.cards.map((card) => {
          const isSelected = selectedId === card.playerId;
          return (
            <button
              key={card.playerId}
              type="button"
              onClick={() => {
                setSelectedId(card.playerId);
                setShowResult(false);
              }}
              className={[
                "w-full flex items-center gap-3 rounded-xl px-4 py-4 text-left transition-all",
                isSelected
                  ? "bg-indigo-600/30 border-2 border-indigo-500"
                  : "bg-slate-800/60 border-2 border-transparent hover:bg-slate-800",
              ].join(" ")}
            >
              <span
                className={[
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                  isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-500",
                ].join(" ")}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </span>
              <span className="text-white font-medium text-lg">
                {card.playerName}
              </span>
            </button>
          );
        })}
      </Card>

      {showResult && selectedCard && (
        <Card
          className={[
            "text-center space-y-2 border-2",
            selectedCard.role === "spy"
              ? "border-emerald-500/50 bg-emerald-950/30"
              : "border-red-500/50 bg-red-950/30",
          ].join(" ")}
          padding="lg"
        >
          <p className="text-4xl" aria-hidden>
            {selectedCard.role === "spy" ? "🎯" : "❌"}
          </p>
          <h2 className="text-xl font-bold text-white">
            {selectedCard.playerName}
          </h2>
          <p
            className={[
              "text-lg font-medium",
              selectedCard.role === "spy" ? "text-emerald-400" : "text-red-400",
            ].join(" ")}
          >
            {selectedCard.role === "spy"
              ? "Это шпион! Вы угадали."
              : "Это не шпион. Промах!"}
          </p>
        </Card>
      )}

      <div className="space-y-3 mt-auto">
        {!showResult ? (
          <Button
            size="lg"
            fullWidth
            disabled={!selectedId}
            onClick={handleShowResult}
          >
            Показать результат
          </Button>
        ) : (
          <Button size="lg" fullWidth onClick={goToFinal}>
            Раскрыть все роли
          </Button>
        )}
        <Button
          variant="ghost"
          size="md"
          fullWidth
          onClick={goToFinal}
        >
          Пропустить и раскрыть роли
        </Button>
      </div>
    </PageContainer>
  );
}
