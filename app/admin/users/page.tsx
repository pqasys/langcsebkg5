'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Edit, Trash2, LayoutGrid, List, Shield, Building, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent } from "@/components/ui/card";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'INSTITUTION' | 'STUDENT';
  createdAt: string;
  bookingsCount: number;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'STUDENT',
  });
  const [password, setPassword] = useState('');
  const [inputKey, setInputKey] = useState(0);

  useEffect(() => {
    // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // console.log('Password state updated:', password);
  }, [password]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role?.toUpperCase() !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [session, status]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch users');
      console.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    console.log('Resetting form');
    setFormData({
      name: '',
      email: '',
      role: 'STUDENT',
    });
    setPassword('');
    setInputKey(prev => prev + 1);
    setSelectedUser(null);
  }, []);

  const handleEdit = useCallback((user: User) => {
    console.log('handleEdit called for user:', user);
    setSelectedUser(user);
    setFormData({
      name: user.name || '',
      email: user.email,
      role: user.role,
    });
    setTimeout(() => {
      setPassword('');
      setInputKey(prev => prev + 1);
    }, 0);
    setIsEditModalOpen(true);
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Password input changed:', e.target.value);
    setPassword(e.target.value);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit called with password:', password);
    try {
      const url = selectedUser
        ? `/api/admin/users/${selectedUser.id}`
        : '/api/admin/users';
      
      const method = selectedUser ? 'PUT' : 'POST';
      
      const requestBody = {
        ...formData,
        password: password || undefined,
      };
      console.log('Request body:', requestBody);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${selectedUser ? 'update' : 'create'} user`);
      }

      const user = await response.json();
      console.log('Response from server:', user);
      
      if (selectedUser) {
        setUsers(prev => prev.map(u => u.id === user.id ? user : u));
        console.log('User updated successfully');
      } else {
        setUsers(prev => [user, ...prev]);
        console.log('User created successfully');
      }

      resetForm();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      console.error(error instanceof Error ? error.message : `Failed to ${selectedUser ? 'update' : 'create'} user`);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(prev => prev.filter(u => u.id !== userId));
      console.log('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      console.error('Failed to delete user');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      case 'INSTITUTION':
        return <Building className="w-4 h-4" />;
      case 'STUDENT':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'INSTITUTION':
        return 'bg-blue-100 text-blue-800';
      case 'STUDENT':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h1 className="text-xl sm:text-2xl font-bold">Users Management</h1>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-800 hover:bg-gray-900 text-white text-sm sm:text-base px-3 sm:px-4 py-2 h-8 sm:h-10">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add User</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with the specified role.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-gray-600 mb-1">Name</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-600 mb-1">Email</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-600 mb-1">Password</label>
                  <PasswordInput
                    key={inputKey}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-normal text-gray-600 mb-1">Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger className="bg-white border border-gray-200">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Administrator</SelectItem>
                      <SelectItem value="INSTITUTION">Institution</SelectItem>
                      <SelectItem value="STUDENT">Student</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1 search-container-long">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(user.role)}
                      <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{user.bookingsCount} bookings</span>
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setFormData({
                          name: user.name || '',
                          email: user.email,
                          role: user.role,
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="flex-1 h-8 text-xs"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{user.name || 'Unnamed User'}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        {getRoleIcon(user.role)}
                        <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                      <span>{user.bookingsCount} bookings</span>
                      <span>•</span>
                      <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user);
                        setFormData({
                          name: user.name || '',
                          email: user.email,
                          role: user.role,
                        });
                        setIsEditModalOpen(true);
                      }}
                      className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(user.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog 
        open={isEditModalOpen} 
        onOpenChange={(open) => {
          console.log('Edit modal open state changed:', open);
          setIsEditModalOpen(open);
          if (!open) {
            resetForm();
          }
        }}
      >
        <DialogContent className="bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information. Leave the password blank to keep the current password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Password</label>
              <PasswordInput
                key={`password-${inputKey}`}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Leave blank to keep current password"
                className="bg-white"
                autoComplete="new-password"
                name={`password-${inputKey}`}
              />
            </div>
            <div>
              <label className="block text-xs font-normal text-gray-600 mb-1">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="bg-white border border-gray-200">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrator</SelectItem>
                  <SelectItem value="INSTITUTION">Institution</SelectItem>
                  <SelectItem value="STUDENT">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
              Update User
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 