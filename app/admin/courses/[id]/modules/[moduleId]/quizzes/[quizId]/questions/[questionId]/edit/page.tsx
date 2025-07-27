'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Plus, Trash2, Upload, Image, Video, Music, Move, Target, FileText, CheckSquare, AlignLeft, Settings, Calculator } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { QuestionPreview } from '@/components/admin/QuestionPreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Quiz {
  id: string;
  title: string;
}

interface Module {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  institution: {
    name: string;
  };
}

interface QuestionOption {
  id?: string;
  option_type: string;
  content: string;
  media_url?: string;
  order_index: number;
  is_correct: boolean;
  points: number;
  metadata?: unknown;
}

interface IRTParameters {
  difficulty: number;
  discrimination: number;
  guessing: number;
}

interface AdvancedQuestion {
  id: string;
  type: string;
  question: string;
  points: number;
  options?: string | string[];
  correct_answer?: string;
  explanation?: string;
  difficulty?: string;
  category?: string;
  hints?: string;
  question_config?: unknown;
  media_url?: string;
  media_type?: string;
  questionOptions?: QuestionOption[];
  irt_difficulty?: number;
  irt_discrimination?: number;
  irt_guessing?: number;
  irt_last_updated?: string;
}

const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice', icon: CheckSquare },
  { value: 'TRUE_FALSE', label: 'True/False', icon: CheckSquare },
  { value: 'SHORT_ANSWER', label: 'Short Answer', icon: FileText },
  { value: 'ESSAY', label: 'Essay', icon: AlignLeft },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank', icon: FileText },
  { value: 'MATCHING', label: 'Matching', icon: Move },
  { value: 'DRAG_DROP', label: 'Drag & Drop', icon: Move },
  { value: 'HOTSPOT', label: 'Hotspot', icon: Target },
  { value: 'ORDERING', label: 'Ordering', icon: Move },
  { value: 'MULTIPLE_ANSWER', label: 'Multiple Answer', icon: CheckSquare },
];

const DIFFICULTY_LEVELS = [
  { value: 'EASY', label: 'Easy' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HARD', label: 'Hard' },
];

// IRT Parameter calculation functions
const calculateIRTParameters = (difficulty: string, type: string, options?: string[]): IRTParameters => {
  let irtDifficulty = 0;
  let irtDiscrimination = 1.0;
  let irtGuessing = 0.25;

  // Adjust based on question difficulty
  switch (difficulty) {
    case 'EASY':
      irtDifficulty = -1.0;
      irtDiscrimination = 0.8;
      irtGuessing = 0.3;
      break;
    case 'MEDIUM':
      irtDifficulty = 0.0;
      irtDiscrimination = 1.0;
      irtGuessing = 0.25;
      break;
    case 'HARD':
      irtDifficulty = 1.0;
      irtDiscrimination = 1.2;
      irtGuessing = 0.2;
      break;
  }

  // Adjust based on question type
  switch (type) {
    case 'MULTIPLE_CHOICE':
      if (options && options.length > 0) {
        irtGuessing = 1 / options.length;
      } else {
        irtGuessing = 0.25; // Default for 4 options
      }
      irtGuessing = Math.max(irtGuessing, 0.1);
      break;
    case 'TRUE_FALSE':
      // True/False has 50% guessing probability
      irtGuessing = 0.5;
      break;
    case 'FILL_IN_BLANK':
      // Fill in the blank has very low guessing probability
      irtGuessing = 0.05;
      break;
    case 'SHORT_ANSWER':
      // Short answer has very low guessing probability
      irtGuessing = 0.05;
      break;
    case 'ESSAY':
      // Essay has minimal guessing probability
      irtGuessing = 0.02;
      break;
    case 'MATCHING':
      // Matching has moderate guessing probability
      irtGuessing = 0.15;
      break;
    case 'DRAG_DROP':
      // Drag and drop has low guessing probability (requires understanding)
      irtGuessing = 0.1;
      break;
    case 'HOTSPOT':
      // Hotspot has very low guessing probability (requires precise interaction)
      irtGuessing = 0.05;
      break;
    case 'MULTIPLE_ANSWER':
      // Multiple answer has lower guessing than single choice
      irtGuessing = 0.1;
      break;
    case 'ORDERING':
      // Ordering has very low guessing probability
      irtGuessing = 0.05;
      break;
  }

  return { difficulty: irtDifficulty, discrimination: irtDiscrimination, guessing: irtGuessing };
};

// Validation functions
const validateIRTParameters = (params: IRTParameters): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (params.difficulty < -4 || params.difficulty > 4) {
    errors.push('Difficulty must be between -4 and 4');
  }

  if (params.discrimination < 0.1 || params.discrimination > 3) {
    errors.push('Discrimination must be between 0.1 and 3');
  }

  if (params.guessing < 0 || params.guessing > 1) {
    errors.push('Guessing must be between 0 and 1');
  }

  return { isValid: errors.length === 0, errors };
};

export default function AdminEditQuestionPage({
  params
}: {
  params: { id: string; moduleId: string; quizId: string; questionId: string };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [question, setQuestion] = useState<AdvancedQuestion | null>(null);
  const [formData, setFormData] = useState({
    type: 'MULTIPLE_CHOICE' as 'MULTIPLE_CHOICE' | 'MULTIPLE_ANSWER' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'FILL_IN_BLANK' | 'MATCHING' | 'DRAG_DROP' | 'HOTSPOT' | 'ORDERING',
    question: '',
    points: 1,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    difficulty: 'MEDIUM',
    category: '',
    hints: '',
    question_config: null,
    media_url: '',
    media_type: '',
    question_options: [] as QuestionOption[],
    irt_difficulty: 0,
    irt_discrimination: 1.0,
    irt_guessing: 0.25,
    use_manual_irt: false
  });
  const [showPreview, setShowPreview] = useState(false);

  // Helper function to parse options from JSON string or return as array
  const parseOptions = (options: string | string[] | null | undefined): string[] => {
    if (!options) return [];
    if (Array.isArray(options)) return options;
    try {
      return JSON.parse(options);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to parsing options. Please try again or contact support if the problem persists.`);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch course details
        const courseResponse = await fetch(`/api/admin/courses/${params.id}`);
        if (!courseResponse.ok) throw new Error('Failed to fetch course');

        // Fetch module details
        const moduleResponse = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}`);
        if (!moduleResponse.ok) throw new Error('Failed to fetch module');
        const moduleData = await moduleResponse.json();
        setModule(moduleData);

        // Fetch quiz details
        const quizResponse = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
        if (!quizResponse.ok) throw new Error('Failed to fetch quiz');
        const quizData = await quizResponse.json();
        setQuiz(quizData);

        // Fetch question details
        const questionResponse = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${params.questionId}`);
        if (!questionResponse.ok) throw new Error('Failed to fetch question');
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Parse options and populate form with existing data
        const parsedOptions = parseOptions(questionData.options);
        setFormData({
          type: questionData.type,
          question: questionData.question,
          points: questionData.points,
          options: parsedOptions.length > 0 ? parsedOptions : ['', '', '', ''],
          correct_answer: questionData.correct_answer || '',
          explanation: questionData.explanation || '',
          difficulty: questionData.difficulty || 'MEDIUM',
          category: questionData.category || '',
          hints: questionData.hints || '',
          question_config: questionData.question_config || null,
          media_url: questionData.media_url || '',
          media_type: questionData.media_type || '',
          question_options: questionData.questionOptions || [],
          irt_difficulty: questionData.irt_difficulty || 0,
          irt_discrimination: questionData.irt_discrimination || 1.0,
          irt_guessing: questionData.irt_guessing || 0.25,
          use_manual_irt: questionData.use_manual_irt || false
        });
      } catch (error) {
          console.error('Error occurred:', error);
        toast.error(`Failed to load data:. Please try again or contact support if the problem persists.`);
        toast.error('Failed to load question data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.moduleId, params.quizId, params.questionId]);

  // Calculate IRT parameters whenever difficulty, type, or options change
  useEffect(() => {
    if (!formData.use_manual_irt) {
      const irtParams = calculateIRTParameters(formData.difficulty, formData.type, formData.options);
      setFormData(prev => ({
        ...prev,
        irt_difficulty: irtParams.difficulty,
        irt_discrimination: irtParams.discrimination,
        irt_guessing: irtParams.guessing
      }));
    }
  }, [formData.difficulty, formData.type, formData.options, formData.use_manual_irt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim()) {
      toast.error('Question text is required');
      return;
    }

    if (formData.type === 'MULTIPLE_CHOICE' && !formData.correct_answer) {
      toast.error('Please select a correct answer');
      return;
    }

    // Validate IRT parameters if manual mode is enabled
    if (formData.use_manual_irt) {
      const irtParams = {
        difficulty: formData.irt_difficulty,
        discrimination: formData.irt_discrimination,
        guessing: formData.irt_guessing
      };
      
      const validation = validateIRTParameters(irtParams);
      if (!validation.isValid) {
        toast.error(`IRT Parameter Error: ${validation.errors.join(', ')}`);
        return;
      }
    }

    try {
      setSaving(true);
      const response = await fetch(`/api/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}/questions/${params.questionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      toast.success('Question updated successfully');
      router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
    } catch (error) {
          console.error('Error occurred:', error);
      toast.error(`Failed to updating question. Please try again or contact support if the problem persists.`);
      toast.error('Failed to update question');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/courses/${params.id}/modules/${params.moduleId}/quizzes/${params.quizId}`);
  };

  const updateQuestionField = (field: string, value: unknown) => {
    setFormData({ ...formData, [field]: value });
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, '']
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) {
      toast.error('At least 2 options are required');
      return;
    }
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
      correct_answer: formData.correct_answer === formData.options[index] ? '' : formData.correct_answer
    });
  };

  const handleMediaUpload = async (file: File) => {
    // This would integrate with your file upload system
    // For now, we'll just set a placeholder
    const mediaType = file.type.startsWith('image/') ? 'image' : 
                     file.type.startsWith('video/') ? 'video' : 'audio';
    
    setFormData({
      ...formData,
      media_url: URL.createObjectURL(file), // Temporary URL
      media_type: mediaType
    });
    
    toast.success('Media uploaded successfully');
  };

  const renderQuestionTypeSpecificFields = () => {
    switch (formData.type) {
      case 'MULTIPLE_CHOICE':
      case 'MULTIPLE_ANSWER':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
                disabled={formData.options.length >= 6}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type={formData.type === 'MULTIPLE_ANSWER' ? 'checkbox' : 'radio'}
                    name="correct_answer"
                    value={option}
                    checked={formData.correct_answer === option}
                    onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                    className="rounded"
                  />
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'TRUE_FALSE':
        return (
          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correct_answer"
                  value="True"
                  checked={formData.correct_answer === 'True'}
                  onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                  className="rounded"
                />
                <span>True</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="correct_answer"
                  value="False"
                  checked={formData.correct_answer === 'False'}
                  onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                  className="rounded"
                />
                <span>False</span>
              </label>
            </div>
          </div>
        );

      case 'FILL_IN_BLANK':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <Input
                value={formData.correct_answer}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="Enter the correct answer..."
              />
            </div>
            <div className="space-y-2">
              <Label>Alternative Answers (comma-separated)</Label>
              <Textarea
                value={formData.hints}
                onChange={(e) => updateQuestionField('hints', e.target.value)}
                placeholder="Enter alternative acceptable answers..."
                rows={2}
              />
            </div>
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Left Column Items</Label>
                <Textarea
                  value={formData.question_config?.leftItems?.join('\n') || ''}
                  onChange={(e) => {
                    const leftItems = e.target.value.split('\n').filter(item => item.trim());
                    setFormData({
                      ...formData,
                      question_config: {
                        ...formData.question_config,
                        leftItems
                      }
                    });
                  }}
                  placeholder="Item 1&#10;Item 2&#10;Item 3"
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Right Column Items</Label>
                <Textarea
                  value={formData.question_config?.rightItems?.join('\n') || ''}
                  onChange={(e) => {
                    const rightItems = e.target.value.split('\n').filter(item => item.trim());
                    setFormData({
                      ...formData,
                      question_config: {
                        ...formData.question_config,
                        rightItems
                      }
                    });
                  }}
                  placeholder="Match 1&#10;Match 2&#10;Match 3"
                  rows={4}
                />
              </div>
            </div>
          </div>
        );

      case 'DRAG_DROP':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Drag Items</Label>
              <Textarea
                value={formData.question_config?.dragItems?.join('\n') || ''}
                onChange={(e) => {
                  const dragItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
                      dragItems
                    }
                  });
                }}
                placeholder="Drag item 1&#10;Drag item 2&#10;Drag item 3"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Drop Zones</Label>
              <Textarea
                value={formData.question_config?.dropZones?.join('\n') || ''}
                onChange={(e) => {
                  const dropZones = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
                      dropZones
                    }
                  });
                }}
                placeholder="Drop zone 1&#10;Drop zone 2&#10;Drop zone 3"
                rows={3}
              />
            </div>
          </div>
        );

      case 'HOTSPOT':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                  className="hidden"
                  id="hotspot-image"
                />
                <label htmlFor="hotspot-image" className="cursor-pointer">
                  <Image className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload image for hotspot question</p>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Hotspot Coordinates (x,y format)</Label>
              <Input
                value={formData.correct_answer}
                onChange={(e) => updateQuestionField('correct_answer', e.target.value)}
                placeholder="e.g., 100,150"
              />
            </div>
          </div>
        );

      case 'ORDERING':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Items to Order</Label>
              <Textarea
                value={formData.question_config?.orderItems?.join('\n') || ''}
                onChange={(e) => {
                  const orderItems = e.target.value.split('\n').filter(item => item.trim());
                  setFormData({
                    ...formData,
                    question_config: {
                      ...formData.question_config,
                      orderItems
                    }
                  });
                }}
                placeholder="Item 1&#10;Item 2&#10;Item 3&#10;Item 4"
                rows={4}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!quiz || !module || !course || !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Question not found</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleCancel}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Question</h1>
            <p className="text-muted-foreground">
              Edit question in "{quiz.title}" • {module.title} • {course.title} • {course.institution.name}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => setShowPreview(true)}>
                Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Question Preview</DialogTitle>
              </DialogHeader>
              <QuestionPreview 
                question={{
                  id: params.questionId,
                  type: formData.type,
                  question: formData.question,
                  options: formData.options,
                  correct_answer: formData.correct_answer,
                  points: formData.points,
                  explanation: formData.explanation,
                  hints: formData.hints,
                  order_index: 0,
                  difficulty: formData.difficulty,
                  category: formData.category,
                  question_config: formData.question_config,
                  media_url: formData.media_url,
                  media_type: formData.media_type,
                  questionOptions: formData.question_options
                }} 
                onClose={() => setShowPreview(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Question Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Question Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Question Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Question Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: unknown) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {QUESTION_TYPES.map((type) => {
                          const IconComponent = type.icon;
                          return (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className="w-4 h-4" />
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="points">Points</Label>
                    <Input
                      id="points"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.points}
                      onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 1 })}
                      className="w-32"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="question">Question</Label>
                  <Textarea
                    id="question"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="Enter your question here..."
                    rows={3}
                    required
                  />
                </div>

                {/* Question Type Specific Fields */}
                {renderQuestionTypeSpecificFields()}

                <div className="space-y-2">
                  <Label htmlFor="explanation">Explanation (Optional)</Label>
                  <Textarea
                    id="explanation"
                    value={formData.explanation}
                    onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                    placeholder="Explain why this answer is correct..."
                    rows={2}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* IRT Parameters Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>IRT Parameters (Adaptive Quiz)</span>
                <Badge variant="secondary" className="ml-2">Advanced</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Manual IRT Parameters</Label>
                  <p className="text-sm text-muted-foreground">
                    Override automatic calculation for precise control
                  </p>
                </div>
                <Switch
                  checked={formData.use_manual_irt}
                  onCheckedChange={(checked) => setFormData({ ...formData, use_manual_irt: checked })}
                />
              </div>

              {!formData.use_manual_irt && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Automatic Calculation</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Difficulty:</span> {formData.irt_difficulty?.toFixed(2) || '0.00'}
                    </div>
                    <div>
                      <span className="font-medium">Discrimination:</span> {formData.irt_discrimination?.toFixed(2) || '1.00'}
                    </div>
                    <div>
                      <span className="font-medium">Guessing:</span> {formData.irt_guessing?.toFixed(2) || '0.25'}
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Based on difficulty: {formData.difficulty}, type: {formData.type}
                    {formData.type === 'MULTIPLE_CHOICE' && ` (${formData.options.filter(o => o.trim()).length} options)`}
                  </p>
                </div>
              )}

              {formData.use_manual_irt && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="irt-difficulty">Difficulty (b)</Label>
                      <Input
                        id="irt-difficulty"
                        type="number"
                        step="0.1"
                        min="-4"
                        max="4"
                        value={formData.irt_difficulty || 0}
                        onChange={(e) => setFormData({ ...formData, irt_difficulty: parseFloat(e.target.value) || 0 })}
                        placeholder="0.0"
                      />
                      <p className="text-xs text-muted-foreground">
                        -4 (very easy) to +4 (very hard)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="irt-discrimination">Discrimination (a)</Label>
                      <Input
                        id="irt-discrimination"
                        type="number"
                        step="0.1"
                        min="0.1"
                        max="3"
                        value={formData.irt_discrimination || 1}
                        onChange={(e) => setFormData({ ...formData, irt_discrimination: parseFloat(e.target.value) || 1 })}
                        placeholder="1.0"
                      />
                      <p className="text-xs text-muted-foreground">
                        0.1 (poor) to 3.0 (excellent)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="irt-guessing">Guessing (c)</Label>
                      <Input
                        id="irt-guessing"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={formData.irt_guessing || 0.25}
                        onChange={(e) => setFormData({ ...formData, irt_guessing: parseFloat(e.target.value) || 0.25 })}
                        placeholder="0.25"
                      />
                      <p className="text-xs text-muted-foreground">
                        0 (no guessing) to 1 (pure chance)
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> IRT parameters significantly affect adaptive quiz behavior. 
                      Use with caution and validate with student performance data.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Question Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Question Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Grammar, Vocabulary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hints">Hints (Optional)</Label>
                <Textarea
                  id="hints"
                  value={formData.hints}
                  onChange={(e) => setFormData({ ...formData, hints: e.target.value })}
                  placeholder="Provide hints for students..."
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question Media</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={(e) => e.target.files?.[0] && handleMediaUpload(e.target.files[0])}
                    className="hidden"
                    id="question-media"
                  />
                  <label htmlFor="question-media" className="cursor-pointer">
                    <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">Upload image, video, or audio</p>
                  </label>
                </div>
              </div>
              
              {formData.media_url && (
                <div className="space-y-2">
                  <Label>Current Media</Label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    {formData.media_type === 'image' && <Image className="w-4 h-4" />}
                    {formData.media_type === 'video' && <Video className="w-4 h-4" />}
                    {formData.media_type === 'audio' && <Music className="w-4 h-4" />}
                    <span className="text-sm truncate">{formData.media_url}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 