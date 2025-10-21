import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { coromonList, generateSpritePath } from "@shared/coromon-data";
import { SpriteImage } from "./SpriteImage";

interface CoromonSelectorProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
}

export function CoromonSelector({ value, onValueChange }: CoromonSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-medium"
          data-testid="button-select-coromon"
        >
          <div className="flex items-center gap-2">
            {value && (
              <div className="w-6 h-6 flex-shrink-0">
                <SpriteImage
                  spritePath={generateSpritePath(value, "A", "None")}
                  alt={value}
                  className="w-full h-full"
                />
              </div>
            )}
            <span>{value ? value : "Select Coromon..."}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search Coromon..." data-testid="input-search-coromon" />
          <CommandList>
            <CommandEmpty>No Coromon found.</CommandEmpty>
            <CommandGroup>
              {coromonList.map((coromon) => (
                <CommandItem
                  key={coromon}
                  value={coromon}
                  onSelect={(currentValue) => {
                    onValueChange(currentValue === value ? null : currentValue);
                    setOpen(false);
                  }}
                  data-testid={`item-coromon-${coromon.toLowerCase()}`}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === coromon ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="w-8 h-8 flex-shrink-0">
                    <SpriteImage
                      spritePath={generateSpritePath(coromon, "A", "None")}
                      alt={coromon}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="flex-1">{coromon}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
