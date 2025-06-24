
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Clock, MapPin, Package, Shield, CreditCard } from "lucide-react";

const Shipping = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16 flex-1">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Shipping Information</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Standard Shipping
                </CardTitle>
                <CardDescription>Reliable delivery for all orders</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Free shipping on orders over €100</li>
                  <li>• €9.99 shipping fee for orders under €100</li>
                  <li>• Delivery within 5-7 business days</li>
                  <li>• Tracking information provided</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Express Shipping
                </CardTitle>
                <CardDescription>Fast delivery when you need it</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• €19.99 express shipping fee</li>
                  <li>• Delivery within 2-3 business days</li>
                  <li>• Priority handling and processing</li>
                  <li>• Real-time tracking updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6" />
                Shipping Zones
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zone 1: EU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Austria, Belgium, France, Germany, Netherlands, Luxembourg</p>
                    <p className="font-semibold mt-2">3-5 business days</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zone 2: Extended EU</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">Italy, Spain, Portugal, Poland, Czech Republic, Slovakia, Hungary</p>
                    <p className="font-semibold mt-2">5-7 business days</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Zone 3: International</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">United Kingdom, Switzerland, Norway, USA, Canada</p>
                    <p className="font-semibold mt-2">7-14 business days</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Package className="h-6 w-6" />
                Packaging & Handling
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Secure Packaging</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Each instrument is carefully wrapped in protective material</li>
                        <li>• Custom foam inserts for delicate items</li>
                        <li>• Sturdy cardboard boxes designed for musical instruments</li>
                        <li>• Fragile handling labels on all packages</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Processing Time</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Orders processed within 1-2 business days</li>
                        <li>• Quality check before shipping</li>
                        <li>• Email confirmation with tracking number</li>
                        <li>• Special handling for custom orders</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Shipping Protection
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Insurance Coverage</h3>
                      <p className="text-sm mb-3">All shipments are automatically insured up to their full value at no extra cost to you.</p>
                      <ul className="text-sm space-y-1">
                        <li>• Full replacement for damaged items</li>
                        <li>• Coverage for lost packages</li>
                        <li>• Quick claims processing</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Delivery Guarantee</h3>
                      <p className="text-sm mb-3">We guarantee safe delivery or your money back.</p>
                      <ul className="text-sm space-y-1">
                        <li>• Signature required for high-value items</li>
                        <li>• Photo proof of delivery</li>
                        <li>• Customer support for delivery issues</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Returns & Exchanges
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="mb-4">We want you to be completely satisfied with your purchase. If you're not happy with your sound healing instrument, we offer:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Return Policy</h3>
                      <ul className="text-sm space-y-1">
                        <li>• 30-day return window</li>
                        <li>• Items must be in original condition</li>
                        <li>• Free return shipping for defective items</li>
                        <li>• Full refund upon inspection</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Exchange Process</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Contact customer service for authorization</li>
                        <li>• Receive prepaid return label</li>
                        <li>• Quick processing of exchanges</li>
                        <li>• Priority shipping for replacement items</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="bg-muted p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Need Help?</h2>
              <p className="mb-4">Have questions about shipping or need to track your order?</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <p className="font-semibold">Customer Service</p>
                  <p className="text-sm">Email: shipping@meinlsonic.com</p>
                  <p className="text-sm">Phone: +1 (555) 123-4567</p>
                </div>
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-sm">Monday - Friday: 9:00 AM - 6:00 PM CET</p>
                  <p className="text-sm">Saturday: 10:00 AM - 4:00 PM CET</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Shipping;
