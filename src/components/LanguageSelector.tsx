import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-slate-500" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-24 bg-white border-slate-300 text-slate-900 hover:bg-slate-50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-slate-200">
          <SelectItem value="fr" className="text-slate-900 hover:bg-slate-100">FR</SelectItem>
          <SelectItem value="en" className="text-slate-900 hover:bg-slate-100">EN</SelectItem>
          <SelectItem value="ar" className="text-slate-900 hover:bg-slate-100">AR</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
