import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function HomePage() {
  return (
    <div className="min-h-full flex flex-col bg-gradient-to-b from-slate-950 via-indigo-950/40 to-slate-950">
      <div className="mx-auto w-full max-w-lg flex-1 flex flex-col px-4 py-10 pb-12">
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-8">
          <div className="space-y-3">
            <div
              className="mx-auto w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-4xl shadow-lg shadow-indigo-900/40"
              aria-hidden
            >
              🕵️
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Шпион
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-sm mx-auto">
              Партийная игра для 3–15 человек. Один телефон — все по очереди смотрят
              карту, потом обсуждают и ищут шпиона.
            </p>
          </div>

          <Card className="w-full space-y-3" padding="lg">
            <Link href="/game/setup" className="block">
              <Button size="lg" fullWidth>
                Новая игра
              </Button>
            </Link>
            <Link href="/words" className="block">
              <Button variant="secondary" size="lg" fullWidth>
                База слов
              </Button>
            </Link>
            <Link href="/rules" className="block">
              <Button variant="outline" size="lg" fullWidth>
                Правила
              </Button>
            </Link>
          </Card>
        </div>

        <p className="text-center text-xs text-slate-600 mt-8">
          Передайте телефон по кругу — никто не должен подглядывать
        </p>
      </div>
    </div>
  );
}
