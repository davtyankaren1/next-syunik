// BackButton.tsx
import { t } from 'i18next';
import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  label?: string; // Optional label for accessibility, defaults to "Back"
}

const BackButton: React.FC<BackButtonProps> = ({ onClick, label }) => {

  return (
    <button
      onClick={onClick}
      aria-label={t("nav.back_button")}
      className="flex items-center group h-10 rounded-full bg-white/70 backdrop-blur-sm text-brand-text border border-black/5 px-4 pr-5 shadow-sm hover:bg-[#ED5027] hover:text-white hover:border-[#ED5027]/50 transition-all"
    >
      <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-0.5" />
      <span className="font-medium">{t("nav.back_button")}</span>
    </button>
  );
};

export default BackButton;
