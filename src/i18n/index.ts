import { fr } from './translations/fr';
import { ar } from './translations/ar';

export type Language = 'fr' | 'ar';

export const translations = {
  fr,
  ar,
};

export const isRTL = (lang: Language): boolean => lang === 'ar';

export const languageNames: Record<Language, string> = {
  fr: 'Français',
  ar: 'العربية',
};

export type TranslationKey = keyof typeof fr;
