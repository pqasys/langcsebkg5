'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Globe, Star } from 'lucide-react';
import { LANGUAGES, PROFICIENCY_LEVELS, type LanguageProficiency, type ProficiencyLevel } from '@/lib/data/languages';
import { toast } from 'sonner';

interface LanguageProficiencyManagerProps {
  value: LanguageProficiency[];
  onChange: (languages: LanguageProficiency[]) => void;
  disabled?: boolean;
}

export default function LanguageProficiencyManager({ 
  value, 
  onChange, 
  disabled = false 
}: LanguageProficiencyManagerProps) {
  const [languages, setLanguages] = useState<LanguageProficiency[]>(value || []);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<ProficiencyLevel>('INTERMEDIATE');

  useEffect(() => {
    setLanguages(value || []);
  }, [value]);

  const handleAddLanguage = () => {
    if (!selectedLanguage) {
      toast.error('Please select a language');
      return;
    }

    const languageExists = languages.some(lang => lang.language === selectedLanguage);
    if (languageExists) {
      toast.error('This language is already added');
      return;
    }

    const newLanguage: LanguageProficiency = {
      language: selectedLanguage,
      level: selectedLevel,
      isNative: selectedLevel === 'NATIVE'
    };

    const updatedLanguages = [...languages, newLanguage];
    setLanguages(updatedLanguages);
    onChange(updatedLanguages);
    
    setSelectedLanguage('');
    setSelectedLevel('INTERMEDIATE');
    toast.success('Language added successfully');
  };

  const handleRemoveLanguage = (languageToRemove: string) => {
    const updatedLanguages = languages.filter(lang => lang.language !== languageToRemove);
    setLanguages(updatedLanguages);
    onChange(updatedLanguages);
    toast.success('Language removed successfully');
  };

  const handleUpdateLevel = (language: string, newLevel: ProficiencyLevel) => {
    const updatedLanguages = languages.map(lang => 
      lang.language === language 
        ? { ...lang, level: newLevel, isNative: newLevel === 'NATIVE' }
        : lang
    );
    setLanguages(updatedLanguages);
    onChange(updatedLanguages);
  };

  const getLanguageInfo = (languageCode: string) => {
    return LANGUAGES.find(lang => lang.code === languageCode);
  };

  const getProficiencyColor = (level: ProficiencyLevel) => {
    switch (level) {
      case 'NATIVE': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'FLUENT': return 'bg-green-100 text-green-800 border-green-200';
      case 'ADVANCED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BEGINNER': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'BASIC': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe className="w-5 h-5" />
          Language Proficiency
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Languages */}
        {languages.length > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Your Languages</Label>
            <div className="grid gap-3">
              {languages.map((lang) => {
                const languageInfo = getLanguageInfo(lang.language);
                return (
                  <div key={lang.language} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {lang.isNative && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                        <span className="text-lg">{languageInfo?.flag}</span>
                        <span className="font-medium">{languageInfo?.name}</span>
                        {languageInfo?.nativeName !== languageInfo?.name && (
                          <span className="text-sm text-gray-500">({languageInfo?.nativeName})</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={lang.level}
                        onValueChange={(value: ProficiencyLevel) => handleUpdateLevel(lang.language, value)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PROFICIENCY_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Badge className={getProficiencyColor(lang.level)}>
                        {PROFICIENCY_LEVELS.find(p => p.value === lang.level)?.label}
                      </Badge>
                      {!disabled && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveLanguage(lang.language)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Add New Language */}
        {!disabled && (
          <div className="space-y-3 pt-4 border-t">
            <Label className="text-sm font-medium">Add New Language</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      <div className="flex items-center gap-2">
                        <span>{language.flag}</span>
                        <span>{language.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLevel} onValueChange={(value: ProficiencyLevel) => setSelectedLevel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleAddLanguage}
                disabled={!selectedLanguage}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Language
              </Button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• <strong>Native:</strong> Your first language or bilingual</p>
          <p>• <strong>Fluent:</strong> Can speak, read, and write fluently</p>
          <p>• <strong>Advanced:</strong> Can handle complex conversations</p>
          <p>• <strong>Intermediate:</strong> Can handle everyday conversations</p>
          <p>• <strong>Beginner:</strong> Basic understanding and simple conversations</p>
          <p>• <strong>Basic:</strong> Very basic phrases and greetings</p>
        </div>
      </CardContent>
    </Card>
  );
} 