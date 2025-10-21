import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface SpriteImageProps {
  spritePath: string;
  alt: string;
  className?: string;
  showPath?: boolean;
}

export function SpriteImage({ spritePath, alt, className, showPath = false }: SpriteImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when sprite path changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [spritePath]);

  if (!spritePath) {
    return (
      <div className={cn("flex items-center justify-center bg-muted/30", className)}>
        <ImageOff className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  const spriteUrl = `/sprites/${spritePath}`;

  if (imageError) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted/30 p-2", className)}>
        <ImageOff className="h-6 w-6 text-muted-foreground/50 mb-1" />
        {showPath && (
          <span className="text-[8px] text-muted-foreground text-center break-all leading-tight">
            {spritePath}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", className)}>
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30">
          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <img
        key={spriteUrl}
        src={spriteUrl}
        alt={alt}
        className={cn(
          "max-w-full max-h-full object-contain transition-opacity",
          imageLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
