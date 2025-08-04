import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faRightToBracket, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { myStoreHook } from "@/MyStoreContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Destructure cart, auth info and logout function from your store
  const { cart, isAuthenticated, setUserLogout } = myStoreHook();

  // Calculate total quantity of items in cart (sum quantities or default 1)
  const itemCount = Array.isArray(cart)
    ? cart.reduce((acc, item) => acc + (item.quantity ?? 1), 0)
    : 0;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    setUserLogout();      // Clear auth state and localStorage
    setIsMenuOpen(false); // Close mobile menu if open
    navigate("/");        // Redirect to homepage after logout
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
        {/* Logo */}
<div className="text-xl font-bold text-primary cursor-pointer" onClick={() => navigate('/')}>
  {t("siteTitle", "SoundAcademy")}
</div>
    

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center space-x-6">
  <Link to="/" className="text-primary hover:text-secondary transition-colors">{t('navbar.home')}</Link>
  <Link to="/categories" className="text-primary hover:text-secondary transition-colors">{t('navbar.products')}</Link>
  <Link to="/about" className="text-primary hover:text-secondary transition-colors">{t('navbar.about')}</Link>
  <Link to="/contact" className="text-primary hover:text-secondary transition-colors">{t('navbar.contact')}</Link>
</div>


          {/* Right controls: Language, Cart, Auth (login/logout and new pages) */}
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />

            <Link
              to="/cart"
              className="relative text-primary hover:text-secondary transition-colors"
              aria-label={`Cart with ${itemCount} items`}
            >
              <FontAwesomeIcon icon={faShoppingCart} size="lg" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/my-account"
                  className="hidden md:inline-block text-primary hover:text-secondary transition-colors ml-4"
                >
                  {t('navbar.myAccount') || "My Account"}
                </Link>
                <Link
                  to="/my-orders"
                  className="hidden md:inline-block text-primary hover:text-secondary transition-colors"
                >
                  {t('navbar.myOrders') || "My Orders"}
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Logout"
                  onClick={handleLogout}
                  title="Logout"
                  className="text-primary hover:text-secondary transition-colors"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Login"
                onClick={() => navigate("/login")}
                title="Login"
              >
                <FontAwesomeIcon icon={faRightToBracket} className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                {t('navbar.home')}
              </Link>
              <Link to="/products" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                {t('navbar.products')}
              </Link>
              <Link to="/about" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                {t('navbar.about')}
              </Link>
              <Link to="/contact" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                {t('navbar.contact')}
              </Link>
             


              {isAuthenticated ? (
                <>
                  <Link to="/my-account" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                    {t('navbar.myAccount') || "My Account"}
                  </Link>
                  <Link to="/my-orders" className="text-primary hover:text-secondary transition-colors px-2 py-1" onClick={() => setIsMenuOpen(false)}>
                    {t('navbar.myOrders') || "My Orders"}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-primary hover:text-secondary transition-colors px-2 py-1 text-left"
                  >
                    {t('navbar.logout') || "Logout"}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  className="text-primary hover:text-secondary transition-colors px-2 py-1 flex items-center space-x-1"
                >
                  <FontAwesomeIcon icon={faRightToBracket} />
                  <span>{t('navbar.loginSignup') || "Login/Signup"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
