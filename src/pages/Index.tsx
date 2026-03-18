import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />
      
      {/* REPLACE WITH REAL CATEGORIES: adjust category slugs to match your products table */}
      <ProductCarousel category="cerveau" titleKey="section.cerveau" />
      <ProductCarousel category="stress" titleKey="section.stress" />
      <ProductCarousel category="muscles" titleKey="section.muscles" />
      <ProductCarousel category="beaute" titleKey="section.beaute" />
      <ProductCarousel category="immunite" titleKey="section.immunite" />
      
      <TrustBadges />
      <Testimonials />
    </div>
  );
};

export default Index;
