import { useState } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface CreeCharacterPickerProps {
  onCharacterSelect: (char: string) => void;
}

const CREE_CHARACTERS = [
  { char: 'â', label: 'â (long a)' },
  { char: 'ê', label: 'ê (long e)' },
  { char: 'î', label: 'î (long i)' },
  { char: 'ô', label: 'ô (long o)' },
  { char: 'ā', label: 'ā (macron a)' },
  { char: 'ē', label: 'ē (macron e)' },
  { char: 'ī', label: 'ī (macron i)' },
  { char: 'ō', label: 'ō (macron o)' },
];

export function CreeCharacterPicker({ onCharacterSelect }: CreeCharacterPickerProps) {
  const [open, setOpen] = useState(false);

  const handleCharacterSelect = (char: string) => {
    onCharacterSelect(char);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100 font-semibold text-base touch-manipulation"
          title="Insert Cree special character"
          aria-label="Insert Cree special character"
          onClick={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          â
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 z-[100]"
        align="end"
        sideOffset={8}
        side="bottom"
      >
        <div className="space-y-2">
          <h4 className="font-medium text-sm mb-3">Cree Special Characters</h4>
          <div className="grid grid-cols-4 gap-2">
            {CREE_CHARACTERS.map(({ char, label }) => (
              <Button
                key={char}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleCharacterSelect(char)}
                className="h-10 text-lg font-medium hover:bg-blue-50 touch-manipulation"
                title={label}
              >
                {char}
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Click a character to insert it at the cursor position
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}