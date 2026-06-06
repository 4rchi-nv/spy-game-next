"use client";

export const FLIP_DURATION_MS = 700;

interface FlipCardProps {
  revealed: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
  onFlipTransitionEnd?: (revealed: boolean) => void;
}

export function FlipCard({
  revealed,
  front,
  back,
  onFlipTransitionEnd,
}: FlipCardProps) {
  return (
    <div className="perspective-[1000px] w-full flex justify-center px-2">
      <div
        className={[
          "relative w-full max-w-[220px] sm:max-w-[260px] aspect-[5/7] transition-transform duration-700 transform-style-preserve-3d",
          revealed ? "[transform:rotateY(180deg)]" : "",
        ].join(" ")}
        style={{ transformStyle: "preserve-3d" }}
        onTransitionEnd={(e) => {
          if (e.propertyName !== "transform") return;
          onFlipTransitionEnd?.(revealed);
        }}
      >
        <div
          className="absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center overflow-hidden [transform:rotateY(180deg)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
