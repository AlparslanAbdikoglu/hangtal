
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">About MEINL Sonic Energy</h1>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            MEINL Sonic Energy is dedicated to bringing you the finest musical instruments 
            for sound healing, meditation, and musical expression.
          </p>
          <p className="mb-6">
            Our journey began with a passion for creating instruments that inspire 
            creativity and promote well-being through the power of sound.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
