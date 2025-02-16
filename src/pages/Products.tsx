
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

const products = [
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Kurd, 9 Notes, 440 Hz, Lasered Floral Design, Black",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Amara, 9 Notes, 440 Hz, Lasered Floral Design, Navy Blue",
    price: 369.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy 16\" Octave Steel Tongue Drum, D Kurd, 9 Notes, 440 Hz, Black",
    price: 349.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  // Adding more mock products
  {
    title: "MEINL Sonic Energy Crystal Singing Bowl, 8\", Clear Quartz",
    price: 299.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy Handpan, D Minor, 9 Notes",
    price: 1299.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy Kalimba, 17 Keys, Mahogany",
    price: 89.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
  },
];

const Products = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
          {/* Filters Section */}
          <div className="w-full md:w-64 space-y-6">
            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <div className="space-y-2">
                {["All", "Handpans", "Steel Tongue Drums", "Kalimbas", "Crystal Singing Bowls"].map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">Under €100</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">€100 - €500</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">Over €500</span>
                </label>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">Clear Filters</Button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">All Products</h2>
              <Select>
                <select className="border rounded-md px-3 py-2">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest First</option>
                </select>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.title} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;
