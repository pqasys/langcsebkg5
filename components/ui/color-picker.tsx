'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
// import { toast } from 'sonner';

// Predefined colors for quick selection
const PREDEFINED_COLORS = [
  '#000000', // Black
  '#FFFFFF', // White
  '#FF0000', // Red
  '#00FF00', // Green
  '#0000FF', // Blue
  '#FFFF00', // Yellow
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#808080', // Gray
  '#800000', // Maroon
  '#808000', // Olive
  '#008000', // Dark Green
  '#800080', // Purple
  '#008080', // Teal
  '#000080', // Navy
  '#FFA500', // Orange
  '#A52A2A', // Brown
  '#FFC0CB', // Pink
  '#DDA0DD', // Plum
  '#F0E68C', // Khaki
  '#E6E6FA', // Lavender
  '#98FB98', // Pale Green
  '#AFEEEE', // Pale Turquoise
  '#D8BFD8', // Thistle
  '#FFE4B5', // Moccasin
  '#FFE4E1', // Misty Rose
  '#F0FFF0', // Honeydew
  '#F5F5DC', // Beige
  '#FAEBD7', // Antique White
  '#F0F8FF', // Alice Blue
  '#F5F5F5', // White Smoke
  '#FFF0F5', // Lavender Blush
  '#FFFACD', // Lemon Chiffon
  '#FFF8DC', // Cornsilk
  '#FFFAFA', // Snow
  '#FFFFF0', // Ivory
  '#FAFFF0', // Mint Cream
  '#F0FFFF', // Azure
  '#F5FFFA', // Mint Cream
  '#FFFAF0', // Floral White
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [customColor, setCustomColor] = React.useState(value || '#000000');

  React.useEffect(() => {
    setCustomColor(value || '#000000');
  }, [value]);

  const handleColorSelect = (color: string) => {
    try {
      onChange(color);
      setCustomColor(color);
      setError(null);
    } catch (err) {
      // toast.error(`Failed to in handleColorSelect. Please try again or contact support if the problem persists.`);
      setError('Failed to select color. Please try again.');
    }
  };

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newColor = e.target.value;
    
    // Add # if missing
    if (!newColor.startsWith('#')) {
      newColor = '#' + newColor;
    }
    
    setCustomColor(newColor);
    
    // Validate hex color format
    if (newColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)) {
      handleColorSelect(newColor);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleColorSelect(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2 px-1" role="group" aria-label="Predefined colors">
        {PREDEFINED_COLORS.map((color) => (
          <button
            type="button"
            key={color}
            className={cn(
              'h-8 w-8 flex-shrink-0 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-all duration-200',
              value === color && 'ring-2 ring-blue-500 ring-offset-2 border-blue-500'
            )}
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`Select color ${color}`}
            title={`Color: ${color}`}
          />
        ))}
      </div>
      <div className="mt-2">
        <Label htmlFor="custom-color" className="text-sm font-medium text-gray-900 dark:text-gray-100">Custom Color</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="custom-color"
            type="color"
            value={customColor}
            onChange={handleColorInputChange}
            className="h-8 w-8 p-0 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            aria-label="Choose custom color"
          />
          <Input
            type="text"
            value={customColor}
            onChange={handleHexInputChange}
            placeholder="#000000"
            className="h-8 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            aria-label="Enter custom color hex code"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>}
    </div>
  );
} 