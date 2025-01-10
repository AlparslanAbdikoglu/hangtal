import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm opacity-90">
              MEINL Sonic Energy offers high-quality sound therapy instruments for meditation, 
              relaxation, and sound healing.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-sm hover:opacity-80">Products</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:opacity-80">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:opacity-80">Contact</Link>
              </li>
              <li>
                <Link to="/shipping" className="text-sm hover:opacity-80">Shipping Info</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: info@meinlsonic.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Sound Street</li>
              <li>Harmony City, HC 12345</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-sm mb-4">
              Subscribe to receive updates about new products and special offers.
            </p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 text-primary bg-white rounded-md"
            />
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm">
          <p>© 2024 MEINL Sonic Energy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};