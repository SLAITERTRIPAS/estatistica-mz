import React, { createContext, useContext, useState } from 'react';
import { translations, TranslationKey } from '../i18n/translations';

type Language = 'pt' | 'en';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  isLanguageSet: boolean;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('pt');
  const [isLanguageSet] = useState<boolean>(true);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('app_lang', newLang);
  };

  const t = (key: TranslationKey) => translations[lang][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, isLanguageSet, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
