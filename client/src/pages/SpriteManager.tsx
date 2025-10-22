import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, CheckCircle2, XCircle, FileImage, Download, ArrowLeft, Search, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { SpriteImage } from "@/components/SpriteImage";
import { coromonList, PotentLevel, SpecialSkin, generateSpritePath } from "@shared/coromon-data";

interface UploadedSprite {
  name: string;
  status: "success" | "error" | "uploading";
  url?: string;
  error?: string;
}

interface SpriteManagerProps {
  onToggleTheme?: () => void;
  theme?: "light" | "dark";
}

export default function SpriteManager({ onToggleTheme, theme }: SpriteManagerProps = {}) {
  const [uploadedSprites, setUploadedSprites] = useState<UploadedSprite[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [availableSprites, setAvailableSprites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanning, setScanning] = useState(false);
  const { toast } = useToast();

  // Load available sprites from server
  useEffect(() => {
    fetch('/api/sprites/list')
      .then(res => res.json())
      .then(data => setAvailableSprites(data.sprites || []))
      .catch(() => setAvailableSprites([]));
  }, [uploadedSprites]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const sprites: UploadedSprite[] = acceptedFiles.map(file => ({
      name: file.name,
      status: "uploading" as const,
    }));

    setUploadedSprites(prev => [...prev, ...sprites]);

    const totalFiles = acceptedFiles.length;
    let processedFiles = 0;
    let successCount = 0;

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];

      try {
        if (!file.name.endsWith('.gif')) {
          throw new Error('Only GIF files are supported');
        }

        const formData = new FormData();
        formData.append('sprite', file);

        const response = await fetch('/api/sprites/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const data = await response.json();

        setUploadedSprites(prev =>
          prev.map(s =>
            s.name === file.name
              ? { ...s, status: "success" as const, url: data.url }
              : s
          )
        );
        successCount++;
      } catch (error) {
        setUploadedSprites(prev =>
          prev.map(s =>
            s.name === file.name
              ? { ...s, status: "error" as const, error: error instanceof Error ? error.message : 'Unknown error' }
              : s
          )
        );
      }

      processedFiles++;
      setUploadProgress((processedFiles / totalFiles) * 100);
    }

    setUploading(false);

    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${successCount} of ${totalFiles} sprites`,
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif']
    },
    multiple: true,
  });

  const successCount = uploadedSprites.filter(s => s.status === "success").length;
  const errorCount = uploadedSprites.filter(s => s.status === "error").length;

  const handleScanSprites = async () => {
    setScanning(true);
    try {
      const response = await fetch('/api/skins/scan', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const data = await response.json();

      toast({
        title: "Scan Complete",
        description: `Found and indexed ${data.skinsFound} skin variants`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  // Generate list of expected sprites for browsing
  const potentLevels: PotentLevel[] = ["A", "B", "C"];
  const specialSkins: SpecialSkin[] = ["None", "Crimsonite", "Retro", "Dino", "Chunky", "Robot", "Steampunk", "Galactic"];

  // Helper function to check if a coromon has a specific potent level for a given skin
  const hasPotentLevelForSkin = (coromonName: string, potent: PotentLevel, skin: SpecialSkin): boolean => {
    // For now, assume all standard potent levels (A, B, C) exist for all coromon
    // This is a simplified check since coromonList doesn't have potent level metadata
    return true;
  };


  const allPossibleSprites = coromonList.flatMap(coromon =>
    potentLevels.flatMap(potent =>
      specialSkins.map(skin => {
        const spriteFilename = generateSpritePath(coromon.name, potent, skin);
        // Check if this specific combination of potent and skin is valid for the coromon
        const isValidCombination = hasPotentLevelForSkin(coromon.name, potent, skin);
        return {
          coromon: coromon.name,
          potent,
          skin,
          filename: spriteFilename,
          exists: availableSprites.includes(spriteFilename),
          isValid: isValidCombination // Add validity check
        };
      })
    )
  ).filter(spriteInfo => spriteInfo.isValid); // Filter out combinations that are not valid


  const filteredSprites = searchQuery
    ? allPossibleSprites.filter(s =>
        s.coromon.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.filename.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPossibleSprites.slice(0, 100); // Show first 100 by default

  const totalExpected = allPossibleSprites.length;
  const totalAvailable = availableSprites.filter(filename =>
    allPossibleSprites.some(spriteInfo => spriteInfo.filename === filename)
  ).length;
  const coveragePercent = totalExpected > 0 ? Math.round((totalAvailable / totalExpected) * 100) : 0;


  return (
    <div className={cn("h-screen flex flex-col", theme === "dark" && "dark")}>
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="button-back">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Team
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold font-[Poppins]">Sprite Manager</h1>
              <p className="text-sm text-muted-foreground">
                Upload and manage your Coromon sprites
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Button
              onClick={handleScanSprites}
              disabled={scanning}
              data-testid="button-scan-sprites"
            >
              <Search className="h-4 w-4 mr-2" />
              {scanning ? "Scanning..." : "Scan Sprites"}
            </Button>
            {onToggleTheme && (
              <Button
                variant="outline"
                size="icon"
                onClick={onToggleTheme}
                data-testid="button-toggle-theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="upload" className="h-full">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="upload" data-testid="tab-upload">
                Upload Sprites
              </TabsTrigger>
              <TabsTrigger value="browse" data-testid="tab-browse">
                Browse & Check ({totalAvailable})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Upload Tab */}
          <TabsContent value="upload" className="m-0 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Instructions */}
              <Card className="p-6 bg-muted/50">
                <h3 className="font-semibold mb-2">Naming Convention</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Your sprite files should follow these naming patterns:
                </p>
                <div className="space-y-1 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code className="bg-background px-2 py-1 rounded">Ucaclaw_A.gif</code>
                    <span className="text-muted-foreground text-xs">(Standard)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code className="bg-background px-2 py-1 rounded">Toravolt_B.gif</code>
                    <span className="text-muted-foreground text-xs">(Potent)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code className="bg-background px-2 py-1 rounded">Infinix_C.gif</code>
                    <span className="text-muted-foreground text-xs">(Perfect)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <code className="bg-background px-2 py-1 rounded">Ucaclaw_Crimsonite_C.gif</code>
                    <span className="text-muted-foreground text-xs">(Special Skin)</span>
                  </div>
                </div>
              </Card>

              {/* Dropzone */}
              <Card
                {...getRootProps()}
                className={cn(
                  "p-12 border-2 border-dashed cursor-pointer transition-all hover:shadow-md",
                  isDragActive && "border-primary bg-primary/5",
                  uploading && "pointer-events-none opacity-50"
                )}
                data-testid="dropzone-sprites"
              >
                <input {...getInputProps()} data-testid="input-sprite-files" />
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Upload className="h-10 w-10 text-primary" />
                  </div>
                  {isDragActive ? (
                    <div>
                      <p className="text-lg font-semibold">Drop your sprites here</p>
                      <p className="text-sm text-muted-foreground">
                        All GIF files will be uploaded
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold">Drag & Drop sprites here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files (supports hundreds of files at once)
                      </p>
                    </div>
                  )}
                  <Button variant="outline" size="sm" disabled={uploading}>
                    <FileImage className="h-4 w-4 mr-2" />
                    Select Files
                  </Button>
                </div>
              </Card>

              {/* Upload Progress */}
              {uploading && (
                <Card className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Uploading sprites...</span>
                      <span className="text-muted-foreground">{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} />
                  </div>
                </Card>
              )}

              {/* Upload Stats */}
              {uploadedSprites.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="text-2xl font-bold">{successCount}</p>
                        <p className="text-sm text-muted-foreground">Successful</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <XCircle className="h-8 w-8 text-destructive" />
                      <div>
                        <p className="text-2xl font-bold">{errorCount}</p>
                        <p className="text-sm text-muted-foreground">Failed</p>
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <FileImage className="h-8 w-8 text-primary" />
                      <div>
                        <p className="text-2xl font-bold">{uploadedSprites.length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {/* Manual Upload Instructions */}
              <Card className="p-6 bg-muted/30">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Alternative: Manual Upload via File System
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  If you prefer to upload sprites directly through the file system:
                </p>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                  <li>Open the file manager in your Replit workspace</li>
                  <li>Navigate to the <code className="bg-background px-1 rounded">public/sprites/</code> folder</li>
                  <li>Drag and drop all your sprite GIF files into that folder</li>
                  <li>The sprites will be available immediately in the app</li>
                </ol>
              </Card>
            </div>
          </TabsContent>

          {/* Browse Tab */}
          <TabsContent value="browse" className="m-0 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Coverage Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 col-span-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Sprite Coverage</span>
                      <span className="text-2xl font-bold">{coveragePercent}%</span>
                    </div>
                    <Progress value={coveragePercent} />
                    <p className="text-xs text-muted-foreground">
                      {totalAvailable} of {totalExpected} possible sprite combinations
                    </p>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <FileImage className="h-8 w-8 text-primary" />
                    <div>
                      <p className="text-2xl font-bold">{totalAvailable}</p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Coromon or filename..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-sprites"
                />
              </div>

              {/* Sprite Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filteredSprites.map((sprite, idx) => (
                  <Card
                    key={`${sprite.filename}-${idx}`}
                    className={cn(
                      "p-3 relative",
                      sprite.exists ? "bg-card" : "bg-muted/30 opacity-60"
                    )}
                    data-testid={`sprite-card-${idx}`}
                  >
                    <div className="aspect-square rounded-md bg-muted/50 border mb-2 overflow-hidden">
                      <SpriteImage
                        spritePath={sprite.filename}
                        alt={sprite.coromon}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold truncate">{sprite.coromon}</p>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                          {sprite.potent}
                        </Badge>
                        {sprite.skin !== "None" && (
                          <Badge variant="secondary" className="text-[9px] px-1 py-0 h-4 truncate">
                            {sprite.skin}
                          </Badge>
                        )}
                      </div>
                      <Badge
                        variant={sprite.exists ? "default" : "outline"}
                        className="text-[9px] px-1 py-0 h-4 w-full justify-center"
                      >
                        {sprite.exists ? "Available" : "Missing"}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>

              {searchQuery && filteredSprites.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No sprites found matching "{searchQuery}"
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}