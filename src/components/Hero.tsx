import { useTranslation } from "react-i18next";

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[500px] w-full bg-background py-12">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {t("hero.title")}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-xl">
            {t("hero.subtitle")}
          </p>
          <p className="text-base text-muted-foreground max-w-lg">
            {t("hero.description")}
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img 
            src="/images/webshop.jpg"
            alt={t("hero.imageAlt")}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8 text-center text-muted-foreground">
      <p>{t("footer.copyright")}</p>
      <a href="/privacy" className="mx-2 underline">{t("footer.privacy")}</a>
      <a href="/terms" className="mx-2 underline">{t("footer.terms")}</a>
    </footer>
  );
};
