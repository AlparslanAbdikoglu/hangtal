import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useTranslation } from 'react-i18next';

const flags: Record<string, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
  hu: "🇭🇺",
  sk: "🇸🇰",
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">{flags.en} EN</SelectItem>
        <SelectItem value="de">{flags.de} DE</SelectItem>
        <SelectItem value="hu">{flags.hu} HU</SelectItem>
        <SelectItem value="sk">{flags.sk} SK</SelectItem>
      </SelectContent>
    </Select>
  );
};
