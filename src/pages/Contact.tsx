import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, BookOpen, Users, Send, Facebook, Instagram, Youtube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    url: "https://facebook.com/meinlsonic",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: "https://instagram.com/meinlsonic",
  },
  {
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    url: "https://youtube.com/meinlsonic",
  },
];
const Contact = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    toast({
      title: t('contact.successTitle'),
      description: t('contact.successDesc'),
    });

    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactReasons = [
    {
      icon: <BookOpen className="h-5 w-5" />,
      title: t('contact.reasons.learn.title'),
      content: t('contact.reasons.learn.content'),
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: t('contact.reasons.community.title'),
      content: t('contact.reasons.community.content'),
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      title: t('contact.reasons.feedback.title'),
      content: t('contact.reasons.feedback.content'),
    },
    {
      icon: <Mail className="h-5 w-5" />,
      title: t('contact.reasons.partnership.title'),
      content: t('contact.reasons.partnership.content'),
    }
  ];

  // Define your social links here
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('contact.description')}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900">{t('contact.formTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('contact.label.name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder={t('contact.placeholder.name')}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('contact.label.email')}</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder={t('contact.placeholder.email')}
                          required
                          className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">{t('contact.label.subject')}</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={t('contact.placeholder.subject')}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('contact.label.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder={t('contact.placeholder.message')}
                        rows={6}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          {t('contact.sending')}
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          {t('contact.sendButton')}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{t('contact.helpTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactReasons.map((reason, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                        {reason.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 mb-1">{reason.title}</h3>
                        <p className="text-gray-600 text-sm">{reason.content}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Contact Card */}
              <Card className="shadow-xl border-0 bg-gradient-to-br from-red-600 to-red-800 text-white">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{t('contact.quickContactTitle')}</h3>
                  <p className="text-red-100 text-sm mb-4">
                    {t('contact.quickContactDesc')}
                  </p>
                  <div className="space-y-2">
                    <a
                      href="mailto:info@hangtal.com"
                      className="block w-full bg-white/20 hover:bg-white/30 rounded-lg p-3 text-center transition-colors"
                    >
                      📧 info@hangtal.com
                    </a>
                    <div className="text-center text-red-100 text-sm mt-4">
                      <p>{t('contact.supportedLanguages')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      {/* Social Links Section */}
            <section className="container py-12 text-center bg-soul-darkBrown">
              <h2 className="text-2xl font-bold mb-6 text-black">{t('footer.followUs')}</h2>
              <div className="flex justify-center gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black hover:text-soul-lightBrown transition-colors"
                  >
                    <Button variant="ghost" size="icon" className="text-slate-700 hover:text-soul-lightBrown">
                      {link.icon}
                      <span className="sr-only">{link.name}</span>
                    </Button>
                  </a>
                ))}
              </div>
            </section>
      <Footer />
    </>
  );
};

export default Contact;