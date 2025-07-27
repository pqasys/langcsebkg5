'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Check, Pencil, Search, Download, Upload, RefreshCw, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Helper function to calculate weekly price with progressive discounts
function calculateWeeklyPrice(weekNumber: number, basePrice: number = 0) {
  // Calculate discount rate based on week number
  // Every 4 weeks, increase discount by 2.5%, starting from 5%
  const discountRate = Math.floor((weekNumber - 1) / 4) * 2.5 + 5;
  const discount = Math.min(discountRate, 50); // Cap maximum discount at 50%
  
  // Calculate total price for all weeks up to current week
  const totalPrice = basePrice * weekNumber;
  
  // Apply discount to total price
  const discountedPrice = totalPrice * (1 - discount / 100);
  
  // Round to nearest whole number
  return Math.round(discountedPrice);
}

interface WeeklyPrice {
  id?: string;
  weekNumber: number;
  year: number;
  price: number;
  discount?: number;
}

interface WeeklyPricingTableProps {
  courseId: string;
  initialPrices: WeeklyPrice[];
  basePrice: number;
  onPricesChange?: (prices: WeeklyPrice[]) => void;
  onClose?: () => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
}

export function WeeklyPricingTable({ 
  courseId, 
  initialPrices = [], 
  basePrice,
  onPricesChange,
  onClose,
  onUnsavedChangesChange
}: WeeklyPricingTableProps) {
  const [prices, setPrices] = useState<WeeklyPrice[]>(() => {
    if (initialPrices.length > 0) {
      return initialPrices;
    }
    return Array.from({ length: 52 }, (_, i) => {
      const weekNumber = i + 1;
      return {
        weekNumber,
        year: new Date().getFullYear(),
        price: calculateWeeklyPrice(weekNumber, basePrice)
      };
    });
  });
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isTableEditable, setIsTableEditable] = useState(false);
  const [editableWeeks, setEditableWeeks] = useState<Set<number>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialBasePrice] = useState(basePrice);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'custom' | 'default'>('all');
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Check if base price has changed
  const hasBasePriceChanged = basePrice !== initialBasePrice;

  // Show warning if base price has changed
  useEffect(() => {
    if (hasBasePriceChanged) {
      toast.error('Base price has changed. Please save the course changes before managing prices.');
      onClose?.();
    }
  }, [hasBasePriceChanged, onClose]);

  // Add function to calculate discount percentage
  const calculateDiscountPercentage = (weekNumber: number) => {
    // Calculate discount rate based on week number
    // Every 4 weeks, increase discount by 2.5%, starting from 5%
    const discountRate = Math.floor((weekNumber - 1) / 4) * 2.5 + 5;
    return Math.min(discountRate, 50); // Cap maximum discount at 50%
  };

  // Add function to calculate base total
  const calculateBaseTotal = (weekNumber: number) => {
    return basePrice * weekNumber;
  };

  // Filter prices based on search and view mode
  const filteredPrices = useMemo(() => {
    let filtered = prices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(price => 
        price.weekNumber.toString().includes(searchTerm) ||
        price.price.toString().includes(searchTerm)
      );
    }

    // Filter by view mode
    if (viewMode === 'custom') {
      filtered = filtered.filter(price => {
        const expectedPrice = calculateWeeklyPrice(price.weekNumber, basePrice);
        return price.price !== expectedPrice;
      });
    } else if (viewMode === 'default') {
      filtered = filtered.filter(price => {
        const expectedPrice = calculateWeeklyPrice(price.weekNumber, basePrice);
        return price.price === expectedPrice;
      });
    }

    return filtered;
  }, [prices, searchTerm, viewMode, basePrice]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = prices.reduce((sum, price) => sum + price.price, 0);
    const customPrices = prices.filter(price => {
      const expectedPrice = calculateWeeklyPrice(price.weekNumber, basePrice);
      return price.price !== expectedPrice;
    }).length;
    const avgDiscount = prices.reduce((sum, price) => {
      const discount = calculateDiscountPercentage(price.weekNumber);
      return sum + discount;
    }, 0) / prices.length;

    return { totalRevenue, customPrices, avgDiscount: Math.round(avgDiscount) };
  }, [prices, basePrice]);

  // Only update prices when basePrice or selectedYear changes
  useEffect(() => {
    if (!isTableEditable && editableWeeks.size === 0 && !hasBasePriceChanged) {
      const newPrices = prices.map(price => ({
        ...price,
        year: selectedYear,
        price: calculateWeeklyPrice(price.weekNumber, basePrice)
      }));
      setPrices(newPrices);
      setHasUnsavedChanges(true);
    }
  }, [basePrice, selectedYear, isTableEditable, editableWeeks.size, hasBasePriceChanged]);

  // Notify parent of price changes only when prices actually change
  useEffect(() => {
    if (prices.length > 0 && hasUnsavedChanges) {
      onPricesChange?.(prices);
      onUnsavedChangesChange?.(true);
    } else {
      onUnsavedChangesChange?.(false);
    }
  }, [prices, onPricesChange, onUnsavedChangesChange, hasUnsavedChanges]);

  const handlePriceChange = (weekNumber: number, newPrice: number) => {
    setPrices(prevPrices => {
      const newPrices = prevPrices.map(price => 
        price.weekNumber === weekNumber ? { ...price, price: newPrice } : price
      );
      setHasUnsavedChanges(true);
      return newPrices;
    });
  };

  const handleYearChange = (newYear: number) => {
    setSelectedYear(newYear);
    setHasUnsavedChanges(true);
  };

  const resetToDefaultPrices = () => {
    const newPrices = Array.from({ length: 52 }, (_, i) => {
      const weekNumber = i + 1;
      return {
        weekNumber,
        year: selectedYear,
        price: calculateWeeklyPrice(weekNumber, basePrice)
      };
    });
    setPrices(newPrices);
    setEditableWeeks(new Set());
    setHasUnsavedChanges(true);
    toast.success('Reset to default progressive discount pricing');
  };

  const toggleWeekEdit = (weekNumber: number) => {
    setEditableWeeks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(weekNumber)) {
        newSet.delete(weekNumber);
      } else {
        newSet.add(weekNumber);
      }
      return newSet;
    });
  };

  const handleBulkEdit = () => {
    if (!bulkEditValue || isNaN(Number(bulkEditValue))) {
      toast.error('Please enter a valid number');
      return;
    }

    const newValue = Number(bulkEditValue);
    const newPrices = prices.map(price => ({
      ...price,
      price: newValue
    }));
    setPrices(newPrices);
    setHasUnsavedChanges(true);
    setShowBulkEdit(false);
    setBulkEditValue('');
    toast.success(`Set all prices to $${newValue}`);
  };

  const exportPrices = () => {
    const csvContent = [
      'Week,Base Total,Discount %,Final Price',
      ...prices.map(price => {
        const baseTotal = calculateBaseTotal(price.weekNumber);
        const discount = calculateDiscountPercentage(price.weekNumber);
        return `${price.weekNumber},${baseTotal},${discount}%,${price.price}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-prices-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Prices exported successfully');
  };

  const savePrices = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/courses/${courseId}/weekly-prices`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prices: prices.map(p => ({
            weekNumber: p.weekNumber,
            year: selectedYear,
            price: p.price
          })),
          year: selectedYear
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save prices');
      }
      
      toast.success('Weekly prices saved successfully');
      setIsTableEditable(false);
      setEditableWeeks(new Set());
      setHasUnsavedChanges(false);
      onUnsavedChangesChange?.(false);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save weekly prices');
      toast.error(`Failed to saving prices. Please try again or contact support if the problem persists.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
        setHasUnsavedChanges(false);
        onUnsavedChangesChange?.(false);
        onClose?.();
      }
    } else {
      onUnsavedChangesChange?.(false);
      onClose?.();
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header with Stats */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Revenue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.customPrices}</div>
              <div className="text-sm text-gray-600">Custom Prices</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.avgDiscount}%</div>
              <div className="text-sm text-gray-600">Avg Discount</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <Label htmlFor="year" className="text-sm font-medium text-gray-900">Year</Label>
              <Input
                id="year"
                type="number"
                min={new Date().getFullYear()}
                value={selectedYear}
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="bg-white text-sm border-gray-300 focus:border-gray-500 focus:ring-gray-500 w-24"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">View</Label>
              <Select value={viewMode} onValueChange={(value: unknown) => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Weeks</SelectItem>
                  <SelectItem value="custom">Custom Only</SelectItem>
                  <SelectItem value="default">Default Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">Search</Label>
              <div className="relative search-container-long">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Week or price..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportPrices}
                  disabled={loading}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Export to CSV</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkEdit(!showBulkEdit)}
                  disabled={loading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bulk Edit</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              onClick={resetToDefaultPrices}
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsTableEditable(!isTableEditable)}
              disabled={loading}
            >
              {isTableEditable ? 'Done Editing' : 'Edit Prices'}
            </Button>
          </div>
        </div>

        {/* Bulk Edit Panel */}
        {showBulkEdit && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-900">Set all prices to:</Label>
                <Input
                  type="number"
                  value={bulkEditValue}
                  onChange={(e) => setBulkEditValue(e.target.value)}
                  placeholder="Enter price"
                  className="w-32"
                />
              </div>
              <Button onClick={handleBulkEdit} size="sm">
                Apply
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowBulkEdit(false)} 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Progressive Discount System:</strong> Every 4 weeks, the discount increases by 2.5%, starting from 5%. 
              Longer commitments get better value with diminishing marginal cost.
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="text-sm text-gray-600">
            Showing {filteredPrices.length} of {prices.length} weeks
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto overflow-y-auto border rounded-lg" style={{ maxHeight: '400px' }}>
          <Table>
            <TableHeader className="sticky top-0 bg-white z-10">
              <TableRow>
                <TableHead>Week</TableHead>
                <TableHead>Base Total</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Final Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No weeks match your search' : 'No weeks to display'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrices.map((price) => {
                  const baseTotal = calculateBaseTotal(price.weekNumber);
                  const discountPercentage = calculateDiscountPercentage(price.weekNumber);
                  const isCustomPrice = price.price !== calculateWeeklyPrice(price.weekNumber, basePrice);
                  
                  return (
                    <TableRow key={price.weekNumber} className={isCustomPrice ? 'bg-yellow-50' : ''}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>Week {price.weekNumber}</span>
                          {isCustomPrice && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>${baseTotal.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">{discountPercentage}%</span>
                      </TableCell>
                      <TableCell>
                        {editableWeeks.has(price.weekNumber) ? (
                          <Input
                            type="number"
                            value={price.price}
                            onChange={(e) => handlePriceChange(price.weekNumber, parseInt(e.target.value))}
                            className="w-24"
                          />
                        ) : (
                          <span className="font-medium">${price.price.toLocaleString()}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleWeekEdit(price.weekNumber)}
                          disabled={!isTableEditable}
                        >
                          {editableWeeks.has(price.weekNumber) ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredPrices.length} weeks • {stats.customPrices} custom prices
          </div>
          <div className="flex gap-2">
            {hasUnsavedChanges && (
              <Button
                onClick={savePrices}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-6 text-sm font-medium text-gray-900 border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 