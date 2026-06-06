import { Spinner } from "@/components/ui/Spinner";

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Загрузка..." }: LoadingScreenProps) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 px-4">
      <Spinner size="lg" />
      <p className="mt-6 text-slate-400 text-sm sm:text-base">{message}</p>
    </div>
  );
}
