import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { translations, isRTL, languageNames, Language, TranslationKey } from '@/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey | string) => string;
  isRTL: boolean;
  languageNames: typeof languageNames;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'app-language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Load from localStorage or default to French
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved === 'fr' || saved === 'ar') {
        return saved;
      }
    }
    return 'fr';
  });

  // Update document direction and language when language changes
  useEffect(() => {
    const dir = isRTL(language) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Add/remove RTL class for additional styling
    if (isRTL(language)) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
    
    // Save to localStorage
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback((key: TranslationKey | string): string => {
    const trans = translations[language];
    return (trans as Record<string, string>)[key] || key;
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        t, 
        isRTL: isRTL(language),
        languageNames 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export type { Language };
