'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Eye, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

interface Question {
  id: string;
  question: string;
  type: string;
  points: number;
  category?: string;
  difficulty?: string;
}

interface QuestionBank {
  id: string;
  name: string;
  description?: string;
  category?: string;
  tags?: unknown;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  questions_count?: number;
  user?: { name: string };
  questions?: { question: Question }[];
}

export default function QuestionBankDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [bank, setBank] = useState<QuestionBank | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [importing, setImporting] = useState(false);
  const [questionId, setQuestionId] = useState('');

  useEffect(() => {
    fetchBank();
  }, [params.id]);

  const fetchBank = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/question-banks/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setBank(data);
      } else {
        toast.error('Failed to fetch question bank');
      }
    } catch (e) {
      toast.error('Failed to fetch question bank');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!questionId.trim()) {
      toast.error('Enter a question ID to add');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch(`/api/admin/question-banks/${params.id}/add-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId })
      });
      if (res.ok) {
        toast.success('Question added');
        setQuestionId('');
        fetchBank();
      } else {
        toast.error('Failed to add question');
      }
    } catch (e) {
      toast.error('Failed to add question');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveQuestion = async (qid: string) => {
    if (!confirm('Remove this question from the bank?')) return;
    try {
      const res = await fetch(`/api/admin/question-banks/${params.id}/remove-question`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: qid })
      });
      if (res.ok) {
        toast.success('Question removed');
        fetchBank();
      } else {
        toast.error('Failed to remove question');
      }
    } catch (e) {
      toast.error('Failed to remove question');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/admin/question-banks/${params.id}/export`);
      if (res.ok) {
        const data = await res.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${bank?.name || 'question-bank'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Question bank exported successfully');
      } else {
        toast.error('Failed to export question bank');
      }
    } catch (e) {
      toast.error('Failed to export question bank');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!data.questions || !Array.isArray(data.questions)) {
        toast.error('Invalid file format');
        return;
      }
      
      const res = await fetch(`/api/admin/question-banks/${params.id}/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: data.questions })
      });
      
      if (res.ok) {
        const result = await res.json();
        toast.success(`Imported ${result.imported} questions`);
        fetchBank();
      } else {
        toast.error('Failed to import questions');
      }
    } catch (e) {
      toast.error('Failed to import questions');
    } finally {
      setImporting(false);
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!bank) {
    return <div className="p-8 text-center text-red-500">Question bank not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{bank.name}</h1>
          <p className="text-muted-foreground">{bank.description}</p>
          <div className="flex space-x-2 mt-2">
            {bank.category && <Badge variant="secondary">{bank.category}</Badge>}
            {bank.is_public && <Badge variant="outline">Public</Badge>}
            <span className="text-xs text-muted-foreground">{bank.questions_count || 0} questions</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
      </div>

      {/* Import/Export */}
      <Card>
        <CardHeader>
          <CardTitle>Import/Export Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <div>
              <Label htmlFor="import-file">Import Questions (JSON)</Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="w-64"
              />
            </div>
            {importing && <FaSpinner className="w-4 h-4 animate-spin" />}
          </div>
          <p className="text-sm text-muted-foreground">
            Upload a JSON file with questions to import them into this bank. Use the Export button to download the current format.
          </p>
        </CardContent>
      </Card>

      {/* Add Question */}
      <Card>
        <CardHeader>
          <CardTitle>Add Question to Bank</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter Question ID"
              value={questionId}
              onChange={e => setQuestionId(e.target.value)}
              className="w-64"
            />
            <Button onClick={handleAddQuestion} disabled={adding}>
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <Card>
        <CardHeader>
          <CardTitle>Questions in this Bank</CardTitle>
        </CardHeader>
        <CardContent>
          {bank.questions && bank.questions.length > 0 ? (
            <div className="space-y-4">
              {bank.questions.map(qb => (
                <div key={qb.question.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-semibold">{qb.question.question}</div>
                    <div className="text-xs text-muted-foreground">
                      {qb.question.type} • {qb.question.points} pts • {qb.question.category} • {qb.question.difficulty}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/courses/any/modules/any/quizzes/any/questions/${qb.question.id}/edit`)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(qb.question.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No questions in this bank yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 