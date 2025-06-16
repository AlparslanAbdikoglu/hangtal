import { Menu, User, X } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { CartDrawer } from "./CartDrawer";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from 'react-i18next';

// Clerk imports
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
          <div className="text-xl font-bold text-primary">MEINL</div>
          
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
          <div className="hidden md:flex space-x-6 items-center">
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

            <LanguageSwitcher />

            {/* Clerk Auth Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon" aria-label="Sign in">
                  <User className="h-5 w-5" />
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>

            <CartDrawer />
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

              {/* Mobile Clerk buttons */}
              <div className="flex space-x-2 px-2 pt-2">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="w-full flex items-center justify-center gap-2">
                      <User className="h-5 w-5" />
                      {t('navbar.login')}
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
