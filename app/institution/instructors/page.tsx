'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  User, 
  Search, 
  RefreshCw,
  Building
} from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Instructor {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
  lastLogin?: string;
}

interface InstructorFormData {
  name: string;
  email: string;
}

export default function InstitutionInstructorsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [formData, setFormData] = useState<InstructorFormData>({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (session?.user?.role !== 'INSTITUTION') {
      toast.error('Access denied. Institution privileges required.');
      router.push('/institution');
      return;
    }

    fetchInstructors();
  }, [session, router]);

  const fetchInstructors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/institution/instructors');
      if (response.ok) {
        const data = await response.json();
        setInstructors(data.instructors || []);
      } else {
        console.error('Failed to fetch instructors:', response.status);
        toast.error('Failed to fetch instructors');
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Error fetching instructors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof InstructorFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
    });
    setEditingInstructor(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    try {
      setLoading(true);
      const url = editingInstructor 
        ? `/api/institution/instructors/${editingInstructor.id}`
        : '/api/institution/instructors';
      
      const method = editingInstructor ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save instructor');
      }

      const data = await response.json();
      
      if (editingInstructor) {
        toast.success('Instructor updated successfully');
      } else {
        toast.success('Instructor created successfully. Password sent via email.');
      }
      
      resetForm();
      fetchInstructors();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (instructorId: string) => {
    if (!confirm('Are you sure you want to delete this instructor?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/institution/instructors/${instructorId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete instructor');
      }

      toast.success('Instructor deleted successfully');
      fetchInstructors();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete instructor');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (instructorId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/institution/instructors/${instructorId}/reset-password`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      toast.success('Password reset email sent successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    return instructor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           instructor.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!session?.user || session.user.role !== 'INSTITUTION') {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">Access denied. Institution privileges required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Management</h1>
            <p className="text-gray-600">Manage instructors for your institution</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Instructor
            </Button>
            <Button
              variant="outline"
              onClick={fetchInstructors}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {(showCreateForm || editingInstructor) && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingInstructor ? 'Edit Instructor' : 'Create New Instructor'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter instructor name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {editingInstructor ? 'Update Instructor' : 'Create Instructor'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructors List */}
        <Card>
          <CardHeader>
            <CardTitle>Instructors ({filteredInstructors.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <RefreshCw className="animate-spin h-8 w-8 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">Loading instructors...</p>
              </div>
            ) : filteredInstructors.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto text-gray-400" />
                <p className="text-gray-500 mt-2">No instructors found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Name</th>
                      <th className="text-left py-3 px-4">Email</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Created</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInstructors.map((instructor) => (
                      <tr key={instructor.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{instructor.name}</td>
                        <td className="py-3 px-4">{instructor.email}</td>
                        <td className="py-3 px-4">
                          <Badge className={getStatusColor(instructor.status)}>
                            {instructor.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {new Date(instructor.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingInstructor(instructor);
                                setFormData({
                                  name: instructor.name,
                                  email: instructor.email,
                                });
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResetPassword(instructor.id)}
                            >
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(instructor.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 