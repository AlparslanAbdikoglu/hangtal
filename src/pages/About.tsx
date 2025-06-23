import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-6">{t('about.title')}</h1>
              <p className="text-foreground mb-4">
                {t('about.intro1')}
              </p>
              <p className="text-foreground">
                {t('about.intro2')}
              </p>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src="/placeholder.svg"
                alt={t('about.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8">{t('about.mission')}</h2>
            <p className="text-foreground mb-4">
              {t('about.missionText')}
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-primary mb-8">{t('about.faq')}</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t('about.faqItems.soundHealing')}</AccordionTrigger>
                <AccordionContent>
                  {t('about.faqAnswers.soundHealing')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t('about.faqItems.chooseInstrument')}</AccordionTrigger>
                <AccordionContent>
                  {t('about.faqAnswers.chooseInstrument')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>{t('about.faqItems.workshops')}</AccordionTrigger>
                <AccordionContent>
                  {t('about.faqAnswers.workshops')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>{t('about.faqItems.benefits')}</AccordionTrigger>
                <AccordionContent>
                  {t('about.faqAnswers.benefits')}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
