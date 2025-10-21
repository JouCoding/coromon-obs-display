import { useState, useEffect } from "react";
import {
  Team,
  defaultTeam,
  PotentLevel,
  SpecialSkin,
} from "@shared/coromon-data";
import { TeamSlotCard } from "@/components/TeamSlotCard";
import { OBSDisplay } from "@/components/OBSDisplay";
import { ControlBar } from "@/components/ControlBar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Upload } from "lucide-react";

export default function TeamManager() {
  // Read URL parameters for initial state
  const getInitialLayout = (): "row" | "grid" | "stack" => {
    const params = new URLSearchParams(window.location.search);
    const layout = params.get("layout");
    if (layout === "row" || layout === "grid" || layout === "stack") {
      return layout;
    }
    return "grid";
  };

  const getInitialShowNames = (): boolean => {
    const params = new URLSearchParams(window.location.search);
    const showNames = params.get("showNames");
    return showNames === "true";
  };

  const [team, setTeam] = useState<Team>(defaultTeam);
  const [layout, setLayout] = useState<"row" | "grid" | "stack">(getInitialLayout());
  const [showNames, setShowNames] = useState(getInitialShowNames());
  const [activeTab, setActiveTab] = useState("editor");
  const { toast } = useToast();

  // Load team from server
  const loadTeamFromServer = async () => {
    try {
      const response = await fetch("/api/team");
      const data = await response.json();
      setTeam(data);
    } catch (e) {
      console.error("Failed to load team", e);
    }
  };

  // Load team and check URL parameters on mount
  useEffect(() => {
    loadTeamFromServer();

    // Poll server for changes every 2 seconds (for OBS and other browsers)
    const interval = setInterval(() => {
      loadTeamFromServer();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Check if we're in OBS display mode (clean view without UI)
  const isOBSMode = window.location.hash === "#display";

  const updateSlot = (
    slotNumber: number,
    updates: Partial<{
      coromon: string | null;
      potentLevel: PotentLevel;
      specialSkin: SpecialSkin;
    }>,
  ) => {
    setTeam((prev) => {
      const updatedTeam = {
        ...prev,
        slots: prev.slots.map((slot) =>
          slot.slot === slotNumber ? { ...slot, ...updates } : slot,
        ),
      };

      // Auto-save the team after any update
      saveTeam(updatedTeam);
      return updatedTeam;
    });
  };

  const saveTeam = async (updatedTeam: Team) => {
    try {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTeam),
      });
      toast({
        title: "Team Saved",
        description: "Your Coromon team has been saved successfully.",
      });
      console.log("Team saved:", updatedTeam);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save team",
        variant: "destructive",
      });
    }
  };

  const clearTeam = async () => {
    setTeam(defaultTeam);
    try {
      await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(defaultTeam),
      });
      toast({
        title: "Team Cleared",
        description: "All slots have been emptied.",
      });
      console.log("Team cleared");
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to clear team",
        variant: "destructive",
      });
    }
  };

  // If in OBS mode, render only the display
  if (isOBSMode) {
    return (
      <div className="h-screen w-screen">
        <OBSDisplay
          team={team}
          layout={layout}
          showNames={showNames}
        />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Control Bar */}
      <ControlBar
        layout={layout}
        onLayoutChange={setLayout}
        onSaveTeam={() => saveTeam(team)}
        onClearTeam={clearTeam}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="border-b px-4 flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="editor" data-testid="tab-editor">
                Team Editor
              </TabsTrigger>
              <TabsTrigger value="display" data-testid="tab-display">
                OBS Display
              </TabsTrigger>
              <TabsTrigger value="split" data-testid="tab-split">
                Split View
              </TabsTrigger>
            </TabsList>

            <Link href="/sprites">
              <Button
                variant="outline"
                size="sm"
                data-testid="button-manage-sprites"
              >
                <Upload className="h-4 w-4 mr-2" />
                Manage Sprites
              </Button>
            </Link>
          </div>

          {/* Editor Only */}
          <TabsContent value="editor" className="h-full m-0 overflow-auto">
            <div className="p-6">
              <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-[Poppins]">
                    Build Your Team
                  </h2>
                  <p className="text-muted-foreground">
                    Select up to 6 Coromon with their potent levels and special
                    skins
                  </p>

                  {/* OBS Browser Source Links */}
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                    <h3 className="text-sm font-semibold">
                      OBS Browser Source URLs
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Copy these URLs into OBS as Browser Sources. They will
                      automatically update when you save your team changes.
                    </p>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          Horizontal (Row) Layout:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/?layout=row#display`}
                            className="flex-1 text-xs px-3 py-2 bg-background border rounded font-mono"
                            onClick={(e) => e.currentTarget.select()}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/?layout=row#display`;
                              navigator.clipboard.writeText(url);
                              toast({
                                title: "Copied!",
                                description:
                                  "Horizontal layout URL copied to clipboard",
                              });
                            }}
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/?layout=row#display`;
                              window.open(url, "_blank");
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          Vertical (Stack) Layout:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={`${window.location.origin}/?layout=stack#display`}
                            className="flex-1 text-xs px-3 py-2 bg-background border rounded font-mono"
                            onClick={(e) => e.currentTarget.select()}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/?layout=stack#display`;
                              navigator.clipboard.writeText(url);
                              toast({
                                title: "Copied!",
                                description:
                                  "Vertical layout URL copied to clipboard",
                              });
                            }}
                          >
                            Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const url = `${window.location.origin}/?layout=stack#display`;
                              window.open(url, "_blank");
                            }}
                          >
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {team.slots.map((slot) => (
                    <TeamSlotCard
                      key={slot.slot}
                      slotNumber={slot.slot}
                      coromon={slot.coromon}
                      potentLevel={slot.potentLevel}
                      specialSkin={slot.specialSkin}
                      onCoromonChange={(coromon) =>
                        updateSlot(slot.slot, { coromon })
                      }
                      onPotentLevelChange={(potentLevel) =>
                        updateSlot(slot.slot, { potentLevel })
                      }
                      onSpecialSkinChange={(specialSkin) =>
                        updateSlot(slot.slot, { specialSkin })
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Display Only */}
          <TabsContent value="display" className="h-full m-0">
            <OBSDisplay
              team={team}
              layout={layout}
              showNames={showNames}
            />
          </TabsContent>

          {/* Split View */}
          <TabsContent value="split" className="h-full m-0 overflow-hidden">
            <div className="h-full grid lg:grid-cols-2 gap-0">
              {/* Editor Side */}
              <div className="overflow-auto border-r">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold font-[Poppins]">
                      Team Editor
                    </h3>
                  </div>
                  <div className="grid gap-4">
                    {team.slots.map((slot) => (
                      <TeamSlotCard
                        key={slot.slot}
                        slotNumber={slot.slot}
                        coromon={slot.coromon}
                        potentLevel={slot.potentLevel}
                        specialSkin={slot.specialSkin}
                        onCoromonChange={(coromon) =>
                          updateSlot(slot.slot, { coromon })
                        }
                        onPotentLevelChange={(potentLevel) =>
                          updateSlot(slot.slot, { potentLevel })
                        }
                        onSpecialSkinChange={(specialSkin) =>
                          updateSlot(slot.slot, { specialSkin })
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Display Side */}
              <div className="overflow-auto bg-muted/20">
                <div className="sticky top-0 bg-card border-b p-3 z-10">
                  <h3 className="text-sm font-semibold">OBS Display Preview</h3>
                </div>
                <OBSDisplay
                  team={team}
                  layout={layout}
                  showNames={showNames}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
