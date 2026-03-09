import HeroSection from "@/components/home/HeroSection";
import FlashBanner from "@/components/home/FlashBanner";
import CategoryCards from "@/components/home/CategoryCards";
import PopularProducts from "@/components/home/PopularProducts";
import PacksSection from "@/components/home/PacksSection";
import PromoSection from "@/components/home/PromoSection";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FlashBanner />
      <CategoryCards />
      <PopularProducts />
      <PacksSection />
      <PromoSection />
      <TrustBadges />
      <Testimonials />
    </div>
  );
};

export default Index;
