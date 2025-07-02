import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { CartProvider, useCart } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Shipping from "./pages/Shipping";
import Privacy from "./pages/Privacy";
import ProductPage from "./pages/ProductPage";



const queryClient = new QueryClient();

const AppRoutes = () => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/about" element={<About />} />
      <Route path="/shipping" element={<Shipping />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/products/:id" element={<ProductPage />} />
     
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
