'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal, 
  Download, 
  Upload,
  Search,
  Filter,
  Globe,
  MapPin,
  Users,
  DollarSign,
  Target,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

interface LanguageThresholdConfig {
  id: string;
  language: string;
  country?: string;
  region?: string;
  minAttendanceThreshold: number;
  profitMarginThreshold: number;
  instructorHourlyRate: number;
  platformRevenuePerStudent: number;
  autoCancelIfBelowThreshold: boolean;
  cancellationDeadlineHours: number;
  isActive: boolean;
  priority: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    id: string;
    name: string;
    email: string;
  };
  updatedByUser?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Metadata {
  languages: string[];
  countries: string[];
  regions: string[];
}

export default function LanguageAttendanceThresholdsPage() {
  const [configs, setConfigs] = useState<LanguageThresholdConfig[]>([]);
  const [metadata, setMetadata] = useState<Metadata>({ languages: [], countries: [], regions: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingConfig, setEditingConfig] = useState<LanguageThresholdConfig | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Form state for create/edit
  const [formData, setFormData] = useState({
    language: '',
    country: '',
    region: '',
    minAttendanceThreshold: 4,
    profitMarginThreshold: 8,
    instructorHourlyRate: 25.0,
    platformRevenuePerStudent: 24.99,
    autoCancelIfBelowThreshold: true,
    cancellationDeadlineHours: 24,
    isActive: true,
    priority: 0,
    notes: ''
  });

  useEffect(() => {
    fetchConfigs();
    fetchMetadata();
  }, []);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/language-attendance-thresholds');
      const data = await response.json();
      if (data.success) {
        setConfigs(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch configurations');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const response = await fetch('/api/admin/language-attendance-thresholds/metadata');
      const data = await response.json();
      if (data.success) {
        setMetadata(data.data);
      }
    } catch (error) {
      toast.error('Failed to fetch metadata');
    }
  };

  const handleCreateConfig = async () => {
    try {
      const response = await fetch('/api/admin/language-attendance-thresholds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Configuration created successfully');
        setShowCreateDialog(false);
        resetForm();
        fetchConfigs();
      } else {
        toast.error(data.error || 'Failed to create configuration');
      }
    } catch (error) {
      toast.error('Failed to create configuration');
    }
  };

  const handleUpdateConfig = async () => {
    if (!editingConfig) return;

    try {
      const response = await fetch(`/api/admin/language-attendance-thresholds/${editingConfig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Configuration updated successfully');
        setEditingConfig(null);
        resetForm();
        fetchConfigs();
      } else {
        toast.error(data.error || 'Failed to update configuration');
      }
    } catch (error) {
      toast.error('Failed to update configuration');
    }
  };

  const handleDeleteConfig = async (id: string) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;

    try {
      const response = await fetch(`/api/admin/language-attendance-thresholds/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Configuration deleted successfully');
        fetchConfigs();
      } else {
        toast.error(data.error || 'Failed to delete configuration');
      }
    } catch (error) {
      toast.error('Failed to delete configuration');
    }
  };

  const resetForm = () => {
    setFormData({
      language: '',
      country: '',
      region: '',
      minAttendanceThreshold: 4,
      profitMarginThreshold: 8,
      instructorHourlyRate: 25.0,
      platformRevenuePerStudent: 24.99,
      autoCancelIfBelowThreshold: true,
      cancellationDeadlineHours: 24,
      isActive: true,
      priority: 0,
      notes: ''
    });
  };

  const openEditDialog = (config: LanguageThresholdConfig) => {
    setEditingConfig(config);
    setFormData({
      language: config.language,
      country: config.country || '',
      region: config.region || '',
      minAttendanceThreshold: config.minAttendanceThreshold,
      profitMarginThreshold: config.profitMarginThreshold,
      instructorHourlyRate: config.instructorHourlyRate,
      platformRevenuePerStudent: config.platformRevenuePerStudent,
      autoCancelIfBelowThreshold: config.autoCancelIfBelowThreshold,
      cancellationDeadlineHours: config.cancellationDeadlineHours,
      isActive: config.isActive,
      priority: config.priority,
      notes: config.notes || ''
    });
  };

  const openCreateDialog = () => {
    setEditingConfig(null);
    resetForm();
    setShowCreateDialog(true);
  };

  const filteredConfigs = configs.filter(config => {
    const matchesSearch = config.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (config.country && config.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (config.region && config.region.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLanguage = !selectedLanguage || config.language === selectedLanguage;
    const matchesCountry = !selectedCountry || config.country === selectedCountry;
    const matchesRegion = !selectedRegion || config.region === selectedRegion;

    return matchesSearch && matchesLanguage && matchesCountry && matchesRegion;
  });

  const getMatchType = (config: LanguageThresholdConfig) => {
    if (config.country && config.region) return 'exact';
    if (config.country) return 'country';
    if (config.region) return 'region';
    return 'language';
  };

  const getMatchColor = (matchType: string) => {
    switch (matchType) {
      case 'exact': return 'bg-green-100 text-green-800';
      case 'country': return 'bg-blue-100 text-blue-800';
      case 'region': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Language Attendance Thresholds</h1>
          <p className="text-gray-600 mt-2">
            Configure minimum attendance requirements and profitability thresholds by language, country, and region.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowImportDialog(true)} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={openCreateDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Configuration
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search configurations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All languages</SelectItem>
                  {metadata.languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All countries</SelectItem>
                  {metadata.countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All regions</SelectItem>
                  {metadata.regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Configurations ({filteredConfigs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Language/Region</TableHead>
                <TableHead>Min Students</TableHead>
                <TableHead>Profit Students</TableHead>
                <TableHead>Instructor Rate</TableHead>
                <TableHead>Revenue/Student</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConfigs.map((config) => {
                const matchType = getMatchType(config);
                return (
                  <TableRow key={config.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{config.language.toUpperCase()}</div>
                          <div className="text-sm text-gray-500">
                            {config.country && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{config.country}</span>}
                            {config.region && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{config.region}</span>}
                          </div>
                        </div>
                        <Badge className={getMatchColor(matchType)}>
                          {matchType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {config.minAttendanceThreshold}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {config.profitMarginThreshold}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${config.instructorHourlyRate}/hr
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${config.platformRevenuePerStudent}
                      </div>
                    </TableCell>
                    <TableCell>{config.priority}</TableCell>
                    <TableCell>
                      <Badge variant={config.isActive ? "default" : "secondary"}>
                        {config.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(config)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteConfig(config.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={showCreateDialog || !!editingConfig} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingConfig(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingConfig ? 'Edit Configuration' : 'Create New Configuration'}
            </DialogTitle>
            <DialogDescription>
              Configure attendance thresholds for a specific language, country, or region.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language">Language *</Label>
              <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {metadata.languages.map(lang => (
                    <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => setFormData({...formData, country: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All countries</SelectItem>
                  {metadata.countries.map(country => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="region">Region</Label>
              <Select value={formData.region} onValueChange={(value) => setFormData({...formData, region: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="All regions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All regions</SelectItem>
                  {metadata.regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="minAttendance">Minimum Students *</Label>
              <Input
                id="minAttendance"
                type="number"
                value={formData.minAttendanceThreshold}
                onChange={(e) => setFormData({...formData, minAttendanceThreshold: parseInt(e.target.value)})}
                placeholder="4"
              />
            </div>

            <div>
              <Label htmlFor="profitThreshold">Profit Students *</Label>
              <Input
                id="profitThreshold"
                type="number"
                value={formData.profitMarginThreshold}
                onChange={(e) => setFormData({...formData, profitMarginThreshold: parseInt(e.target.value)})}
                placeholder="8"
              />
            </div>

            <div>
              <Label htmlFor="instructorRate">Instructor Rate ($/hr) *</Label>
              <Input
                id="instructorRate"
                type="number"
                step="0.01"
                value={formData.instructorHourlyRate}
                onChange={(e) => setFormData({...formData, instructorHourlyRate: parseFloat(e.target.value)})}
                placeholder="25.00"
              />
            </div>

            <div>
              <Label htmlFor="revenuePerStudent">Revenue per Student ($) *</Label>
              <Input
                id="revenuePerStudent"
                type="number"
                step="0.01"
                value={formData.platformRevenuePerStudent}
                onChange={(e) => setFormData({...formData, platformRevenuePerStudent: parseFloat(e.target.value)})}
                placeholder="24.99"
              />
            </div>

            <div>
              <Label htmlFor="cancellationHours">Cancellation Deadline (hours)</Label>
              <Input
                id="cancellationHours"
                type="number"
                value={formData.cancellationDeadlineHours}
                onChange={(e) => setFormData({...formData, cancellationDeadlineHours: parseInt(e.target.value)})}
                placeholder="24"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="autoCancel"
                checked={formData.autoCancelIfBelowThreshold}
                onCheckedChange={(checked) => setFormData({...formData, autoCancelIfBelowThreshold: checked})}
              />
              <Label htmlFor="autoCancel">Auto-cancel if below threshold</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Optional notes about this configuration..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setEditingConfig(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={editingConfig ? handleUpdateConfig : handleCreateConfig}>
              {editingConfig ? 'Update' : 'Create'} Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Configurations</DialogTitle>
            <DialogDescription>
              Import language attendance threshold configurations from JSON or CSV.
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Import functionality will be implemented in the next iteration.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
