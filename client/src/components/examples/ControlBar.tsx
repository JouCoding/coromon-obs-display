import { useState } from "react";
import { ControlBar } from "../ControlBar";

export default function ControlBarExample() {
  const [layout, setLayout] = useState<"row" | "grid" | "stack">("grid");
  const [showNames, setShowNames] = useState(true);
  const [transparent, setTransparent] = useState(false);

  return (
    <div className="w-full">
      <ControlBar
        layout={layout}
        onLayoutChange={setLayout}
        showNames={showNames}
        onShowNamesChange={setShowNames}
        transparent={transparent}
        onTransparentChange={setTransparent}
        onSaveTeam={() => console.log("Save team")}
        onClearTeam={() => console.log("Clear team")}
      />
    </div>
  );
}
