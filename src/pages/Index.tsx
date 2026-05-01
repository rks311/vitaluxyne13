import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import TrustBadges from "@/components/home/TrustBadges";
import FeaturedSection from "@/components/home/FeaturedSection";
import { useLang } from "@/context/LanguageContext";
import { TrendingUp, Flame, Sparkles, Brain, Dumbbell, Shield, Moon, Heart, Zap } from "lucide-react";

const Index = () => {
  const { t } = useLang();
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      <FeaturedSection type="top" title={t("home.topTitle")} subtitle={t("home.topSub")} icon={<TrendingUp size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="promo" title={t("home.promoTitle")} subtitle={t("home.promoSub")} icon={<Flame size={18} />} />
      </div>

      <FeaturedSection type="category" category="immunite" title={t("home.immunite")} icon={<Shield size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="category" category="stress" title={t("home.stress")} icon={<Moon size={18} />} />
      </div>

      <FeaturedSection type="category" category="energie" title={t("home.energie")} icon={<Zap size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="category" category="beaute" title={t("home.beaute")} icon={<Heart size={18} />} />
      </div>

      <FeaturedSection type="category" category="cerveau" title={t("home.cerveau")} icon={<Brain size={18} />} />

      <div className="bg-secondary/20">
        <FeaturedSection type="new" title={t("home.newTitle")} subtitle={t("home.newSub")} icon={<Sparkles size={18} />} limit={4} />
      </div>

      <TrustBadges />
    </div>
  );
};

export default Index;
