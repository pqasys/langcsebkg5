'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PricingRule {
  id?: string;
  startDate: string;
  endDate: string;
  price: number;
}

interface TimeBasedPricingRulesProps {
  courseId: string;
  initialRules?: PricingRule[];
  onRulesChange?: (rules: PricingRule[]) => void;
}

export function TimeBasedPricingRules({ courseId, initialRules = [], onRulesChange }: TimeBasedPricingRulesProps) {
  const [rules, setRules] = useState<PricingRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [newRule, setNewRule] = useState<PricingRule>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    price: 0
  });

  useEffect(() => {
    if (initialRules.length > 0) {
      setRules(initialRules);
    }
  }, [initialRules]);

  const handleAddRule = () => {
    if (newRule.startDate >= newRule.endDate) {
      toast.error('End date must be after start date');
      return;
    }

    // Check for overlapping rules
    const hasOverlap = rules.some(rule => 
      (newRule.startDate <= rule.endDate && newRule.endDate >= rule.startDate)
    );

    if (hasOverlap) {
      toast.error('This time period overlaps with an existing rule');
      return;
    }

    setRules(prevRules => {
      const newRules = [...prevRules, newRule];
      onRulesChange?.(newRules);
      return newRules;
    });

    setNewRule({
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      price: 0
    });
  };

  const handleDeleteRule = (index: number) => {
    setRules(prevRules => {
      const newRules = prevRules.filter((_, i) => i !== index);
      onRulesChange?.(newRules);
      return newRules;
    });
  };

  const saveRules = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${courseId}/pricing-rules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rules })
      });

      if (!response.ok) throw new Error(`Failed to save pricing rules - Context: if (!response.ok) throw new Error('Failed to save ...`);
      
      toast.success('Pricing rules saved successfully');
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error('Failed to save pricing rules');
      toast.error(`Failed to saving rules:. Please try again or contact support if the problem persists.`));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time-Based Pricing Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={newRule.startDate}
                onChange={(e) => setNewRule({ ...newRule, startDate: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={newRule.endDate}
                onChange={(e) => setNewRule({ ...newRule, endDate: e.target.value })}
                className="bg-white"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={newRule.price}
                onChange={(e) => setNewRule({ ...newRule, price: parseFloat(e.target.value) })}
                className="bg-white"
              />
            </div>
          </div>

          <Button onClick={handleAddRule} className="w-full">
            Add Rule
          </Button>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule, index) => (
                <TableRow key={index}>
                  <TableCell>{format(new Date(rule.startDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{format(new Date(rule.endDate), 'MMM d, yyyy')}</TableCell>
                  <TableCell>${rule.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRule(index)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Button 
            onClick={saveRules} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Saving...' : 'Save Pricing Rules'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 