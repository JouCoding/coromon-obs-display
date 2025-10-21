import { useState } from "react";
import { TeamSlotCard } from "../TeamSlotCard";
import { PotentLevel, SpecialSkin } from "@shared/coromon-data";

export default function TeamSlotCardExample() {
  const [coromon, setCoromon] = useState<string | null>("Ucaclaw");
  const [potentLevel, setPotentLevel] = useState<PotentLevel>("C");
  const [specialSkin, setSpecialSkin] = useState<SpecialSkin>("Crimsonite");

  return (
    <div className="p-4 w-full max-w-md">
      <TeamSlotCard
        slotNumber={1}
        coromon={coromon}
        potentLevel={potentLevel}
        specialSkin={specialSkin}
        onCoromonChange={setCoromon}
        onPotentLevelChange={setPotentLevel}
        onSpecialSkinChange={setSpecialSkin}
      />
    </div>
  );
}
