import  {Navbar}  from "../components/Navbar.tsx";
import  {Footer}  from "../components/Footer";
import { Button } from "../components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";


const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="container py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-primary mb-4">{t("contact.title")}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("contact.subtitle")}
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-primary mb-6">{t("contact.infoTitle")}</h2>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{t("contact.email")}</h3>
                      <p className="text-muted-foreground">hangakademia@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{t("contact.phone")}</h3>
                      <p className="text-muted-foreground">+36 307402048</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">{t("contact.address")}</h3>
                      <p className="text-muted-foreground">
                       1188 Budapest, Nemes u.88.<br />
                       
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Simple Email Button */}
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-primary mb-6">{t("contact.formTitle")}</h2>
              <p className="mb-6 text-muted-foreground text-center">{t("contact.emailPrompt")}</p>
              <a
                href="mailto:hangakademia@gmail.com"
                className="w-full"
                style={{ textDecoration: "none" }}
              >
                <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg">
                  {t("contact.sendEmail")}
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
