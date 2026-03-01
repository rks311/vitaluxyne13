import HeroSection from "@/components/home/HeroSection";
import CategoryCards from "@/components/home/CategoryCards";
import PopularProducts from "@/components/home/PopularProducts";
import PromoSection from "@/components/home/PromoSection";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryCards />
      <PopularProducts />
      <PromoSection />
      <TrustBadges />
      <Testimonials />
    </div>
  );
};

export default Index;
