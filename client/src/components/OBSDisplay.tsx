import { Team, generateSpritePath } from "@shared/coromon-data";
import { Badge } from "@/components/ui/badge";
import { SpriteImage } from "./SpriteImage";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface OBSDisplayProps {
  team: Team;
  layout: "row" | "grid" | "stack";
  showNames: boolean;
  transparent: boolean;
}

export function OBSDisplay({ team, layout, showNames, transparent }: OBSDisplayProps) {
  const filledSlots = team.slots.filter(slot => slot.coromon !== null);

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
        {filledSlots.map((slot) => {
          const spritePath = generateSpritePath(slot.coromon, slot.potentLevel, slot.specialSkin);
          
          return (
            <div
              key={slot.slot}
              className={cn(
                "relative rounded-lg border backdrop-blur-md flex flex-col items-center justify-center gap-2 p-4",
                transparent ? "bg-card/80" : "bg-card",
                layout === "row" && "w-28",
                layout === "grid" && "w-32",
                layout === "stack" && "w-40 flex-row justify-start"
              )}
              data-testid={`display-slot-${slot.slot}`}
            >
              {/* Sprite Container */}
              <div className={cn(
                "bg-muted/50 rounded-md border flex items-center justify-center relative",
                layout === "stack" ? "w-16 h-16 shrink-0" : "w-20 h-20"
              )}>
                <SpriteImage
                  spritePath={spritePath}
                  alt={slot.coromon || "Empty"}
                  className="w-full h-full"
                />
                {slot.potentLevel !== "A" && (
                  <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-primary" />
                )}
              </div>
              
              {/* Name and Info */}
              {showNames && (
                <div className={cn(
                  "flex flex-col items-center gap-1",
                  layout === "stack" && "items-start flex-1"
                )}>
                  <span className="text-sm font-semibold text-foreground" data-testid={`text-name-${slot.slot}`}>
                    {slot.coromon}
                  </span>
                  <div className="flex gap-1 flex-wrap justify-center">
                    {slot.specialSkin !== "None" && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">
                        {slot.specialSkin}
                      </Badge>
                    )}
                    {slot.potentLevel !== "A" && (
                      <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                        {slot.potentLevel === "B" ? "Potent" : "Perfect"}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        
        {filledSlots.length === 0 && (
          <div className="text-center text-muted-foreground p-8">
            <p>No Coromon in team</p>
          </div>
        )}
      </div>
    </div>
  );
}
