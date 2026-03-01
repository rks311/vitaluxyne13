import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import MobileNav from "@/components/layout/MobileNav";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import Index from "./pages/Index";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import PackBuilder from "./pages/PackBuilder";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <CartProvider>
          <Header />
          <CartDrawer />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogue" element={<Catalog />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/pack" element={<PackBuilder />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <MobileNav />
          <WhatsAppButton />
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
