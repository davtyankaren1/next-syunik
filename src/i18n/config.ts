import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import amTranslations from './locales/am.json';
import ruTranslations from './locales/ru.json';
import faTranslations from './locales/fa.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  am: {
    translation: amTranslations,
  },
  ru: {
    translation: ruTranslations,
  },
  fa: {
    translation: faTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'am',
    debug: false,
    
    interpolation: {
      escapeValue: false,
    },
    
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;