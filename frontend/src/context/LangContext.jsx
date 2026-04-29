import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const { i18n } = useTranslation();
  const [lang, setLangState] = useState(i18n.language?.slice(0, 2) || 'uz');

  useEffect(() => {
    setLangState(i18n.language?.slice(0, 2) || 'uz');
  }, [i18n.language]);

  const setLang = (l) => {
    i18n.changeLanguage(l);
    localStorage.setItem('lang', l);
    setLangState(l);
    document.documentElement.lang = l;
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
}
