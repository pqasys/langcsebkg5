'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFrameworkLevels, getFrameworkInfo, type Framework, frameworkMappings } from '@/lib/framework-utils';
import { Checkbox } from '@/components/ui/checkbox';

interface Module {
  id: string;
  title: string;
  description: string | null;
  level: string;
  framework: Framework;
  is_published: boolean;
  estimated_duration: number;
  vocabulary_list: string;
  grammar_points: string;
  cultural_notes: string;
  skills?: string[];
}

export default function EditModulePage({ params }: { params: { id: string; moduleId: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<{ framework: Framework } | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'CEFR_A1',
    framework: 'CEFR' as Framework,
    estimated_duration: 30,
    vocabulary_list: '',
    grammar_points: '',
    cultural_notes: '',
    is_published: false
  });
  const skillOptions = [
    'Listening',
    'Speaking',
    'Reading',
    'Writing',
    'Grammar',
    'Vocabulary',
  ];
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsError, setSkillsError] = useState('');

  useEffect(() => {
    fetchModule();
    fetchCourse();
  }, [params.id, params.moduleId]);

  const fetchModule = async () => {
    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch module - Context: throw new Error('Failed to fetch module');...`);
      }
      const data = await response.json();
      setModule(data);
      setFormData({
        title: data.title,
        description: data.description || '',
        level: data.level,
        framework: data.framework,
        estimated_duration: data.estimated_duration || 30,
        vocabulary_list: data.vocabulary_list || '',
        grammar_points: data.grammar_points || '',
        cultural_notes: data.cultural_notes || '',
        is_published: data.is_published || false
      });
      setSkills(Array.isArray(data.skills) ? data.skills : []);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load module. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load module details');
    }
  };

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/institution/courses/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      setCourse(data);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to load course. Please try again or contact support if the problem persists.`);
      toast.error('Failed to load course details');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSkillsError('');
    if (!skills || skills.length === 0) {
      setSkillsError('Please select at least one skill.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          framework: course?.framework || 'CEFR',
          level: formData.level,
          skills,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update module - Context: framework: course?.framework || 'CEFR',...`);
      }

      toast.success('Module updated successfully');
      router.push(`/institution/courses/${params.id}/modules`);
      // Dispatch event to notify sidebar of module change
      window.dispatchEvent(new Event('moduleChange'));
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to updating module. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update module');
    } finally {
      setLoading(false);
    }
  };

  if (!module) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit Module</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="level">Level</Label>
                <Select
                  value={formData.level}
                  onValueChange={(value) => setFormData({ ...formData, level: value })}
                  required
                >
                  <SelectTrigger id="level" className="bg-white">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {course && getFrameworkLevels(course.framework).map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {course && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Using {getFrameworkInfo(course.framework).label} framework from course settings
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimated_duration">Estimated Duration (minutes)</Label>
                <Input
                  id="estimated_duration"
                  type="number"
                  min="1"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: parseInt(e.target.value) })}
                  required
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="vocabulary_list">Vocabulary List</Label>
                <Textarea
                  id="vocabulary_list"
                  value={formData.vocabulary_list}
                  onChange={(e) => setFormData({ ...formData, vocabulary_list: e.target.value })}
                  className="bg-white"
                  placeholder="Enter vocabulary items, one per line"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grammar_points">Grammar Points</Label>
                <Textarea
                  id="grammar_points"
                  value={formData.grammar_points}
                  onChange={(e) => setFormData({ ...formData, grammar_points: e.target.value })}
                  className="bg-white"
                  placeholder="Enter grammar points, one per line"
                />
              </div>
              <div>
                <Label htmlFor="cultural_notes">Cultural Notes</Label>
                <Textarea
                  id="cultural_notes"
                  value={formData.cultural_notes}
                  onChange={(e) => setFormData({ ...formData, cultural_notes: e.target.value })}
                  className="bg-white"
                  placeholder="Enter cultural notes"
                />
              </div>
            </div>

            <div>
              <Label>Skills <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {skillOptions.map((skill) => (
                  <label key={skill} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={skills.includes(skill)}
                      onCheckedChange={(checked) => {
                        setSkills((prev) =>
                          checked
                            ? [...prev, skill]
                            : prev.filter((s) => s !== skill)
                        );
                      }}
                      id={`skill-${skill}`}
                    />
                    <span>{skill}</span>
                  </label>
                ))}
              </div>
              {skillsError && <div className="text-red-500 text-sm mt-1">{skillsError}</div>}
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <Switch
                id="is_published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                aria-label="Publish Module"
                className="focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:ring-offset-2 data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-400 border border-gray-500"
              />
              <Label htmlFor="is_published" className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Publish Module
              </Label>
              <span className={
                formData.is_published
                  ? 'ml-2 text-green-700 font-medium text-sm' 
                  : 'ml-2 text-gray-600 font-medium text-sm'
              }>
                {formData.is_published ? 'Published' : 'Draft'}
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Module'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 