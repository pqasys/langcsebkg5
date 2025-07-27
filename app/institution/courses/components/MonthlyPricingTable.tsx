import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Pencil, Check, X, Search, Download, Upload, RefreshCw, Info } from 'lucide-react';
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
  id: string;
  monthNumber: number;
  year: number;
  price: number;
}

interface MonthlyPricingTableProps {
  courseId: string;
  initialPrices?: MonthlyPrice[];
  basePrice: number;
  onPricesChange: (prices: MonthlyPrice[]) => void;
  onClose?: () => void;
}

const calculateMonthlyPrice = (monthNumber: number, basePrice: number) => {
  // Calculate total price for all months up to current month
  const totalPrice = basePrice * monthNumber;
  
  // Apply progressive discount (5% per month, capped at 50%)
  const discountRate = Math.min(monthNumber * 5, 50);
  const discount = totalPrice * (discountRate / 100);
  
  // Calculate final price
  const finalPrice = totalPrice - discount;
  
  // Round to nearest whole number
  return Math.round(finalPrice);
};

const calculateDiscountPercentage = (monthNumber: number) => {
  return Math.min(monthNumber * 5, 50);
};

const calculateBaseTotal = (monthNumber: number, basePrice: number) => {
  return basePrice * monthNumber;
};

export function MonthlyPricingTable({ 
  courseId, 
  initialPrices = [], 
  basePrice,
  onPricesChange,
  onClose
}: MonthlyPricingTableProps) {
  const [prices, setPrices] = useState<MonthlyPrice[]>(() => {
    if (initialPrices.length > 0) {
      return initialPrices;
    }
    return Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      return {
        id: `temp-${monthNumber}`,
        monthNumber,
        year: new Date().getFullYear(),
        price: calculateMonthlyPrice(monthNumber, basePrice)
      };
    });
  });
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [editableMonths, setEditableMonths] = useState<Set<number>>(new Set());
  const [hasFetched, setHasFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'all' | 'custom' | 'default'>('all');
  const [bulkEditValue, setBulkEditValue] = useState('');
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  // Fetch prices on mount if initialPrices is empty
  useEffect(() => {
    const fetchPrices = async () => {
      // Only fetch if we haven't fetched before and initialPrices is empty
      if (!hasFetched && initialPrices.length === 0) {
        setIsLoading(true);
        setHasFetched(true);
        
        try {
          const currentYear = new Date().getFullYear();
          const response = await fetch(`/api/institution/courses/${courseId}/monthly-prices?year=${currentYear}`);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch prices - Context: throw new Error('Failed to fetch prices');...`);
          }
          
          const data = await response.json();
          if (data.success && data.prices && data.prices.length > 0) {
            setPrices(data.prices);
            onPricesChange(data.prices);
          }
        } catch (err) {
          toast.error(`Failed to load monthly prices. Please try again or contact support if the problem persists.`);
          // If fetch fails, keep the default calculated prices
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPrices();
  }, [courseId, hasFetched]); // Remove onPricesChange from dependencies to prevent infinite loop

  // Filter prices based on search and view mode
  const filteredPrices = useMemo(() => {
    let filtered = prices;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(price => 
        price.monthNumber.toString().includes(searchTerm) ||
        price.price.toString().includes(searchTerm) ||
        getMonthName(price.monthNumber).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by view mode
    if (viewMode === 'custom') {
      filtered = filtered.filter(price => {
        const expectedPrice = calculateMonthlyPrice(price.monthNumber, basePrice);
        return price.price !== expectedPrice;
      });
    } else if (viewMode === 'default') {
      filtered = filtered.filter(price => {
        const expectedPrice = calculateMonthlyPrice(price.monthNumber, basePrice);
        return price.price === expectedPrice;
      });
    }

    return filtered;
  }, [prices, searchTerm, viewMode, basePrice]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = prices.reduce((sum, price) => sum + price.price, 0);
    const customPrices = prices.filter(price => {
      const expectedPrice = calculateMonthlyPrice(price.monthNumber, basePrice);
      return price.price !== expectedPrice;
    }).length;
    const avgDiscount = prices.reduce((sum, price) => {
      const discount = calculateDiscountPercentage(price.monthNumber);
      return sum + discount;
    }, 0) / prices.length;

    return { totalRevenue, customPrices, avgDiscount: Math.round(avgDiscount) };
  }, [prices, basePrice]);

  const handlePriceChange = (monthNumber: number, newPrice: number) => {
    setPrices(prevPrices => {
      const newPrices = prevPrices.map(price => 
        price.monthNumber === monthNumber 
          ? { ...price, price: newPrice }
          : price
      );
      onPricesChange(newPrices);
      return newPrices;
    });
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
  };

  const resetToDefaultPrices = () => {
    const newPrices = Array.from({ length: 12 }, (_, i) => {
      const monthNumber = i + 1;
      return {
        id: `temp-${monthNumber}`,
        monthNumber,
        year: selectedYear,
        price: calculateMonthlyPrice(monthNumber, basePrice)
      };
    });
    setPrices(newPrices);
    setEditableMonths(new Set());
    onPricesChange(newPrices);
    toast.success('Reset to default progressive discount pricing');
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
    onPricesChange(newPrices);
    setShowBulkEdit(false);
    setBulkEditValue('');
    toast.success(`Set all prices to $${newValue}`);
  };

  const exportPrices = () => {
    const csvContent = [
      'Month,Base Total,Discount %,Final Price',
      ...prices.map(price => {
        const baseTotal = calculateBaseTotal(price.monthNumber, basePrice);
        const discount = calculateDiscountPercentage(price.monthNumber);
        return `${getMonthName(price.monthNumber)},${baseTotal},${discount}%,${price.price}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monthly-prices-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Prices exported successfully');
  };

  const getMonthName = (monthNumber: number) => {
    return new Date(2000, monthNumber - 1, 1).toLocaleString('default', { month: 'long' });
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
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
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
                  disabled={loading || isLoading}
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
                  disabled={loading || isLoading}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bulk Edit</TooltipContent>
            </Tooltip>

            <Button
              variant="outline"
              onClick={resetToDefaultPrices}
              disabled={loading || isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
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
              <strong>Progressive Discount System:</strong> Each month gets a 5% discount increase, capped at 50%. 
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading prices...</div>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                  <TableRow>
                    <TableHead>Month</TableHead>
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
                        {searchTerm ? 'No months match your search' : 'No months to display'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPrices.map((price) => {
                      const baseTotal = calculateBaseTotal(price.monthNumber, basePrice);
                      const discountPercentage = calculateDiscountPercentage(price.monthNumber);
                      const isCustomPrice = price.price !== calculateMonthlyPrice(price.monthNumber, basePrice);
                      
                      return (
                        <TableRow key={price.id} className={isCustomPrice ? 'bg-yellow-50' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{getMonthName(price.monthNumber)}</span>
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
                            {editableMonths.has(price.monthNumber) ? (
                              <Input
                                type="number"
                                value={price.price}
                                onChange={(e) => handlePriceChange(price.monthNumber, parseFloat(e.target.value))}
                                className="w-32"
                              />
                            ) : (
                              <span className="font-medium">${price.price.toLocaleString()}</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {editableMonths.has(price.monthNumber) ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => toggleMonthEdit(price.monthNumber)}
                                    className="h-8 w-8"
                                  >
                                    <Check className="h-4 w-4 text-green-500" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      handlePriceChange(price.monthNumber, calculateMonthlyPrice(price.monthNumber, basePrice));
                                      toggleMonthEdit(price.monthNumber);
                                    }}
                                    className="h-8 w-8"
                                  >
                                    <X className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleMonthEdit(price.monthNumber)}
                                  className="h-8 w-8"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {filteredPrices.length} months • {stats.customPrices} custom prices
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading || isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onPricesChange(prices);
                onClose?.();
              }}
              disabled={loading || isLoading}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 