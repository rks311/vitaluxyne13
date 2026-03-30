import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import TrustBadges from "@/components/home/TrustBadges";
import FeaturedSection from "@/components/home/FeaturedSection";
import { TrendingUp, Flame, Sparkles, Brain, Dumbbell, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      <FeaturedSection type="top" title="Les plus demandés" subtitle="Nos best-sellers plébiscités par nos clients" icon={<TrendingUp size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="promo" title="Offres & Promotions" subtitle="Profitez de nos réductions" icon={<Flame size={18} />} />
      </div>

      <FeaturedSection type="category" category="immunite" title="Immunité & Vitalité" icon={<Shield size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="category" category="muscles" title="Performance Musculaire" icon={<Dumbbell size={18} />} />
      </div>

      <FeaturedSection type="category" category="cerveau" title="Cerveau & Focus" icon={<Brain size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="new" title="Nouveautés" subtitle="Derniers produits ajoutés" icon={<Sparkles size={18} />} limit={4} />
      </div>

      <TrustBadges />
    </div>
  );
};

export default Index;
