'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { 
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  Award,
  Globe,
  TrendingUp
} from 'lucide-react';

interface Certificate {
  id: string;
  certificateId: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
  language: string;
  languageName: string;
  cefrLevel: string;
  score: number;
  totalQuestions: number;
  completionDate: string;
  isPublic: boolean;
  createdAt: string;
}

interface CertificateStats {
  totalCertificates: number;
  totalUsers: number;
  averageScore: number;
  languagesCount: number;
  thisMonthCertificates: number;
  topLanguages: Array<{
    language: string;
    count: number;
  }>;
}

export default function AdminCertificatesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [stats, setStats] = useState<CertificateStats>({
    totalCertificates: 0,
    totalUsers: 0,
    averageScore: 0,
    languagesCount: 0,
    thisMonthCertificates: 0,
    topLanguages: []
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'ADMIN') {
      router.push('/');
      return;
    }

    fetchCertificates();
    fetchStats();
  }, [session, status]);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/certificates');
      const data = await response.json();
      
      if (data.success) {
        setCertificates(data.certificates || []);
      } else {
        toast.error('Failed to fetch certificates');
        setCertificates([]);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/certificates/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.certificateId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLanguage = !filterLanguage || cert.language === filterLanguage;
    const matchesLevel = !filterLevel || cert.cefrLevel === filterLevel;
    
    return matchesSearch && matchesLanguage && matchesLevel;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-gray-100 text-gray-800';
      case 'A2': return 'bg-blue-100 text-blue-800';
      case 'B1': return 'bg-green-100 text-green-800';
      case 'B2': return 'bg-yellow-100 text-yellow-800';
      case 'C1': return 'bg-orange-100 text-orange-800';
      case 'C2': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Certificate Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
                              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Certificates</p>
                <p className="text-2xl font-bold">{stats.totalCertificates}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Unique Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Languages</p>
                <p className="text-2xl font-bold">{stats.languagesCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or certificate ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Language</label>
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Languages</option>
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">CEFR Level</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Certificates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Certificates ({filteredCertificates.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Certificate ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Completion Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCertificates.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell className="font-mono text-sm">
                    {cert.certificateId}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{cert.user.name}</p>
                      <p className="text-sm text-muted-foreground">{cert.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cert.languageName}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getLevelColor(cert.cefrLevel)}>
                      {cert.cefrLevel}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{cert.score}%</span>
                      <span className="text-sm text-muted-foreground">
                        ({cert.totalQuestions} questions)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDate(cert.completionDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cert.isPublic ? "default" : "secondary"}>
                      {cert.isPublic ? "Public" : "Private"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredCertificates.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
                              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No certificates found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
