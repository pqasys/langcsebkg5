'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'SHORT_ANSWER', label: 'Short Answer' },
  { value: 'ESSAY', label: 'Essay' },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank' },
  { value: 'MATCHING', label: 'Matching' },
  { value: 'DRAG_DROP', label: 'Drag & Drop' },
  { value: 'HOTSPOT', label: 'Hotspot' },
  { value: 'ORDERING', label: 'Ordering' },
  { value: 'MULTIPLE_ANSWER', label: 'Multiple Answer' },
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

export default function QuestionTemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchTemplate();
  }, [params.id]);

  const fetchTemplate = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/question-templates/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setTemplate(data);
        setFormData(data);
      } else {
        toast.error('Failed to fetch template');
      }
    } catch (e) {
      toast.error('Failed to fetch template');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`/api/admin/question-templates/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        toast.success('Template updated');
        setEditing(false);
        fetchTemplate();
      } else {
        toast.error('Failed to update template');
      }
    } catch (e) {
      toast.error('Failed to update template');
    }
  };

  const handleUseTemplate = () => {
    // Redirect to question creation page with template data in query or localStorage
    localStorage.setItem('questionTemplate', JSON.stringify(template));
    router.push('/admin/courses/[id]/modules/[moduleId]/quizzes/[quizId]/questions/new?fromTemplate=1');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!template) {
    return <div className="p-8 text-center text-red-500">Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Back</Button>
          <h1 className="text-3xl font-bold tracking-tight">{template.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleUseTemplate}>
            Use This Template
          </Button>
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit className="w-4 h-4 mr-2" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={value => setFormData({ ...formData, type: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {QUESTION_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={value => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map(level => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <Input value={Array.isArray(formData.tags) ? formData.tags.join(', ') : formData.tags || ''} onChange={e => setFormData({ ...formData, tags: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Template Config (JSON)</Label>
                <Textarea value={JSON.stringify(formData.template_config, null, 2)} onChange={e => setFormData({ ...formData, template_config: JSON.parse(e.target.value) })} rows={6} />
              </div>
              <Button onClick={handleSave} className="mt-2"><Save className="w-4 h-4 mr-2" />Save</Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Name</Label>
                <div>{template.name}</div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <div>{template.description}</div>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Badge>{template.type}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <div>{template.category}</div>
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <Badge>{template.difficulty}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Tags</Label>
                <div>{Array.isArray(template.tags) ? template.tags.join(', ') : template.tags}</div>
              </div>
              <div className="space-y-2">
                <Label>Template Config</Label>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">{JSON.stringify(template.template_config, null, 2)}</pre>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 