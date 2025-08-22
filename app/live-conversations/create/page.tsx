'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Globe,
  MessageCircle,
  GraduationCap,
  BookOpen,
  DollarSign,
  Save,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface ConversationForm {
  title: string
  description: string
  conversationType: string
  language: string
  level: string
  startTime: string
  endTime: string
  duration: number
  maxParticipants: number
  price: number
  isPublic: boolean
  isFree: boolean
  topic: string
  culturalNotes: string
  vocabularyList: string[]
  grammarPoints: string[]
  conversationPrompts: string[]
  requiresSubscription?: boolean
  allowedStudentTiers?: string[]
  allowedInstitutionTiers?: string[]
}

export default function CreateConversationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<ConversationForm>({
    title: '',
    description: '',
    conversationType: 'GROUP',
    language: 'en',
    level: 'CEFR_B1',
    startTime: '',
    endTime: '',
    duration: 60,
    maxParticipants: 8,
    price: 0,
    isPublic: true,
    isFree: true,
    topic: '',
    culturalNotes: '',
    vocabularyList: [],
    grammarPoints: [],
    conversationPrompts: []
    ,requiresSubscription: false
    ,allowedStudentTiers: []
    ,allowedInstitutionTiers: []
  })

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' }
  ]

  const levels = [
    { code: 'CEFR_A1', name: 'Beginner (A1)' },
    { code: 'CEFR_A2', name: 'Elementary (A2)' },
    { code: 'CEFR_B1', name: 'Intermediate (B1)' },
    { code: 'CEFR_B2', name: 'Upper Intermediate (B2)' },
    { code: 'CEFR_C1', name: 'Advanced (C1)' },
    { code: 'CEFR_C2', name: 'Proficient (C2)' }
  ]

  const conversationTypes = [
    { code: 'GROUP', name: 'Group Practice' },
    { code: 'PRIVATE', name: 'Private Session' },
    { code: 'PRACTICE', name: 'Practice Session' },
    { code: 'CULTURAL', name: 'Cultural Exchange' }
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin')
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.title || !form.startTime || !form.endTime) {
      toast.error('Please fill in all required fields')
      return
    }

    const startDateTime = new Date(form.startTime)
    const endDateTime = new Date(form.endTime)
    const now = new Date()

    if (startDateTime <= now) {
      toast.error('Start time must be in the future')
      return
    }

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/live-conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Conversation created successfully!')
        router.push('/live-conversations')
      } else {
        toast.error(data.error || 'Failed to create conversation')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      toast.error('Failed to create conversation')
    } finally {
      setLoading(false)
    }
  }

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setForm({ ...form, [field]: value })
    
    // Auto-calculate duration if both times are set
    if (field === 'startTime' && form.endTime) {
      const start = new Date(value)
      const end = new Date(form.endTime)
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      if (duration > 0) {
        setForm({ ...form, [field]: value, duration })
      }
    } else if (field === 'endTime' && form.startTime) {
      const start = new Date(form.startTime)
      const end = new Date(value)
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      if (duration > 0) {
        setForm({ ...form, [field]: value, duration })
      }
    }
  }

  const addVocabularyWord = () => {
    const word = prompt('Enter vocabulary word:')
    if (word && word.trim()) {
      setForm({
        ...form,
        vocabularyList: [...form.vocabularyList, word.trim()]
      })
    }
  }

  const removeVocabularyWord = (index: number) => {
    setForm({
      ...form,
      vocabularyList: form.vocabularyList.filter((_, i) => i !== index)
    })
  }

  const addGrammarPoint = () => {
    const point = prompt('Enter grammar point:')
    if (point && point.trim()) {
      setForm({
        ...form,
        grammarPoints: [...form.grammarPoints, point.trim()]
      })
    }
  }

  const removeGrammarPoint = (index: number) => {
    setForm({
      ...form,
      grammarPoints: form.grammarPoints.filter((_, i) => i !== index)
    })
  }

  const addConversationPrompt = () => {
    const prompt = prompt('Enter conversation prompt:')
    if (prompt && prompt.trim()) {
      setForm({
        ...form,
        conversationPrompts: [...form.conversationPrompts, prompt.trim()]
      })
    }
  }

  const removeConversationPrompt = (index: number) => {
    setForm({
      ...form,
      conversationPrompts: form.conversationPrompts.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Live Conversation</h1>
              <p className="text-gray-600 mt-1">
                Set up a new conversation session for language practice
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Enter conversation title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    placeholder="e.g., Travel, Business, Daily Life"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe what this conversation will cover..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select value={form.language} onValueChange={(value) => setForm({ ...form, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          <span className="mr-2">{language.flag}</span>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select value={form.level} onValueChange={(value) => setForm({ ...form, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level.code} value={level.code}>
                          {level.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Type *</Label>
                  <Select value={form.conversationType} onValueChange={(value) => setForm({ ...form, conversationType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conversationTypes.map((type) => (
                        <SelectItem key={type.code} value={type.code}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startTime">Start Time *</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => handleTimeChange('startTime', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time *</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => handleTimeChange('endTime', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) || 0 })}
                    min="15"
                    max="240"
                  />
                </div>
                <div>
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={form.maxParticipants}
                    onChange={(e) => setForm({ ...form, maxParticipants: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFree"
                  checked={form.isFree}
                  onCheckedChange={(checked) => setForm({ ...form, isFree: checked, price: checked ? 0 : form.price })}
                />
                <Label htmlFor="isFree">Free Session</Label>
              </div>
              
              {!form.isFree && (
                <div>
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                    min="0"
                    step="0.01"
                  />
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={form.isPublic}
                  onCheckedChange={(checked) => setForm({ ...form, isPublic: checked })}
                />
                <Label htmlFor="isPublic">Public Session (visible to all users)</Label>
              </div>
            </CardContent>
          </Card>

          {/* Access & Subscription Gating */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Access & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="requiresSubscription"
                  checked={!!form.requiresSubscription}
                  onCheckedChange={(checked) => setForm({ ...form, requiresSubscription: checked })}
                />
                <Label htmlFor="requiresSubscription">Requires active subscription to book</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-2 block">Allowed Student Tiers</Label>
                  <div className="space-y-2 text-sm text-gray-700">
                    {['BASIC','PREMIUM','PRO'].map((tier) => {
                      const checked = form.allowedStudentTiers?.includes(tier) || false
                      return (
                        <label key={tier} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(form.allowedStudentTiers)
                              if (e.target.checked) next.add(tier)
                              else next.delete(tier)
                              setForm({ ...form, allowedStudentTiers: Array.from(next) })
                            }}
                          />
                          <span>{tier}</span>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to allow all student tiers (if subscription is required).</p>
                </div>
                <div>
                  <Label className="mb-2 block">Allowed Institution Tiers</Label>
                  <div className="space-y-2 text-sm text-gray-700">
                    {['STARTER','PROFESSIONAL','ENTERPRISE'].map((tier) => {
                      const checked = form.allowedInstitutionTiers?.includes(tier) || false
                      return (
                        <label key={tier} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const next = new Set(form.allowedInstitutionTiers)
                              if (e.target.checked) next.add(tier)
                              else next.delete(tier)
                              setForm({ ...form, allowedInstitutionTiers: Array.from(next) })
                            }}
                          />
                          <span>{tier}</span>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave empty to allow all institution tiers.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Learning Materials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Learning Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="culturalNotes">Cultural Notes</Label>
                <Textarea
                  id="culturalNotes"
                  value={form.culturalNotes}
                  onChange={(e) => setForm({ ...form, culturalNotes: e.target.value })}
                  placeholder="Add cultural context and notes..."
                  rows={3}
                />
              </div>

              {/* Vocabulary List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Vocabulary List</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addVocabularyWord}>
                    Add Word
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.vocabularyList.map((word, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={word} readOnly />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVocabularyWord(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grammar Points */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Grammar Points</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addGrammarPoint}>
                    Add Point
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.grammarPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={point} readOnly />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeGrammarPoint(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Conversation Prompts */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Conversation Prompts</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addConversationPrompt}>
                    Add Prompt
                  </Button>
                </div>
                <div className="space-y-2">
                  {form.conversationPrompts.map((prompt, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={prompt} readOnly />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConversationPrompt(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Conversation
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 