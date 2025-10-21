import { useState, useEffect } from "react";
import { Team, defaultTeam, PotentLevel, SpecialSkin } from "@shared/coromon-data";
import { TeamSlotCard } from "@/components/TeamSlotCard";
import { OBSDisplay } from "@/components/OBSDisplay";
import { ControlBar } from "@/components/ControlBar";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Upload } from "lucide-react";

const STORAGE_KEY = "coromon-team";

export default function TeamManager() {
  const [team, setTeam] = useState<Team>(defaultTeam);
  const [layout, setLayout] = useState<"row" | "grid" | "stack">("grid");
  const [showNames, setShowNames] = useState(true);
  const [transparent, setTransparent] = useState(false);
  const { toast } = useToast();

  // Load team from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTeam(parsed);
      } catch (e) {
        console.error("Failed to load saved team", e);
      }
    }
  }, []);

  const updateSlot = (
    slotNumber: number,
    updates: Partial<{
      coromon: string | null;
      potentLevel: PotentLevel;
      specialSkin: SpecialSkin;
    }>
  ) => {
    setTeam((prev) => ({
      slots: prev.slots.map((slot) =>
        slot.slot === slotNumber ? { ...slot, ...updates } : slot
      ),
    }));
  };

  const saveTeam = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(team));
    toast({
      title: "Team Saved",
      description: "Your Coromon team has been saved successfully.",
    });
    console.log("Team saved:", team);
  };

  const clearTeam = () => {
    setTeam(defaultTeam);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Team Cleared",
      description: "All slots have been emptied.",
    });
    console.log("Team cleared");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Control Bar */}
      <ControlBar
        layout={layout}
        onLayoutChange={setLayout}
        showNames={showNames}
        onShowNamesChange={setShowNames}
        transparent={transparent}
        onTransparentChange={setTransparent}
        onSaveTeam={saveTeam}
        onClearTeam={clearTeam}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="editor" className="h-full">
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
              <Button variant="outline" size="sm" data-testid="button-manage-sprites">
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
                  <h2 className="text-2xl font-bold font-[Poppins]">Build Your Team</h2>
                  <p className="text-muted-foreground">
                    Select up to 6 Coromon with their potent levels and special skins
                  </p>
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
              transparent={transparent}
            />
          </TabsContent>

          {/* Split View */}
          <TabsContent value="split" className="h-full m-0 overflow-hidden">
            <div className="h-full grid lg:grid-cols-2 gap-0">
              {/* Editor Side */}
              <div className="overflow-auto border-r">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold font-[Poppins]">Team Editor</h3>
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
                  transparent={transparent}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
