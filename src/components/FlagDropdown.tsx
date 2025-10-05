import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "react-i18next";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    flag: "https://img.freepik.com/free-vector/illustration-uk-flag_53876-18166.jpg?semt=ais_hybrid&w=740&q=80"
  },
  {
    code: "am",
    name: "Հայերեն",
    flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Armenia.svg/1280px-Flag_of_Armenia.svg.png"
  },
  {
    code: "ru",
    name: "Русский",
    flag: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/1200px-Flag_of_Russia.svg.png"
  },
  {
    code: "fa",
    name: "فارسی",
    flag: "/assets/flags/Iran-flag.png"
  }
];

interface FlagDropdownProps {
  isScrolled: boolean;
  onClose?: () => void;
}

const FlagDropdown = ({ isScrolled, onClose }: FlagDropdownProps) => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  
  const selectedLanguage = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          className={`flex items-center space-x-2 px-3 py-2 transition-colors duration-300 ${
            isScrolled
              ? "text-brand-text hover:text-brand-primary hover:bg-gray-100"
              : "text-white hover:text-brand-accent hover:bg-white/10"
          } touch-manipulation`}
        >
          <img
            src={selectedLanguage.flag}
            alt={`${selectedLanguage.name} flag`}
            className='w-4 h-3 object-cover rounded-sm'
          />
          <span className='text-sm font-medium'>
            {selectedLanguage.code.toUpperCase()}
          </span>
          <ChevronDown className='w-3 h-3' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        className='w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-[10001]'
        sideOffset={8}
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => {
              changeLanguage(language.code);
              // Close mobile menu if onClose function is provided
              if (onClose) onClose();
            }}
            className='flex items-center space-x-3 px-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 gap-2 touch-manipulation'
          >
            <img
              src={language.flag}
              alt={`${language.name} flag`}
              className='w-5 h-4 object-cover rounded-sm'
            />
            <div className='flex flex-col'>
              <span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                {language.name}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FlagDropdown;
