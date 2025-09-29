
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import hu from './locales/hu.json';
import sk from './locales/sk.json';
import de from './locales/de.json';

i18n
  .use(LanguageDetector) // use this if you dont want to forcce a language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hu: { translation: hu },
      sk: { translation: sk },
      de: { translation: de },
    },
    lng: "hu", // force
    fallbackLng: 'hu',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
