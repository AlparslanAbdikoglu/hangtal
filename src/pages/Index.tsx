
import { Hero } from "@/components/Hero";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { Footer } from "@/components/Footer";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { title: "Handpans", image: "/placeholder.svg" },
  { title: "Steel Tongue Drums", image: "/placeholder.svg" },
  { title: "Kalimbas", image: "/placeholder.svg" },
  { title: "Crystal Singing Bowls", image: "/placeholder.svg" },
  { title: "Crystal Singing Chalices", image: "/placeholder.svg" },
  { title: "Singing Bowls", image: "/placeholder.svg" },
];

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
  {
    title: "MEINL Sonic Energy Crystal Singing Bowl Set, Clear Quartz",
    price: 799.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy Handpan in D Celtic Minor",
    price: 1299.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasVideo: true,
    hasAudio: true,
  },
  {
    title: "MEINL Sonic Energy Kalimba, Professional Series",
    price: 129.00,
    image: "/lovable-uploads/f380d7a1-7aa0-404f-abff-0e416a61eacd.png",
    hasAudio: true,
  },
];

const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    url: "https://facebook.com/meinlsonic",
  },
  {
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    url: "https://instagram.com/meinlsonic",
  },
  {
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    url: "https://youtube.com/meinlsonic",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Hero />
      
      <section className="container py-16">
        <h2 className="text-3xl font-bold mb-8">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      <section className="container py-16 bg-muted">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <Carousel className="w-full max-w-6xl mx-auto">
          <CarouselContent>
            {products.map((product) => (
              <CarouselItem key={product.title} className="md:basis-1/2 lg:basis-1/3">
                <ProductCard {...product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <section className="container py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">Follow Us</h2>
        <div className="flex justify-center gap-6">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-secondary transition-colors"
            >
              <Button variant="ghost" size="icon">
                {link.icon}
                <span className="sr-only">{link.name}</span>
              </Button>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
