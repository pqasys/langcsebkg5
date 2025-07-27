import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Location {
  code: string;
  name: string;
}

interface LocationSelectProps {
  type: 'country' | 'state' | 'city';
  value: string;
  onChange: (value: string) => void;
  countryCode?: string;
  stateCode?: string;
  disabled?: boolean;
  className?: string;
}

export function LocationSelect({
  type,
  value,
  onChange,
  countryCode,
  stateCode,
  disabled = false,
  className = '',
}: LocationSelectProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ type: `${type}s` });
        if (countryCode) params.append('countryCode', countryCode);
        if (stateCode) params.append('stateCode', stateCode);

        const response = await fetch(`/api/locations?${params.toString()}`);
        if (!response.ok) throw new Error(`Failed to fetch locations - Context: if (!response.ok) throw new Error('Failed to fetch...`);
        
        const data = await response.json();
        setLocations(data);
      } catch (error) {
    console.error('Error occurred:', error);
        toast.error(`Failed to load ${type}s:. Please try again or contact support if the problem persists.`));
      } finally {
        setLoading(false);
      }
    };

    if (type === 'country' || (type === 'state' && countryCode) || (type === 'city' && countryCode && stateCode)) {
      fetchLocations();
    }
  }, [type, countryCode, stateCode]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || loading}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={`Select ${type}`} />
      </SelectTrigger>
      <SelectContent>
        {locations.map((location) => (
          <SelectItem key={location.code} value={location.code}>
            {location.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 