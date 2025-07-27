'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { toast } from 'sonner';
import { Pencil, Check, Search, Download, Upload, RefreshCw, Info } from 'lucide-react';
import { format, addMonths, parseISO } from 'date-fns';
import { useCurrency } from '@/app/hooks/useCurrency';
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

interface MonthlyPrice {
  date: string;
  price: number;
  baseTotal: number;
  discount: number;
}

interface MonthlyPricingTableProps {
  courseId: string;
  initialPrices: MonthlyPrice[];
  basePrice: number;
  onPricesChange: (prices: MonthlyPrice[]) => void;
  onUnsavedChangesChange?: (hasChanges: boolean) => void;
  onClose?: () => void;
}

export function MonthlyPricingTable({
  courseId,
  initialPrices,
  basePrice,
  onPricesChange,
  onUnsavedChangesChange,
  onClose
}: MonthlyPricingTableProps) {
  console.log('MonthlyPricingTable rendered with:', {
  courseId,
  initialPricesLength: initialPrices?.length,
  initialPrices,
  basePrice
});

  // Memoize the calculated prices to prevent recalculation on every render
  const calculateMonthlyPrice = useCallback((monthNumber: number) => {
    // Calculate discount rate based on month number
    // Every 3 months, increase discount by 5%, starting from 10%
    const discountRate = Math.floor((monthNumber - 1) / 3) * 5 + 10;
    const discount = Math.min(discountRate, 50); // Cap maximum discount at 50%
    
    // Calculate total price for all months up to current month
    const baseTotal = basePrice * monthNumber;
    
    // Apply discount to total price
    const discountedPrice = baseTotal * (1 - discount / 100);
    
    return {
      price: Math.round(discountedPrice),
      baseTotal,
      discount
    };
  }, [basePrice]);

  const calculateDefaultPrices = useCallback(() => {
    console.log('Calculating default prices with basePrice:', basePrice);
    const today = new Date();
    const prices = Array.from({ length: 12 }, (_, i) => {
      const { price, baseTotal, discount } = calculateMonthlyPrice(i + 1);
      return {
        date: addMonths(today, i).toISOString().split('T')[0],
        price,
        baseTotal,
        discount
      };
    });
    console.log('Calculated default prices:', prices);
    return prices;
  }, [calculateMonthlyPrice]);

  // Initialize prices state with initialPrices if available
  const [prices, setPrices] = useState<MonthlyPrice[]>(() => {
    if (initialPrices && initialPrices.length > 0) {
      return initialPrices;
    }
    return calculateDefaultPrices();
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isTableEditable, setIsTableEditable] = useState(false);
  const [editableMonths, setEditableMonths] = useState<Set<number>>(new Set());
  const { formatCurrencyWithSymbol } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'custom' | 'default'>('all');
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Filter prices based on search and view mode
  const filteredPrices = useMemo(() => {
    let filtered = prices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((price, index) => 
        (index + 1).toString().includes(searchTerm) ||
        price.price.toString().includes(searchTerm) ||
        format(addMonths(new Date(), index), 'MMMM').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by view mode
    if (viewMode === 'custom') {
      filtered = filtered.filter((price, index) => {
        const expectedPrice = calculateMonthlyPrice(index + 1).price;
        return price.price !== expectedPrice;
      });
    } else if (viewMode === 'default') {
      filtered = filtered.filter((price, index) => {
        const expectedPrice = calculateMonthlyPrice(index + 1).price;
        return price.price === expectedPrice;
      });
    }

    return filtered;
  }, [prices, searchTerm, viewMode, calculateMonthlyPrice]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = prices.reduce((sum, price) => sum + price.price, 0);
    const customPrices = prices.filter((price, index) => {
      const expectedPrice = calculateMonthlyPrice(index + 1).price;
      return price.price !== expectedPrice;
    }).length;
    const avgDiscount = prices.reduce((sum, price) => {
      return sum + price.discount;
    }, 0) / prices.length;

    return { totalRevenue, customPrices, avgDiscount: Math.round(avgDiscount) };
  }, [prices, calculateMonthlyPrice]);

  // Add useEffect to fetch prices on mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}/monthly-pricing?year=${selectedYear}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch prices: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.prices && data.prices.length > 0) {
          // Use the fetched prices
          const newPrices = data.prices.map((price: unknown) => ({
            date: addMonths(new Date(selectedYear, 0, 1), price.monthNumber - 1).toISOString().split('T')[0],
            price: price.price,
            baseTotal: calculateMonthlyPrice(price.monthNumber).baseTotal,
            discount: calculateMonthlyPrice(price.monthNumber).discount
          }));
          setPrices(newPrices);
        } else {
          // No prices found, calculate new ones
          const newPrices = calculateDefaultPrices();
          setPrices(newPrices);
        }
      } catch (error) {
    console.error('Error occurred:', error);
        // toast.error('Failed to fetch prices');
      }
    };

    fetchPrices();
  }, [courseId, selectedYear, calculateMonthlyPrice, calculateDefaultPrices]);

  const handlePriceChange = useCallback((index: number, newPrice: string) => {
    const newPriceValue = parseInt(newPrice.replace(/[^\d]/g, '')) || 0;
    
    setPrices(prevPrices => {
      const updatedPrices = [...prevPrices];
      updatedPrices[index] = {
        ...updatedPrices[index],
        price: newPriceValue
      };
      return updatedPrices;
    });
    
    setHasChanges(true);
    onUnsavedChangesChange?.(true);
  }, [onUnsavedChangesChange]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Transform prices to match API expectations
      const apiPrices = prices.map((price, index) => ({
        monthNumber: index + 1,
        year: selectedYear,
        price: price.price
      }));

      console.log('Saving monthly prices:', apiPrices);

      const response = await fetch(`/api/courses/${courseId}/monthly-pricing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prices: apiPrices,
          year: selectedYear
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save prices');
      }

      const result = await response.json();
      console.log('Monthly prices saved:', result);
      
      // Update the prices with the saved data
      const savedPrices = prices.map((price, index) => ({
        ...price,
        price: apiPrices[index].price,
        baseTotal: calculateMonthlyPrice(index + 1).baseTotal,
        discount: calculateMonthlyPrice(index + 1).discount
      }));
      
      setPrices(savedPrices);
      setHasChanges(false);
      onUnsavedChangesChange?.(false);
      
      // Notify parent of the changes
      onPricesChange?.(savedPrices);
      
      // toast.success('Monthly prices saved successfully');
      
      // Close the modal after successful save
      onClose?.();
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error('Failed to save monthly prices');
    } finally {
      setIsSaving(false);
    }
  };

  const handleYearChange = async (newYear: number) => {
    if (newYear === selectedYear) return;
    
    try {
      // Fetch prices for the new year
      const response = await fetch(`/api/courses/${courseId}/monthly-pricing?year=${newYear}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prices');
      }
      const data = await response.json();
      
      if (data.prices && data.prices.length > 0) {
        // Use the fetched prices
        const newPrices = data.prices.map((price: unknown) => ({
          date: addMonths(new Date(newYear, 0, 1), price.monthNumber - 1).toISOString().split('T')[0],
          price: price.price,
          baseTotal: calculateMonthlyPrice(price.monthNumber).baseTotal,
          discount: calculateMonthlyPrice(price.monthNumber).discount
        }));
        setPrices(newPrices);
      } else {
        // No prices found, calculate new ones
        const today = new Date(newYear, 0, 1);
        const newPrices = prices.map((price, index) => ({
          ...price,
          date: addMonths(today, index).toISOString().split('T')[0]
        }));
        setPrices(newPrices);
      }
      
      setSelectedYear(newYear);
      setHasChanges(true);
      onUnsavedChangesChange?.(true);
    } catch (error) {
    console.error('Error occurred:', error);
      // toast.error('Failed to fetch prices for selected year');
    }
  };

  const resetToDefaultPrices = () => {
    const newPrices = calculateDefaultPrices();
    setPrices(newPrices);
    setEditableMonths(new Set());
    setHasChanges(true);
    onUnsavedChangesChange?.(true);
    // toast.success('Reset to default progressive discount pricing');
  };

  const handleBulkEdit = () => {
    if (!bulkEditValue || isNaN(Number(bulkEditValue))) {
      // toast.error('Please enter a valid number');
      return;
    }

    const newValue = Number(bulkEditValue);
    const newPrices = prices.map(price => ({
      ...price,
      price: newValue
    }));
    setPrices(newPrices);
    setHasChanges(true);
    onUnsavedChangesChange?.(true);
    setShowBulkEdit(false);
    setBulkEditValue('');
    // toast.success(`Set all prices to $${newValue}`);
  };

  const exportPrices = () => {
    const csvContent = [
      'Month,Date,Base Total,Discount %,Final Price',
      ...prices.map((price, index) => {
        const monthName = format(addMonths(new Date(), index), 'MMMM');
        const formattedDate = price.date 
          ? format(parseISO(price.date), 'MMM d, yyyy')
          : format(addMonths(new Date(), index), 'MMM d, yyyy');
        return `${monthName},${formattedDate},${price.baseTotal},${price.discount}%,${price.price}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monthly-prices-${selectedYear}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
    // toast.success('Prices exported successfully');
  };

  const toggleTableEdit = () => {
    setIsTableEditable(!isTableEditable);
    if (isTableEditable) {
      setEditableMonths(new Set());
    }
  };

  const toggleMonthEdit = (monthNumber: number) => {
    setEditableMonths(prev => {
      const newSet = new Set(prev);
      if (newSet.has(monthNumber)) {
        newSet.delete(monthNumber);
      } else {
        newSet.add(monthNumber);
      }
      return newSet;
    });
    setHasChanges(true);
    onUnsavedChangesChange?.(true);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header with Stats */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{formatCurrencyWithSymbol(stats.totalRevenue)}</div>
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
              <Select value={selectedYear.toString()} onValueChange={(value) => handleYearChange(parseInt(value))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[selectedYear - 1, selectedYear, selectedYear + 1].map(year => (
                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">View</Label>
              <Select value={viewMode} onValueChange={(value: unknown) => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
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
                  placeholder="Month or price..."
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
                  disabled={isSaving}
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
                  disabled={isSaving}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bulk Edit</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              onClick={resetToDefaultPrices}
              disabled={isSaving}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              variant={isTableEditable ? "default" : "outline"}
              onClick={toggleTableEdit}
              disabled={isSaving}
            >
              {isTableEditable ? 'Done Editing' : 'Edit All'}
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
              <strong>Progressive Discount System:</strong> Every 3 months, the discount increases by 5%, starting from 10%. 
              Longer commitments get better value with diminishing marginal cost.
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {searchTerm && (
          <div className="text-sm text-gray-600">
            Showing {filteredPrices.length} of {prices.length} months
          </div>
        )}

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Base Total</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Final Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrices.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      {searchTerm ? 'No months match your search' : 'No months to display'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrices.map((price, index) => {
                    const isEditable = isTableEditable || editableMonths.has(index + 1);
                    const formattedDate = price.date 
                      ? format(parseISO(price.date), 'MMM d, yyyy')
                      : format(addMonths(new Date(), index), 'MMM d, yyyy');
                    const isCustomPrice = price.price !== calculateMonthlyPrice(index + 1).price;
                    
                    return (
                      <TableRow key={price.date || `month-${index}`} className={isCustomPrice ? 'bg-yellow-50' : ''}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>Month {index + 1}</span>
                            {isCustomPrice && (
                              <Badge variant="secondary" className="text-xs">
                                Custom
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formattedDate}</TableCell>
                        <TableCell>{formatCurrencyWithSymbol(price.baseTotal || 0)}</TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">{price.discount || 0}%</span>
                        </TableCell>
                        <TableCell>
                          {isEditable ? (
                            <Input
                              type="number"
                              value={price.price.toString()}
                              onChange={(e) => handlePriceChange(index, e.target.value)}
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value === '') {
                                  handlePriceChange(index, '0');
                                }
                              }}
                              className="w-32"
                              min="0"
                              step="1"
                            />
                          ) : (
                            <span className="font-medium">{formatCurrencyWithSymbol(price.price)}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleMonthEdit(index + 1)}
                            className="h-8 w-8 p-0"
                          >
                            {editableMonths.has(index + 1) ? (
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredPrices.length} months • {stats.customPrices} custom prices
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? 'Saving...' : 'Save Monthly Prices'}
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 