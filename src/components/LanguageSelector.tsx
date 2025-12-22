import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, languageNames } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-500" />
      <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
        <SelectTrigger className="w-28 bg-white border-slate-300 text-slate-900">
          <SelectValue>{languageNames[language]}</SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200 z-50">
          <SelectItem value="fr" className="text-slate-900">
            {languageNames.fr}
          </SelectItem>
          <SelectItem value="ar" className="text-slate-900">
            {languageNames.ar}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
