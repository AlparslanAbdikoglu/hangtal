// my-webshop/frontend/src/App.tsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

// Import your pages
import Index from "./pages/Index";
import Products from "./pages/Products";
import About from "./pages/About";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

// Ensure Clerk Publishable Key is available from environment variables
// It's passed as a build argument in the Dockerfile
const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key. Please ensure REACT_APP_CLERK_PUBLISHABLE_KEY is set in your Docker Compose environment.");
}

const App = () => (
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignInUrl="/"
    afterSignUpUrl="/"
    afterSignOutUrl="/"
  >
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          {/* Add a header with Clerk buttons. You might want to put this in a dedicated Layout component */}
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderBottom: '1px solid #ccc' }}>
              <h1 style={{ margin: 0, fontSize: '1.5em' }}>My Headless Webshop</h1>
              <nav> {/* Example navigation, integrate with your actual nav */}
                  <a href="/" style={{ margin: '0 10px' }}>Home</a>
                  <a href="/products" style={{ margin: '0 10px' }}>Products</a>
                  <a href="/contact" style={{ margin: '0 10px' }}>Contact</a>
                  <a href="/about" style={{ margin: '0 10px' }}>About</a>
              </nav>
              <SignedOut>
                  <SignInButton mode="modal" />
              </SignedOut>
              <SignedIn>
                  <UserButton />
              </SignedIn>
          </header>

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/products" element={<Products />} /> {/* Products page will handle auth & list */}
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  </ClerkProvider>
);
