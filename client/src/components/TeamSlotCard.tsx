import { useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CoromonSelector } from "./CoromonSelector";
import { SpriteImage } from "./SpriteImage";
import { PotentLevel, SpecialSkin, generateSpritePath } from "@shared/coromon-data";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Skin } from "@shared/schema";

interface TeamSlotCardProps {
  slotNumber: number;
  coromon: string | null;
  potentLevel: PotentLevel;
  specialSkin: SpecialSkin;
  onCoromonChange: (coromon: string | null) => void;
  onPotentLevelChange: (level: PotentLevel) => void;
  onSpecialSkinChange: (skin: SpecialSkin) => void;
}

export function TeamSlotCard({
  slotNumber,
  coromon,
  potentLevel,
  specialSkin,
  onCoromonChange,
  onPotentLevelChange,
  onSpecialSkinChange,
}: TeamSlotCardProps) {
  const { data: skinsData } = useQuery<{ skins: Skin[] }>({
    queryKey: ['/api/skins'],
    refetchInterval: 30000,
  });
  
  const allSkins = skinsData?.skins || [];
  
  const availableSkins = useMemo(() => {
    if (!coromon) return ["None"];
    
    const coromonSkins = allSkins.filter(s => s.coromonName === coromon);
    const skinNames = coromonSkins.map(s => s.skinName);
    
    return ["None", ...skinNames.filter(name => name !== "None")];
  }, [coromon, allSkins]);

  const currentSkinData = useMemo(() => {
    if (!coromon || specialSkin === "None") return undefined;
    
    return allSkins.find(s => s.coromonName === coromon && s.skinName === specialSkin);
  }, [coromon, specialSkin, allSkins]);
  
  // Reset skin if current selection is not available
  useEffect(() => {
    if (coromon && specialSkin && !availableSkins.includes(specialSkin)) {
      onSpecialSkinChange("None");
    }
  }, [coromon, specialSkin, availableSkins, onSpecialSkinChange]);
  
  const spritePath = generateSpritePath(coromon, potentLevel, specialSkin, {
    hasPotentVariant: currentSkinData?.hasPotentVariant,
    potentLevels: currentSkinData?.potentLevels || [],
    pattern: currentSkinData?.pattern
  });

  return (
    <Card className="p-4" data-testid={`card-slot-${slotNumber}`}>
      <div className="flex flex-col gap-4">
        {/* Slot Header */}
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="font-semibold" data-testid={`badge-slot-${slotNumber}`}>
            Slot {slotNumber}
          </Badge>
          {coromon && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => onCoromonChange(null)}
              data-testid={`button-clear-slot-${slotNumber}`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sprite Preview */}
        <div className="relative flex items-center justify-center h-32 rounded-md bg-muted/50 border-2 border-dashed border-border">
          {coromon ? (
            <div className="flex flex-col items-center gap-2 w-full h-full p-2">
              <SpriteImage
                spritePath={spritePath}
                alt={coromon}
                className="flex-1 w-full"
                showPath={false}
              />
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Empty Slot</span>
          )}
        </div>

        {/* Sprite Filename */}
        {coromon && (
          <div className="text-[10px] font-mono text-muted-foreground text-center break-all bg-muted/30 rounded px-2 py-1">
            {spritePath}
          </div>
        )}

        {/* Coromon Selector */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Coromon</Label>
          <CoromonSelector value={coromon} onValueChange={onCoromonChange} />
        </div>

        {/* Potent Level */}
        {coromon && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Potent Level</Label>
            <RadioGroup
              value={potentLevel}
              onValueChange={(value) => onPotentLevelChange(value as PotentLevel)}
              className="flex gap-4"
              data-testid={`radio-potent-${slotNumber}`}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="A" id={`slot-${slotNumber}-a`} data-testid={`radio-potent-a-${slotNumber}`} />
                <Label htmlFor={`slot-${slotNumber}-a`} className="cursor-pointer font-normal">
                  Standard (A)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="B" id={`slot-${slotNumber}-b`} data-testid={`radio-potent-b-${slotNumber}`} />
                <Label htmlFor={`slot-${slotNumber}-b`} className="cursor-pointer font-normal">
                  Potent (B)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="C" id={`slot-${slotNumber}-c`} data-testid={`radio-potent-c-${slotNumber}`} />
                <Label htmlFor={`slot-${slotNumber}-c`} className="cursor-pointer font-normal">
                  Perfect (C)
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Special Skin */}
        {coromon && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Special Skin</Label>
            <Select value={specialSkin} onValueChange={(value) => onSpecialSkinChange(value as SpecialSkin)}>
              <SelectTrigger data-testid={`select-skin-${slotNumber}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableSkins.map((skin) => (
                  <SelectItem key={skin} value={skin}>
                    {skin}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
}
