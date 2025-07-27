'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileAudio, FileVideo, Image, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ContentFormData {
  title: string;
  description: string;
  type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT' | 'QUIZ' | 'EXERCISE';
  file?: File;
  url?: string;
  order_index: number;
}

// Enhanced question types and fields
const QUESTION_TYPES = [
  { value: 'MULTIPLE_CHOICE', label: 'Multiple Choice' },
  { value: 'TRUE_FALSE', label: 'True/False' },
  { value: 'FILL_IN_BLANK', label: 'Fill in the Blank' },
  { value: 'MATCHING', label: 'Matching' },
  { value: 'ESSAY', label: 'Essay' },
  { value: 'DRAG_AND_DROP', label: 'Drag and Drop' },
  { value: 'HOTSPOT', label: 'Hotspot' },
];

export default function NewContentPage({ params }: { params: { id: string; moduleId: string } }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('media');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    description: '',
    type: 'VIDEO',
    order_index: 0
  });
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Quiz builder state
  const [quiz, setQuiz] = useState({
    title: '',
    description: '',
    passing_score: 70,
    time_limit: 30,
    mediaFile: undefined as File | undefined,
    mediaPreview: '',
    mediaUrl: '',
    quiz_type: 'STANDARD',
    difficulty: 'MEDIUM',
    category: '',
    tags: '', // comma-separated
    instructions: '',
    allow_retry: true,
    max_attempts: 3,
    shuffle_questions: false,
    show_results: true,
    show_explanations: false,
    questions: [
      {
        type: 'MULTIPLE_CHOICE',
        question: '',
        options: ['', ''],
        correct_answer: '',
        points: 1,
        difficulty: 'MEDIUM',
        category: '',
        tags: '',
        explanation: '',
        hints: '', // comma-separated
      },
    ],
  });
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');

  // Exercise builder state
  const [exercise, setExercise] = useState({
    type: 'MULTIPLE_CHOICE',
    question: '',
    options: ['', ''],
    answer: '',
    order_index: 1
  });
  const [exerciseLoading, setExerciseLoading] = useState(false);
  const [exerciseError, setExerciseError] = useState('');

  const [maxFileSizeMB, setMaxFileSizeMB] = useState(10);

  useEffect(() => {
    fetch('/api/admin/settings/general')
      .then(res => res.json())
      .then(data => {
        if (data.fileUploadMaxSizeMB) setMaxFileSizeMB(data.fileUploadMaxSizeMB);
      });
  }, []);

  // Reset exercise options when type changes
  useEffect(() => {
    if (exercise.type === 'MULTIPLE_CHOICE') {
      setExercise(prev => ({
        ...prev,
        options: ['', ''],
        answer: ''
      }));
    } else if (exercise.type === 'MATCHING') {
      setExercise(prev => ({
        ...prev,
        options: [{ left: '', right: '' }],
        answer: 'Match the items on the left with their corresponding items on the right'
      }));
    } else {
      setExercise(prev => ({
        ...prev,
        options: [],
        answer: ''
      }));
    }
  }, [exercise.type]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type based on selected content type
    const validTypes = {
      'VIDEO': ['video/mp4', 'video/webm', 'video/ogg'],
      'AUDIO': ['audio/mpeg', 'audio/wav', 'audio/ogg'],
      'IMAGE': ['image/jpeg', 'image/png', 'image/gif'],
      'DOCUMENT': ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    };

    if (!validTypes[formData.type].includes(file.type)) {
      toast.error(`Invalid file type. Please upload a valid ${formData.type.toLowerCase()} file.`);
      return;
    }

    // Validate file size (maxFileSizeMB limit)
    const maxSize = maxFileSizeMB * 1024 * 1024; // maxFileSizeMB in bytes
    if (file.size > maxSize) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }

    setFormData(prev => ({ ...prev, file }));
    setSelectedFileName(file.name);
    
    // Create preview URL for images and videos
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else if (file.type === 'application/pdf') {
      // For PDFs, we'll show a document icon with the filename
      setFilePreview(null);
    } else {
      setFilePreview(null);
    }
  };

  const handleContentTypeChange = (type: 'VIDEO' | 'AUDIO' | 'IMAGE' | 'DOCUMENT' | 'QUIZ' | 'EXERCISE') => {
    setFormData(prev => ({ ...prev, type }));
    setFilePreview(null);
    setSelectedFileName(null);
  };

  const handleFileUploadClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Reset the input
      fileInput.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create content - Context: throw new Error('Failed to create content');...`);
      }

      toast.success('Content created successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}`);
    } catch (error) {
      console.error('Error occurred:', error);
      toast.error(`Failed to creating content. Please try again or contact support if the problem persists.`);
      toast.error('Failed to create content');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizChange = (field: string, value: unknown) => {
    setQuiz((prev) => ({ ...prev, [field]: value }));
  };
  const handleQuestionChange = (idx: number, field: string, value: unknown) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[idx] = { ...questions[idx], [field]: value };
      return { ...prev, questions };
    });
  };
  const handleOptionChange = (qIdx: number, oIdx: number, value: string) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[qIdx].options];
      options[oIdx] = value;
      questions[qIdx].options = options;
      return { ...prev, questions };
    });
  };
  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        { type: 'MULTIPLE_CHOICE', question: '', options: ['', ''], correct_answer: '', points: 1 },
      ],
    }));
  };
  const removeQuestion = (idx: number) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== idx),
    }));
  };
  const addOption = (qIdx: number) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[qIdx].options = [...questions[qIdx].options, ''];
      return { ...prev, questions };
    });
  };
  const removeOption = (qIdx: number, oIdx: number) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[qIdx].options = questions[qIdx].options.filter((_, i) => i !== oIdx);
      return { ...prev, questions };
    });
  };
  const handleQuizMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'audio/mpeg', 'audio/wav', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a valid video or audio file.');
      return;
    }
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast.error(`File size exceeds ${maxFileSizeMB}MB limit`);
      return;
    }
    setQuiz((prev) => ({ ...prev, mediaFile: file, mediaPreview: URL.createObjectURL(file) }));
  };

  const handleQuestionTypeChange = (idx: number, type: string) => {
    setQuiz((prev) => {
      const questions = [...prev.questions];
      questions[idx] = {
        ...questions[idx],
        type,
        // Reset fields based on type
        options: type === 'MULTIPLE_CHOICE' ? ['', ''] : type === 'MATCHING' ? [{ left: '', right: '' }] : [],
        correct_answer: '',
        explanation: '',
        hints: '',
      };
      return { ...prev, questions };
    });
  };

  const handleQuizSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuizLoading(true);
    setQuizError('');
    // Basic validation
    if (!quiz.title || quiz.questions.some(q => !q.question || (q.type === 'MULTIPLE_CHOICE' && (q.options.length < 2 || q.options.some(opt => !opt))))) {
      setQuizError('Please fill in all required fields and ensure each question is valid.');
      setQuizLoading(false);
      return;
    }
    let mediaUrl = '';
    try {
      // If a media file is selected, upload it first
      if (quiz.mediaFile) {
        const formData = new FormData();
        formData.append('file', quiz.mediaFile);
        formData.append('type', quiz.mediaFile.type.startsWith('video') ? 'VIDEO' : 'AUDIO');
        formData.append('title', typeof quiz.title === 'string' && quiz.title.trim() ? quiz.title : 'Quiz Media');
        formData.append('description', typeof quiz.description === 'string' ? quiz.description : '');
        formData.append('order_index', '0');
        // Use a dedicated upload endpoint or reuse content upload
        const uploadRes = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/content`, {
          method: 'POST',
          body: formData,
        });
        if (!uploadRes.ok) throw new Error(`Failed to upload media - Context: body: formData,...`);
        const uploaded = await uploadRes.json();
        mediaUrl = uploaded.url || uploaded.fileUrl || '';
      }
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...quiz, mediaUrl: mediaUrl }),
      });
      if (!response.ok) throw new Error(`Failed to create quiz - Context: body: JSON.stringify({ ...quiz, mediaUrl: mediaUrl...`);
      toast.success('Quiz created successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content`);
    } catch (error) {
    console.error('Error occurred:', error);
      setQuizError('Failed to create quiz');
    } finally {
      setQuizLoading(false);
    }
  };

  // Exercise handlers
  const handleExerciseChange = (field: string, value: unknown) => {
    setExercise((prev) => ({ ...prev, [field]: value }));
  };

  const handleExerciseOptionChange = (idx: number, value: string) => {
    setExercise((prev) => {
      const options = [...prev.options];
      options[idx] = value;
      return { ...prev, options };
    });
  };

  const handleExerciseAddOption = () => {
    setExercise((prev) => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const handleExerciseRemoveOption = (idx: number) => {
    setExercise((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleExerciseMatchingChange = (idx: number, side: 'left' | 'right', value: string) => {
    setExercise((prev) => {
      const options = [...prev.options] as { left: string; right: string }[];
      options[idx] = { ...options[idx], [side]: value };
      return { ...prev, options };
    });
  };

  const handleExerciseAddMatchingPair = () => {
    setExercise((prev) => ({
      ...prev,
      options: [...prev.options, { left: '', right: '' }]
    }));
  };

  const handleExerciseRemoveMatchingPair = (idx: number) => {
    setExercise((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== idx)
    }));
  };

  const handleExerciseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setExerciseLoading(true);
    setExerciseError('');

    // Basic validation
    if (!exercise.question || !exercise.answer) {
      setExerciseError('Please fill in all required fields.');
      setExerciseLoading(false);
      return;
    }

    // Type-specific validation
    if (exercise.type === 'MULTIPLE_CHOICE' && exercise.options.length < 2) {
      setExerciseError('Multiple choice exercises must have at least 2 options.');
      setExerciseLoading(false);
      return;
    }

    if (exercise.type === 'MATCHING' && exercise.options.length < 1) {
      setExerciseError('Matching exercises must have at least 1 pair.');
      setExerciseLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/institution/courses/${params.id}/modules/${params.moduleId}/exercises`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to create exercise');
      }

      toast.success('Exercise created successfully');
      router.push(`/institution/courses/${params.id}/modules/${params.moduleId}/content`);
    } catch (error) {
    console.error('Error occurred:', error);
      toast.error(`Failed to creating exercise. Please try again or contact support if the problem persists.`);
      setExerciseError(error instanceof Error ? error.message : 'Failed to create exercise');
    } finally {
      setExerciseLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add Content</h1>
          <p className="text-muted-foreground">
            Create new learning content for this module
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="media">Media Content</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
          <TabsTrigger value="exercise">Exercise</TabsTrigger>
        </TabsList>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Media Content</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter content title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter content description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Select Content Type</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      type="button"
                      variant={formData.type === 'VIDEO' ? 'default' : 'outline'}
                      className={cn(
                        "h-auto py-4 transition-colors",
                        formData.type === 'VIDEO' && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleContentTypeChange('VIDEO')}
                    >
                      <FileVideo className="w-5 h-5 mr-2" />
                      Video
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'AUDIO' ? 'default' : 'outline'}
                      className={cn(
                        "h-auto py-4 transition-colors",
                        formData.type === 'AUDIO' && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleContentTypeChange('AUDIO')}
                    >
                      <FileAudio className="w-5 h-5 mr-2" />
                      Audio
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'IMAGE' ? 'default' : 'outline'}
                      className={cn(
                        "h-auto py-4 transition-colors",
                        formData.type === 'IMAGE' && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleContentTypeChange('IMAGE')}
                    >
                      <Image className="w-5 h-5 mr-2" />
                      Image
                    </Button>
                    <Button
                      type="button"
                      variant={formData.type === 'DOCUMENT' ? 'default' : 'outline'}
                      className={cn(
                        "h-auto py-4 transition-colors",
                        formData.type === 'DOCUMENT' && "bg-primary text-primary-foreground hover:bg-primary/90"
                      )}
                      onClick={() => handleContentTypeChange('DOCUMENT')}
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      Document
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Content</Label>
                  <div 
                    className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-primary transition-colors"
                    onClick={handleFileUploadClick}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files[0];
                      if (file) {
                        const dataTransfer = new DataTransfer();
                        dataTransfer.items.add(file);
                        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                        if (fileInput) {
                          fileInput.files = dataTransfer.files;
                          handleFileChange({ target: { files: dataTransfer.files } } as any);
                        }
                      }
                    }}
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          Drag and drop your file here, or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.type === 'VIDEO' && `Supported formats: MP4, WebM, OGG (max ${maxFileSizeMB}MB)`}
                          {formData.type === 'AUDIO' && `Supported formats: MP3, WAV, OGG (max ${maxFileSizeMB}MB)`}
                          {formData.type === 'IMAGE' && `Supported formats: JPG, PNG, GIF (max ${maxFileSizeMB}MB)`}
                          {formData.type === 'DOCUMENT' && `Supported formats: PDF, DOC, DOCX (max ${maxFileSizeMB}MB)`}
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept={
                          formData.type === 'VIDEO' ? 'video/mp4,video/webm,video/ogg' :
                          formData.type === 'AUDIO' ? 'audio/mpeg,audio/wav,audio/ogg' :
                          formData.type === 'IMAGE' ? 'image/jpeg,image/png,image/gif' :
                          '.pdf,.doc,.docx'
                        }
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileUploadClick();
                        }}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>

                {filePreview && (formData.type === 'IMAGE' || formData.type === 'VIDEO') && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="border rounded-lg p-4">
                      {formData.type === 'IMAGE' ? (
                        <img
                          src={filePreview}
                          alt="Preview"
                          className="max-w-full h-auto rounded-lg"
                        />
                      ) : (
                        <video
                          src={filePreview}
                          controls
                          className="max-w-full rounded-lg"
                        />
                      )}
                    </div>
                  </div>
                )}

                {selectedFileName && formData.type === 'DOCUMENT' && (
                  <div className="space-y-2">
                    <Label>Selected Document</Label>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFileName && formData.type === 'AUDIO' && (
                  <div className="space-y-2">
                    <Label>Selected Audio</Label>
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <FileAudio className="w-8 h-8 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{selectedFileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Content'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Create Quiz</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleQuizSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quiz-title">Quiz Title</Label>
                    <Input id="quiz-title" value={quiz.title} onChange={e => handleQuizChange('title', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quiz-type">Quiz Type</Label>
                    <select id="quiz-type" className="w-full border rounded p-2" value={quiz.quiz_type} onChange={e => handleQuizChange('quiz_type', e.target.value)}>
                      <option value="STANDARD">Standard</option>
                      <option value="ADAPTIVE">Adaptive</option>
                      <option value="PRACTICE">Practice</option>
                      <option value="ASSESSMENT">Assessment</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <select id="difficulty" className="w-full border rounded p-2" value={quiz.difficulty} onChange={e => handleQuizChange('difficulty', e.target.value)}>
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" value={quiz.category} onChange={e => handleQuizChange('category', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input id="tags" value={quiz.tags} onChange={e => handleQuizChange('tags', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <Textarea id="instructions" value={quiz.instructions} onChange={e => handleQuizChange('instructions', e.target.value)} rows={2} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passing_score">Passing Score (%)</Label>
                    <Input id="passing_score" type="number" min={0} max={100} value={quiz.passing_score} onChange={e => handleQuizChange('passing_score', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time_limit">Time Limit (minutes)</Label>
                    <Input id="time_limit" type="number" min={0} value={quiz.time_limit} onChange={e => handleQuizChange('time_limit', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2 flex items-center gap-2">
                    <input type="checkbox" id="allow_retry" checked={quiz.allow_retry} onChange={e => handleQuizChange('allow_retry', e.target.checked)} />
                    <Label htmlFor="allow_retry">Allow Retry</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max_attempts">Max Attempts</Label>
                    <Input id="max_attempts" type="number" min={1} value={quiz.max_attempts} onChange={e => handleQuizChange('max_attempts', Number(e.target.value))} />
                  </div>
                  <div className="space-y-2 flex items-center gap-2">
                    <input type="checkbox" id="shuffle_questions" checked={quiz.shuffle_questions} onChange={e => handleQuizChange('shuffle_questions', e.target.checked)} />
                    <Label htmlFor="shuffle_questions">Shuffle Questions</Label>
                  </div>
                  <div className="space-y-2 flex items-center gap-2">
                    <input type="checkbox" id="show_results" checked={quiz.show_results} onChange={e => handleQuizChange('show_results', e.target.checked)} />
                    <Label htmlFor="show_results">Show Results to Student</Label>
                  </div>
                  <div className="space-y-2 flex items-center gap-2">
                    <input type="checkbox" id="show_explanations" checked={quiz.show_explanations} onChange={e => handleQuizChange('show_explanations', e.target.checked)} />
                    <Label htmlFor="show_explanations">Show Explanations</Label>
                  </div>
                </div>
                <div className="space-y-6 mt-6">
                  <h3 className="font-semibold text-lg">Questions</h3>
                  {quiz.questions.map((q, idx) => (
                    <div key={idx} className="border rounded-lg p-4 mb-4 bg-muted/50">
                      <div className="flex items-center gap-4 mb-2">
                        <Label>Type</Label>
                        <select className="border rounded p-2" value={q.type} onChange={e => handleQuestionTypeChange(idx, e.target.value)}>
                          {QUESTION_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeQuestion(idx)}>Remove</Button>
                      </div>
                      <div className="space-y-2">
                        <Label>Question</Label>
                        <Textarea value={q.question} onChange={e => handleQuestionChange(idx, 'question', e.target.value)} rows={2} required />
                      </div>
                      {/* Show options for MCQ, Matching, True/False, etc. */}
                      {q.type === 'MULTIPLE_CHOICE' && (
                        <div className="space-y-2 mt-2">
                          <Label>Options</Label>
                          {q.options.map((opt: string, oIdx: number) => (
                            <div key={oIdx} className="flex items-center gap-2 mb-1">
                              <Input value={opt} onChange={e => handleOptionChange(idx, oIdx, e.target.value)} required />
                              <Button type="button" variant="destructive" size="sm" onClick={() => removeOption(idx, oIdx)}>Remove</Button>
                            </div>
                          ))}
                          <Button type="button" size="sm" onClick={() => addOption(idx)}>Add Option</Button>
                          <div className="space-y-2 mt-2">
                            <Label>Correct Answer</Label>
                            <Input value={q.correct_answer} onChange={e => handleQuestionChange(idx, 'correct_answer', e.target.value)} required />
                          </div>
                        </div>
                      )}
                      {q.type === 'TRUE_FALSE' && (
                        <div className="space-y-2 mt-2">
                          <Label>Correct Answer</Label>
                          <select className="border rounded p-2" value={q.correct_answer} onChange={e => handleQuestionChange(idx, 'correct_answer', e.target.value)}>
                            <option value="true">True</option>
                            <option value="false">False</option>
                          </select>
                        </div>
                      )}
                      {q.type === 'FILL_IN_BLANK' && (
                        <div className="space-y-2 mt-2">
                          <Label>Correct Answer</Label>
                          <Input value={q.correct_answer} onChange={e => handleQuestionChange(idx, 'correct_answer', e.target.value)} required />
                        </div>
                      )}
                      {q.type === 'MATCHING' && (
                        <div className="space-y-2 mt-2">
                          <Label>Pairs</Label>
                          {(q.options || []).map((pair: { left: string; right: string }, pIdx: number) => (
                            <div key={pIdx} className="flex items-center gap-2 mb-1">
                              <Input placeholder="Left" value={pair.left} onChange={e => {
                                const newPairs = [...q.options];
                                newPairs[pIdx].left = e.target.value;
                                handleQuestionChange(idx, 'options', newPairs);
                              }} />
                              <Input placeholder="Right" value={pair.right} onChange={e => {
                                const newPairs = [...q.options];
                                newPairs[pIdx].right = e.target.value;
                                handleQuestionChange(idx, 'options', newPairs);
                              }} />
                              <Button type="button" variant="destructive" size="sm" onClick={() => {
                                const newPairs = [...q.options];
                                newPairs.splice(pIdx, 1);
                                handleQuestionChange(idx, 'options', newPairs);
                              }}>Remove</Button>
                            </div>
                          ))}
                          <Button type="button" size="sm" onClick={() => {
                            const newPairs = [...(q.options || []), { left: '', right: '' }];
                            handleQuestionChange(idx, 'options', newPairs);
                          }}>Add Pair</Button>
                        </div>
                      )}
                      {/* Add UI for other types as needed */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <Label>Points</Label>
                          <Input type="number" min={1} value={q.points} onChange={e => handleQuestionChange(idx, 'points', Number(e.target.value))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Difficulty</Label>
                          <select className="w-full border rounded p-2" value={q.difficulty} onChange={e => handleQuestionChange(idx, 'difficulty', e.target.value)}>
                            <option value="EASY">Easy</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HARD">Hard</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Input value={q.category} onChange={e => handleQuestionChange(idx, 'category', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Tags (comma-separated)</Label>
                          <Input value={q.tags} onChange={e => handleQuestionChange(idx, 'tags', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Hints (comma-separated)</Label>
                          <Input value={q.hints} onChange={e => handleQuestionChange(idx, 'hints', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label>Explanation</Label>
                          <Textarea value={q.explanation} onChange={e => handleQuestionChange(idx, 'explanation', e.target.value)} rows={2} />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" onClick={addQuestion} className="mt-4">Add Question</Button>
                </div>
                {quizError && <div className="text-red-500">{quizError}</div>}
                <div className="flex justify-end mt-6">
                  <Button type="submit" loading={quizLoading}>Save Quiz</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle>Create Exercise</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleExerciseSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exercise-type">Exercise Type</Label>
                    <select 
                      id="exercise-type" 
                      className="w-full border rounded p-2" 
                      value={exercise.type} 
                      onChange={e => handleExerciseChange('type', e.target.value)}
                    >
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="FILL_IN_BLANK">Fill in the Blank</option>
                      <option value="MATCHING">Matching</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exercise-order">Order Index</Label>
                    <Input 
                      id="exercise-order" 
                      type="number" 
                      min={1} 
                      value={exercise.order_index} 
                      onChange={e => handleExerciseChange('order_index', Number(e.target.value))} 
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="exercise-question">Question/Prompt</Label>
                  <Textarea 
                    id="exercise-question" 
                    value={exercise.question} 
                    onChange={e => handleExerciseChange('question', e.target.value)} 
                    rows={3} 
                    required 
                  />
                </div>

                {/* Multiple Choice Options */}
                {exercise.type === 'MULTIPLE_CHOICE' && (
                  <div className="space-y-4 mt-4">
                    <Label>Options</Label>
                    {exercise.options.map((option: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          value={option} 
                          onChange={e => handleExerciseOptionChange(idx, e.target.value)} 
                          placeholder={`Option ${idx + 1}`}
                          required 
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleExerciseRemoveOption(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleExerciseAddOption}
                    >
                      Add Option
                    </Button>
                    <div className="space-y-2">
                      <Label>Correct Answer</Label>
                      <Input 
                        value={exercise.answer} 
                        onChange={e => handleExerciseChange('answer', e.target.value)} 
                        placeholder="Enter the correct answer"
                        required 
                      />
                    </div>
                  </div>
                )}

                {/* Fill in the Blank */}
                {exercise.type === 'FILL_IN_BLANK' && (
                  <div className="space-y-2 mt-4">
                    <Label>Correct Answer</Label>
                    <Input 
                      value={exercise.answer} 
                      onChange={e => handleExerciseChange('answer', e.target.value)} 
                      placeholder="Enter the correct answer"
                      required 
                    />
                    <p className="text-sm text-muted-foreground">
                      Tip: Use underscores (_) in your question to indicate blank spaces
                    </p>
                  </div>
                )}

                {/* Matching */}
                {exercise.type === 'MATCHING' && (
                  <div className="space-y-4 mt-4">
                    <Label>Matching Pairs</Label>
                    {exercise.options.map((pair: { left: string; right: string }, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input 
                          value={pair.left} 
                          onChange={e => handleExerciseMatchingChange(idx, 'left', e.target.value)} 
                          placeholder="Left item"
                          required 
                        />
                        <span className="text-muted-foreground">→</span>
                        <Input 
                          value={pair.right} 
                          onChange={e => handleExerciseMatchingChange(idx, 'right', e.target.value)} 
                          placeholder="Right item"
                          required 
                        />
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleExerciseRemoveMatchingPair(idx)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={handleExerciseAddMatchingPair}
                    >
                      Add Pair
                    </Button>
                    <div className="space-y-2">
                      <Label>Instructions for Students</Label>
                      <Textarea 
                        value={exercise.answer} 
                        onChange={e => handleExerciseChange('answer', e.target.value)} 
                        placeholder="e.g., Match the items on the left with their corresponding items on the right"
                        rows={2}
                        required 
                      />
                    </div>
                  </div>
                )}

                {/* Short Answer */}
                {exercise.type === 'SHORT_ANSWER' && (
                  <div className="space-y-2 mt-4">
                    <Label>Expected Answer</Label>
                    <Textarea 
                      value={exercise.answer} 
                      onChange={e => handleExerciseChange('answer', e.target.value)} 
                      placeholder="Enter the expected answer or key points"
                      rows={3}
                      required 
                    />
                    <p className="text-sm text-muted-foreground">
                      Tip: You can include multiple acceptable answers separated by commas
                    </p>
                  </div>
                )}

                {exerciseError && <div className="text-red-500 mt-4">{exerciseError}</div>}
                <div className="flex justify-end mt-6">
                  <Button type="submit" loading={exerciseLoading}>Save Exercise</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 