'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EnhancedSwitch } from '@/components/ui/enhanced-switch';
// import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FaSpinner } from 'react-icons/fa';

interface DiscountSettings {
  enabled: boolean;
  startingRate: number;
  incrementRate: number;
  incrementPeriodWeeks: number;
  maxDiscountCap: number;
}

export function DiscountSettingsForm() {
  const [settings, setSettings] = useState<DiscountSettings>({
    enabled: false,
    startingRate: 5,
    incrementRate: 2.5,
    incrementPeriodWeeks: 4,
    maxDiscountCap: 50
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/institution/settings/discount');
        if (!response.ok) {
          throw new Error(`Failed to fetch discount settings - Context: throw new Error('Failed to fetch discount settings...`);
        }
        const data = await response.json();
        setSettings(data);
      } catch (error) {
    console.error('Error occurred:', error);
        // toast.error(`Failed to load discount settings:. Please try again or contact support if the problem persists.`));
        // toast.error('Failed to load discount settings');
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/institution/settings/discount', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Failed to update discount settings - Context: body: JSON.stringify(settings),...`);
      }

      // toast.success('Discount settings updated successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error(`Failed to updating discount settings:. Please try again or contact support if the problem persists.`));
      // toast.error('Failed to update discount settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof DiscountSettings, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: typeof value === 'boolean' ? value : parseFloat(value)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Settings</CardTitle>
        <CardDescription>
          Configure how discounts are calculated for course enrollments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <EnhancedSwitch
            id="enabled"
            checked={settings.enabled}
            onCheckedChange={(checked) => handleChange('enabled', checked)}
            label="Enable Progressive Discounts"
            description={settings.enabled 
              ? "Progressive discounts are active. Students will receive increasing discounts based on enrollment duration."
              : "Progressive discounts are disabled. Students will pay standard pricing."
            }
            activeColor="green"
            inactiveColor="red"
            activeText="ENABLED"
            inactiveText="DISABLED"
            className="mb-4"
          />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startingRate">Starting Discount Rate (%)</Label>
              <Input
                id="startingRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.startingRate}
                onChange={(e) => handleChange('startingRate', e.target.value)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="incrementRate">Discount Increment (%)</Label>
              <Input
                id="incrementRate"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.incrementRate}
                onChange={(e) => handleChange('incrementRate', e.target.value)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="incrementPeriodWeeks">Increment Period (Weeks)</Label>
              <Input
                id="incrementPeriodWeeks"
                type="number"
                min="1"
                value={settings.incrementPeriodWeeks}
                onChange={(e) => handleChange('incrementPeriodWeeks', e.target.value)}
                disabled={!settings.enabled}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxDiscountCap">Maximum Discount Cap (%)</Label>
              <Input
                id="maxDiscountCap"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.maxDiscountCap}
                onChange={(e) => handleChange('maxDiscountCap', e.target.value)}
                disabled={!settings.enabled}
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoading} className="bg-blue-600 text-white hover:bg-blue-700">
            {isLoading ? (
              <>
                {/* <FaSpinner className="mr-2 h-4 w-4 animate-spin" /> */}
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 