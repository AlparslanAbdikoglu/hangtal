import { Button } from "./ui/button";
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const languages = [
  { code: 'en', name: 'English', flagCode: 'us' },  // Use US flag for English
  { code: 'hu', name: 'Magyar', flagCode: 'hu' },
  { code: 'sk', name: 'Slovenčina', flagCode: 'sk' },
  { code: 'de', name: 'Deutsch', flagCode: 'de' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 px-2">
          <img
            src={`https://flagcdn.com/24x18/${currentLanguage.flagCode}.png`}
            alt={`${currentLanguage.name} flag`}
            className="w-6 h-4 rounded-sm object-cover"
            loading="lazy"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-2 ${
              i18n.language === language.code ? 'bg-muted' : ''
            }`}
          >
            <img
              src={`https://flagcdn.com/24x18/${language.flagCode}.png`}
              alt={`${language.name} flag`}
              className="w-6 h-4 rounded-sm object-cover"
              loading="lazy"
            />
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
