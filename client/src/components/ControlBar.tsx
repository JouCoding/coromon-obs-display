import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2 } from "lucide-react";

interface ControlBarProps {
  layout: "row" | "grid" | "stack";
  onLayoutChange: (layout: "row" | "grid" | "stack") => void;
  onClearTeam: () => void;
}

export function ControlBar({
  layout,
  onLayoutChange,
  onClearTeam,
}: ControlBarProps) {
  return (
    <div className="border-b bg-card p-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Layout Selector */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Display Layout:</Label>
          <RadioGroup
            value={layout}
            onValueChange={(value) =>
              onLayoutChange(value as "row" | "grid" | "stack")
            }
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="row" id="layout-row" />
              <Label htmlFor="layout-row" className="cursor-pointer font-normal">
                Horizontal
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="grid" id="layout-grid" />
              <Label htmlFor="layout-grid" className="cursor-pointer font-normal">
                Grid
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stack" id="layout-stack" />
              <Label htmlFor="layout-stack" className="cursor-pointer font-normal">
                Vertical
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={onClearTeam}
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10"
            data-testid="button-clear-team"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Team
          </Button>
        </div>
      </div>
    </div>
  );
}