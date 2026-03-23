import { lazy, Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import { TrendingUp, Flame, Sparkles, Brain, Moon, Dumbbell, Shield } from "lucide-react";

const FeaturedSection = lazy(() => import("@/components/home/FeaturedSection"));
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));

const Loader = () => <div className="py-8" />;

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      <Suspense fallback={<Loader />}>
        <FeaturedSection type="top" title="Les plus demandés" subtitle="Nos best-sellers plébiscités par nos clients" icon={<TrendingUp size={18} />} />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="promo" title="Offres & Promotions" subtitle="Profitez de nos réductions" icon={<Flame size={18} />} />
        </div>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <FeaturedSection type="category" category="immunite" title="Immunité & Vitalité" icon={<Shield size={18} />} />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="category" category="muscles" title="Performance Musculaire" icon={<Dumbbell size={18} />} />
        </div>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <FeaturedSection type="category" category="cerveau" title="Cerveau & Focus" icon={<Brain size={18} />} />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="new" title="Nouveautés" subtitle="Derniers produits ajoutés" icon={<Sparkles size={18} />} limit={4} />
        </div>
      </Suspense>

      <Suspense fallback={<Loader />}>
        <TrustBadges />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <Testimonials />
      </Suspense>
    </div>
  );
};

export default Index;
