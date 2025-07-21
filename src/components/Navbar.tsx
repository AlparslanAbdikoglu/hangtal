import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary">Webshop</div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop navigation */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-primary hover:text-secondary transition-colors">
              {t('navbar.home')}
            </Link>
            <Link to="/products" className="text-primary hover:text-secondary transition-colors">
              {t('navbar.products')}
            </Link>
            <Link to="/about" className="text-primary hover:text-secondary transition-colors">
              {t('navbar.about')}
            </Link>
            <Link to="/contact" className="text-primary hover:text-secondary transition-colors">
              {t('navbar.contact')}
            </Link>
          </div>

          {/* Right-side controls */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8V22h19.2v-2.8c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-primary hover:text-secondary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.home')}
              </Link>
              <Link 
                to="/products" 
                className="text-primary hover:text-secondary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.products')}
              </Link>
              <Link 
                to="/about" 
                className="text-primary hover:text-secondary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.about')}
              </Link>
              <Link 
                to="/contact" 
                className="text-primary hover:text-secondary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
