import { useState } from "react";
import { CoromonSelector } from "../CoromonSelector";

export default function CoromonSelectorExample() {
  const [value, setValue] = useState<string | null>("Ucaclaw");
  
  return (
    <div className="p-4 w-full max-w-md">
      <CoromonSelector value={value} onValueChange={setValue} />
    </div>
  );
}
