import { Team, generateSpritePath } from "@shared/coromon-data";
import { SpriteImage } from "./SpriteImage";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import type { Skin } from "@shared/schema";

interface OBSDisplayProps {
  team: Team;
  layout: "row" | "grid-2x3" | "grid-3x2" | "stack";
}

const SPRITE_SCALE = 2; // Set scale to 2x or 3x as requested

export function OBSDisplay({ team, layout, showNames }: OBSDisplayProps) {
  const { data: skinsData } = useQuery<{ skins: Skin[] }>({
    queryKey: ['/api/skins'],
    refetchInterval: 30000,
  });
  
  const allSkins = skinsData?.skins || [];

  return (
    <div
      className="w-full h-full flex items-center justify-center p-8"
      style={{ background: "transparent" }}
      data-testid="display-obs"
    >
      <div
        className={cn(
          "gap-6",
          layout === "row" && "flex flex-row flex-wrap justify-center",
          layout === "grid-2x3" && "grid grid-cols-2 gap-6",
          layout === "grid-3x2" && "grid grid-cols-3 gap-6",
          layout === "stack" && "flex flex-col"
        )}
      >
        {team.slots.map((slot) => {
          const skinData = slot.specialSkin !== "None" && slot.coromon
            ? allSkins.find(s => s.coromonName === slot.coromon && s.skinName === slot.specialSkin)
            : undefined;

          const spritePath = generateSpritePath(slot.coromon, slot.potentLevel, slot.specialSkin, {
            hasPotentVariant: skinData?.hasPotentVariant,
            potentLevels: skinData?.potentLevels || [],
            pattern: skinData?.pattern
          });

          return (
            <div
              key={slot.slot}
              className={cn(
                "relative flex flex-col items-center justify-center gap-3",
                layout === "row" && "w-52",
                layout === "grid-2x3" && "w-52",
                layout === "grid-3x2" && "w-52",
                layout === "stack" && "w-auto flex-row justify-start gap-4"
              )}
              data-testid={`display-slot-${slot.slot}`}
            >
              {/* Sprite Container */}
              <div className={cn(
                "flex items-center justify-center relative",
                layout === "stack" ? "w-40 h-40 shrink-0" : "w-48 h-48"
              )}>
                {slot.coromon && (
                  <SpriteImage
                    spritePath={spritePath}
                    alt={slot.coromon}
                    className={cn(layout === "stack" ? "w-40 h-40" : "w-48 h-48")}
                    style={{ transform: `scale(${SPRITE_SCALE})`, transformOrigin: "center" }}
                  />
                )}
              </div>

              {/* Coromon Name (Optional) */}
              {showNames && slot.coromon && (
                <div className={cn(
                  "text-center text-sm font-bold truncate",
                  layout === "stack" && "text-left"
                )}>
                  {slot.coromon}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}