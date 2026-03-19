import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import FeaturedSection from "@/components/home/FeaturedSection";
import TrustBadges from "@/components/home/TrustBadges";
import Testimonials from "@/components/home/Testimonials";
import { TrendingUp, Flame, Sparkles, Brain, Moon, Dumbbell, Heart, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      {/* Les plus demandés */}
      <FeaturedSection
        type="top"
        title="Les plus demandés"
        subtitle="Nos best-sellers plébiscités par nos clients"
        icon={<TrendingUp size={20} />}
      />

      {/* En promo */}
      <div className="bg-secondary/30">
        <FeaturedSection
          type="promo"
          title="Offres & Promotions"
          subtitle="Profitez de nos réductions en cours"
          icon={<Flame size={20} />}
        />
      </div>

      {/* Sections par catégorie */}
      <FeaturedSection
        type="category"
        category="cerveau"
        title="Cerveau & Concentration"
        subtitle="Boostez votre focus et mémoire"
        icon={<Brain size={20} />}
      />

      <div className="bg-secondary/20">
        <FeaturedSection
          type="category"
          category="stress"
          title="Stress & Sommeil"
          subtitle="Retrouvez calme et sérénité"
          icon={<Moon size={20} />}
        />
      </div>

      <FeaturedSection
        type="category"
        category="muscles"
        title="Performance Musculaire"
        subtitle="Force, endurance et récupération"
        icon={<Dumbbell size={20} />}
      />

      <div className="bg-secondary/20">
        <FeaturedSection
          type="category"
          category="beaute"
          title="Beauté & Anti-âge"
          subtitle="Peau, cheveux et ongles sublimés"
          icon={<Sparkles size={20} />}
        />
      </div>

      <FeaturedSection
        type="category"
        category="immunite"
        title="Immunité & Vitalité"
        subtitle="Renforcez vos défenses naturelles"
        icon={<Shield size={20} />}
      />

      {/* Nouveautés */}
      <div className="bg-secondary/30">
        <FeaturedSection
          type="new"
          title="Nouveautés"
          subtitle="Nos derniers produits ajoutés"
          icon={<Sparkles size={20} />}
          limit={4}
        />
      </div>

      <TrustBadges />
      <Testimonials />
    </div>
  );
};

export default Index;
