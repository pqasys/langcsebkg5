import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
}

export function Rating({
  value,
  onChange,
  max = 5,
  disabled = false,
  className,
  ...props
}: RatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);

  const handleMouseEnter = (index: number) => {
    if (!disabled) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoverValue(null);
    }
  };

  const handleClick = (index: number) => {
    if (!disabled && onChange) {
      onChange(index);
    }
  };

  const displayValue = hoverValue ?? value;

  return (
    <div
      className={cn("flex items-center gap-1", className)}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {Array.from({ length: max }).map((_, index) => (
        <button
          key={index}
          type="button"
          className={cn(
            "p-0.5 transition-colors",
            disabled ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          onMouseEnter={() => handleMouseEnter(index + 1)}
          onClick={() => handleClick(index + 1)}
          disabled={disabled}
        >
          <Star
            className={cn(
              "h-5 w-5",
              index < displayValue
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
} 