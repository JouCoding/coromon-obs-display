import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Save, Trash2 } from "lucide-react";

interface ControlBarProps {
  layout: "row" | "grid" | "stack";
  onLayoutChange: (layout: "row" | "grid" | "stack") => void;
  onSaveTeam: () => void;
  onClearTeam: () => void;
}

export function ControlBar({
  layout,
  onLayoutChange,
  onSaveTeam,
  onClearTeam,
}: ControlBarProps) {
  return (
    <div className="border-b bg-card p-4">
      <div className="flex flex-wrap items-center gap-6">
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={onSaveTeam}
            size="sm"
            data-testid="button-save-team"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Team
          </Button>
          <Button
            onClick={onClearTeam}
            variant="outline"
            size="sm"
            data-testid="button-clear-team"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </div>

        <div className="h-6 w-px bg-border" />

        {/* Layout Selector */}
        <div className="flex items-center gap-2">
          <Label htmlFor="layout" className="text-sm whitespace-nowrap">
            OBS Layout
          </Label>
          <Select value={layout} onValueChange={(value) => onLayoutChange(value as any)}>
            <SelectTrigger className="w-32" id="layout" data-testid="select-layout">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Row</SelectItem>
              <SelectItem value="grid">Grid 3x2</SelectItem>
              <SelectItem value="stack">Stack</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
