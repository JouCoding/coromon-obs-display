import { OBSDisplay } from "../OBSDisplay";
import { Team } from "@shared/coromon-data";

export default function OBSDisplayExample() {
  const mockTeam: Team = {
    slots: [
      { slot: 1, coromon: "Ucaclaw", potentLevel: "C", specialSkin: "Crimsonite" },
      { slot: 2, coromon: "Toravolt", potentLevel: "B", specialSkin: "None" },
      { slot: 3, coromon: "Infinix", potentLevel: "A", specialSkin: "Retro" },
      { slot: 4, coromon: null, potentLevel: "A", specialSkin: "None" },
      { slot: 5, coromon: null, potentLevel: "A", specialSkin: "None" },
      { slot: 6, coromon: null, potentLevel: "A", specialSkin: "None" },
    ]
  };

  return (
    <div className="w-full h-96 bg-muted/20">
      <OBSDisplay team={mockTeam} layout="grid" showNames={true} transparent={false} />
    </div>
  );
}
