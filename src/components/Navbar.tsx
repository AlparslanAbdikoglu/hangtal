import { ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-primary">MEINL</div>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-primary hover:text-secondary transition-colors">
              Home
            </Link>
            <Link to="/products" className="text-primary hover:text-secondary transition-colors">
              Products
            </Link>
            <Link to="/about" className="text-primary hover:text-secondary transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-primary hover:text-secondary transition-colors">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};