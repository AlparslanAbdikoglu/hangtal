import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CreditCard } from 'lucide-react';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'HU',
    phone: '',
  });

  useEffect(() => {
    // Redirect if cart is empty and not currently processing a payment
    if (items.length === 0 && !isProcessing) {
      toast({
        title: "Your cart is empty!",
        description: "Please add items to your cart before checking out.",
        variant: "destructive",
      });
      navigate('/products');
    }
  }, [items, isProcessing, navigate, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Simulate payment process locally
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate a short delay for "processing"
    setTimeout(async () => {
      await clearCart(); // Clear the cart after successful payment simulation
      toast({
        title: "Fizetés sikeres!",
        description: "Köszönjük a vásárlást. Hamarosan kapni fog egy email megerősítést.",
      });
      navigate('/payment-success'); // Navigate to a success page
    }, 1500);
  };

  // If items are empty and not processing, return null to prevent rendering
  // as the useEffect hook will handle the redirection.
  if (items.length === 0 && !isProcessing) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-inter">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fizetés</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="rounded-lg shadow-md">
            <CardHeader className="bg-gray-100 rounded-t-lg p-4">
              <CardTitle className="text-xl font-semibold text-gray-800">Rendelés összesítő</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 mb-4 pb-4 border-b last:border-b-0 last:pb-0 last:mb-0">
                  <img
                    src={item.image || 'https://placehold.co/80x80/cccccc/333333?text=No+Image'}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-md shadow-sm"
                  />
                  <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x {parseFloat(item.price.toFixed(2))} Ft
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} Ft
                  </span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                  <span>Összesen:</span>
                  <span>{totalPrice.toFixed(2)} Ft</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment and Billing Form */}
          <Card className="rounded-lg shadow-md">
            <CardHeader className="bg-gray-100 rounded-t-lg p-4">
              <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                <CreditCard className="h-5 w-5 text-gray-700" />
                Számlázási és Szállítási adatok
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Keresztnév</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Vezetéknév</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email cím</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefonszám</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    className="rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="address1">Cím (utca, házszám)</Label>
                  <Input
                    id="address1"
                    value={formData.address1}
                    onChange={(e) => handleInputChange('address1', e.target.value)}
                    required
                    className="rounded-md"
                  />
                </div>

                <div>
                  <Label htmlFor="address2">Cím 2 (emelet, ajtó, stb. - opcionális)</Label>
                  <Input
                    id="address2"
                    value={formData.address2}
                    onChange={(e) => handleInputChange('address2', e.target.value)}
                    className="rounded-md"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Város</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Irányítószám</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      required
                      className="rounded-md"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">Megye/Állam (opcionális)</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className="rounded-md"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Ország</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      required
                      className="rounded-md"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                  {isProcessing ? 'Feldolgozás...' : `Fizetés - ${totalPrice.toFixed(2)} Ft`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
