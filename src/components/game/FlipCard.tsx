"use client";

interface FlipCardProps {
  revealed: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  onReveal?: () => void;
}

export function FlipCard({ revealed, front, back }: FlipCardProps) {
  return (
    <div className="perspective-[1000px] w-full">
      <div
        className={[
          "relative w-full min-h-[280px] transition-transform duration-700 transform-style-preserve-3d",
          revealed ? "[transform:rotateY(180deg)]" : "",
        ].join(" ")}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute inset-0 backface-hidden rounded-3xl flex items-center justify-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 backface-hidden rounded-3xl flex items-center justify-center [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
