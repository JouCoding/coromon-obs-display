import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle2, XCircle, FileImage, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface UploadedSprite {
  name: string;
  status: "success" | "error" | "uploading";
  url?: string;
  error?: string;
}

export default function SpriteManager() {
  const [uploadedSprites, setUploadedSprites] = useState<UploadedSprite[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const sprites: UploadedSprite[] = acceptedFiles.map(file => ({
      name: file.name,
      status: "uploading" as const,
    }));

    setUploadedSprites(prev => [...prev, ...sprites]);

    // Process files
    const totalFiles = acceptedFiles.length;
    let processedFiles = 0;

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      
      try {
        // Validate file is a GIF
        if (!file.name.endsWith('.gif')) {
          throw new Error('Only GIF files are supported');
        }

        // Create FormData and upload
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
    
    const successCount = uploadedSprites.filter(s => s.status === "success").length + acceptedFiles.filter((_, i) => uploadedSprites[uploadedSprites.length + i]?.status === "success").length;
    
    toast({
      title: "Upload Complete",
      description: `Successfully uploaded ${successCount} of ${totalFiles} sprites`,
    });
  }, [uploadedSprites, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/gif': ['.gif']
    },
    multiple: true,
  });

  const successCount = uploadedSprites.filter(s => s.status === "success").length;
  const errorCount = uploadedSprites.filter(s => s.status === "error").length;

  return (
    <div className="h-full overflow-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold font-[Poppins]">Sprite Manager</h1>
          <p className="text-muted-foreground mt-1">
            Upload your Coromon sprite GIF files in bulk
          </p>
        </div>

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
            "p-12 border-2 border-dashed cursor-pointer transition-all hover-elevate",
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
          <div className="flex gap-4">
            <Card className="flex-1 p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{successCount}</p>
                  <p className="text-sm text-muted-foreground">Successful</p>
                </div>
              </div>
            </Card>
            <Card className="flex-1 p-4">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">{errorCount}</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </Card>
            <Card className="flex-1 p-4">
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

        {/* Uploaded Files List */}
        {uploadedSprites.length > 0 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Uploaded Sprites</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadedSprites([])}
                data-testid="button-clear-list"
              >
                Clear List
              </Button>
            </div>
            <div className="space-y-2 max-h-96 overflow-auto">
              {uploadedSprites.map((sprite, index) => (
                <div
                  key={`${sprite.name}-${index}`}
                  className="flex items-center justify-between p-3 rounded-md border bg-card/50"
                  data-testid={`sprite-item-${index}`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {sprite.status === "success" && (
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                    )}
                    {sprite.status === "error" && (
                      <XCircle className="h-4 w-4 text-destructive shrink-0" />
                    )}
                    {sprite.status === "uploading" && (
                      <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                    <span className="font-mono text-sm truncate">{sprite.name}</span>
                  </div>
                  <Badge
                    variant={
                      sprite.status === "success"
                        ? "default"
                        : sprite.status === "error"
                        ? "destructive"
                        : "secondary"
                    }
                    className="ml-2 shrink-0"
                  >
                    {sprite.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
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
    </div>
  );
}
