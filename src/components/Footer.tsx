
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#dfd4c6] text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.aboutTitle")}</h3>
            <p className="text-sm opacity-90">
              {t("footer.aboutText")}
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:opacity-80">{t("navbar.products")}</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:opacity-80">{t("navbar.about")}</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:opacity-80">{t("navbar.contact")}</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:opacity-80">{t("footer.shipping")}</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:opacity-80">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">{t("footer.contactTitle")}</h3>
            <ul className="space-y-2 text-sm">
              <li>{t("footer.email")}: info@meinlsonic.com</li>
              <li>{t("footer.phone")}: +1 (555) 123-4567</li>
              <li>{t("footer.address")}: 123 Sound Street</li>
              <li>{t("footer.city")}: Harmony City, HC 12345</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};
