import { Team, generateSpritePath } from "@shared/coromon-data";
import { SpriteImage } from "./SpriteImage";
import { cn } from "@/lib/utils";

interface OBSDisplayProps {
  team: Team;
  layout: "row" | "grid" | "stack";
  showNames: boolean;
  transparent: boolean;
}

export function OBSDisplay({ team, layout, showNames, transparent }: OBSDisplayProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center p-8",
        transparent ? "bg-transparent" : "bg-background/90"
      )}
      data-testid="display-obs"
    >
      <div
        className={cn(
          "gap-4",
          layout === "row" && "flex flex-row flex-wrap justify-center",
          layout === "grid" && "grid grid-cols-3 gap-4",
          layout === "stack" && "flex flex-col"
        )}
      >
        {team.slots.map((slot) => {
          const spritePath = generateSpritePath(slot.coromon, slot.potentLevel, slot.specialSkin);
          
          return (
            <div
              key={slot.slot}
              className={cn(
                "relative flex flex-col items-center justify-center gap-2",
                layout === "row" && "w-28",
                layout === "grid" && "w-32",
                layout === "stack" && "w-40 flex-row justify-start"
              )}
              data-testid={`display-slot-${slot.slot}`}
            >
              {/* Sprite Container */}
              <div className={cn(
                "flex items-center justify-center relative",
                layout === "stack" ? "w-16 h-16 shrink-0" : "w-20 h-20"
              )}>
                {slot.coromon && (
                  <SpriteImage
                    spritePath={spritePath}
                    alt={slot.coromon}
                    className="w-full h-full"
                  />
                )}
              </div>
              
              {/* Name */}
              {showNames && slot.coromon && (
                <div className={cn(
                  "flex flex-col items-center gap-1",
                  layout === "stack" && "items-start flex-1"
                )}>
                  <span className="text-sm font-semibold text-foreground" data-testid={`text-name-${slot.slot}`}>
                    {slot.coromon}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
