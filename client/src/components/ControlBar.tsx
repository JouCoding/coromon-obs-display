import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Trash2, Plus, FolderOpen } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ControlBarProps {
  onClearTeam: () => void;
  currentProfile: string;
  profiles: string[];
  onProfileSwitch: (profile: string) => void;
  onProfileCreate: (name: string) => void;
  onProfileDelete: (name: string) => void;
}

export function ControlBar({
  onClearTeam,
  currentProfile,
  profiles,
  onProfileSwitch,
  onProfileCreate,
  onProfileDelete,
}: ControlBarProps) {
  const [newProfileName, setNewProfileName] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      onProfileCreate(newProfileName.trim());
      setNewProfileName("");
      setIsCreateDialogOpen(false);
    }
  };

  return (
    <div className="border-b bg-card">
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        {/* Profile Selector */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Profile:</Label>
          <Select value={currentProfile} onValueChange={onProfileSwitch}>
            <SelectTrigger className="w-[180px]" data-testid="select-profile">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile} value={profile}>
                  {profile}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" data-testid="button-new-profile">
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Profile</DialogTitle>
                <DialogDescription>
                  Enter a name for your new team profile
                </DialogDescription>
              </DialogHeader>
              <Input
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Profile name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateProfile();
                }}
              />
              <DialogFooter>
                <Button onClick={handleCreateProfile}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {currentProfile !== "default" && (
            <Button
              onClick={() => onProfileDelete(currentProfile)}
              variant="ghost"
              size="sm"
              className="text-destructive"
              data-testid="button-delete-profile"
            >
              Delete Profile
            </Button>
          )}
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