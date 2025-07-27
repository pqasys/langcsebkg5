'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
// import { toast } from 'sonner';

// Common icon sets with their display names
const ICONS = [
  { name: 'GraduationCap', displayName: 'Graduation' },
  { name: 'BookOpen', displayName: 'Book' },
  { name: 'Calculator', displayName: 'Calculator' },
  { name: 'Camera', displayName: 'Camera' },
  { name: 'BarChart', displayName: 'Chart' },
  { name: 'Code', displayName: 'Code' },
  { name: 'Laptop', displayName: 'Computer' },
  { name: 'FileText', displayName: 'Document' },
  { name: 'Film', displayName: 'Film' },
  { name: 'Flag', displayName: 'Flag' },
  { name: 'Globe', displayName: 'Globe' },
  { name: 'Heart', displayName: 'Heart' },
  { name: 'Home', displayName: 'Home' },
  { name: 'Lightbulb', displayName: 'Light Bulb' },
  { name: 'Map', displayName: 'Map' },
  { name: 'Mic', displayName: 'Microphone' },
  { name: 'Music', displayName: 'Music' },
  { name: 'Pencil', displayName: 'Pencil' },
  { name: 'Presentation', displayName: 'Presentation' },
  { name: 'School', displayName: 'School' },
  { name: 'Star', displayName: 'Star' },
  { name: 'Tag', displayName: 'Tag' },
  { name: 'User', displayName: 'User' },
  { name: 'Video', displayName: 'Video' },
  { name: 'Wrench', displayName: 'Wrench' }
];

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  className?: string;
}

export function IconPicker({ value, onChange, className }: IconPickerProps) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  const filteredIcons = ICONS.filter(icon =>
    icon.name.toLowerCase().includes(search.toLowerCase()) ||
    icon.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const IconComponent = value ? (LucideIcons as any)[value] : null;

  const handleIconSelect = (iconName: string) => {
    try {
      onChange(iconName);
      setError(null);
      setOpen(false);
    } catch (err) {
      toast.error(`Failed to selecting icon. Please try again or contact support if the problem persists.`);
      setError('Failed to select icon. Please try again.');
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearch('');
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              'w-full h-10 p-2 flex items-center gap-2',
              error && 'border-red-500',
              className
            )}
          >
            {IconComponent ? (
              <>
                <IconComponent className="h-5 w-5" />
                <span className="text-sm">{ICONS.find(i => i.name === value)?.displayName}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Select icon</span>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 p-2 border-b">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search icons..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setOpen(false);
                  }
                }}
              />
            </div>
            <ScrollArea className="flex-1 max-h-[300px]">
              <div className="grid grid-cols-6 gap-1 p-1">
                {filteredIcons.map((icon) => {
                  const Icon = (LucideIcons as any)[icon.name];
                  return (
                    <button
                      type="button"
                      key={icon.name}
                      className={cn(
                        'flex items-center justify-center h-8 w-8 rounded-md border border-input bg-white hover:bg-accent hover:text-accent-foreground',
                        value === icon.name && 'bg-accent text-accent-foreground'
                      )}
                      onClick={() => handleIconSelect(icon.name)}
                      title={icon.displayName}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
} 