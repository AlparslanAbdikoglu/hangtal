import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from 'react-i18next';

type Feature = {
  title: string;
  description: string;
};

type Section = {
  title: string;
  paragraphs?: string[];
  listTitle?: string;
  listItems?: string[];
  closingParagraph?: string;
  features?: Feature[];
};

type FAQItem = {
  question: string;
  answerParagraphs?: string[];
  listItems?: string[];
  closing?: string;
  linkText?: string;
  linkUrl?: string;
};

const About = () => {
  const { t } = useTranslation();

  const introParagraphs = t('about.introParagraphs', { returnObjects: true }) as string[];
  const sections = t('about.sections', { returnObjects: true }) as Section[];
  const faqTitle = t('about.faqTitle');
  const faqItems = t('about.faqItems', { returnObjects: true }) as FAQItem[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl font-bold text-primary mb-6">{t('about.title')}</h1>
              {introParagraphs?.map((paragraph, index) => (
                <p key={index} className="text-foreground mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img
                src="/images/Ardi1.webp"
                alt={t('about.imageAlt')}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {sections?.map((section, index) => (
            <section key={`${section.title}-${index}`} className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">{section.title}</h2>

              {section.paragraphs?.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className="text-foreground">
                  {paragraph}
                </p>
              ))}

              {section.listTitle && section.listItems && (
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">{section.listTitle}</p>
                  <ul className="list-disc list-inside space-y-1 text-foreground">
                    {section.listItems.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {section.features && (
                <div className="grid md:grid-cols-2 gap-4">
                  {section.features.map((feature) => (
                    <div
                      key={feature.title}
                      className="p-4 rounded-lg border bg-muted/50 space-y-2"
                    >
                      <h3 className="text-xl font-semibold text-primary">{feature.title}</h3>
                      <p className="text-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}

              {section.closingParagraph && (
                <p className="text-foreground">{section.closingParagraph}</p>
              )}
            </section>
          ))}

          {faqItems?.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-primary">{faqTitle}</h2>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {faqItems.map((faq) => (
                  <div
                    key={faq.question}
                    className="h-full p-4 rounded-lg border bg-muted/50 space-y-2"
                  >
                    <h3 className="text-xl font-semibold text-primary">{faq.question}</h3>

                    {faq.answerParagraphs?.map((paragraph, index) => (
                      <p key={index} className="text-foreground">
                        {paragraph}
                      </p>
                    ))}

                    {faq.listItems && (
                      <ul className="list-disc list-inside space-y-1 text-foreground">
                        {faq.listItems.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    )}

                    {faq.closing && <p className="text-foreground">{faq.closing}</p>}

                    {faq.linkUrl && faq.linkText && (
                      <a
                        href={faq.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline font-medium"
                      >
                        {faq.linkText}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="bg-muted/60 p-6 rounded-lg border space-y-2">
            <p className="text-sm font-medium text-primary uppercase tracking-wide">
              {t('about.quoteLabel')}
            </p>
            <blockquote className="text-lg text-foreground italic">
              {t('about.quoteText')}
            </blockquote>
            <p className="text-foreground">{t('about.quoteAuthor')}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
