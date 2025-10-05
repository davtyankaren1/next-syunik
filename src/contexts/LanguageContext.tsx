import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => void;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const rtlLanguages = ['fa', 'ar', 'he'];

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const currentLanguage = i18n.language;
  // Only apply RTL if not on mobile
  const isRTL = !isMobile && rtlLanguages.includes(currentLanguage);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    // Update document direction and lang attribute
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
    
    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add('rtl');
    } else {
      document.body.classList.remove('rtl');
    }
    
    // For mobile with Persian, always ensure LTR
    if (isMobile && rtlLanguages.includes(currentLanguage)) {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
    }
  }, [currentLanguage, isRTL, isMobile]);

  return (
    <LanguageContext.Provider value={{ 
      currentLanguage, 
      changeLanguage, 
      isRTL 
    }}>
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