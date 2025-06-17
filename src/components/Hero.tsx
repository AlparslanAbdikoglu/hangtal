import { useTranslation } from 'react-i18next';

export const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-[500px] w-full bg-background py-12">
      <div className="container grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-secondary-foreground max-w-xl">
            {t('hero.description1')}
          </p>
          <p className="text-base text-muted-foreground max-w-lg">
            {t('hero.description2')}
          </p>
        </div>
        
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <img 
            src="/placeholder.svg"
            alt={t('hero.imageAlt')}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};