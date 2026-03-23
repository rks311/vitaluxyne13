import { lazy, Suspense } from "react";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/home/CategoryGrid";
import { TrendingUp, Flame, Sparkles, Brain, Moon, Dumbbell, Shield } from "lucide-react";

const FeaturedSection = lazy(() => import("@/components/home/FeaturedSection"));
const TrustBadges = lazy(() => import("@/components/home/TrustBadges"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));

// Reserve space for lazy sections to prevent CLS
const SectionPlaceholder = ({ height = "500px" }: { height?: string }) => (
  <div style={{ minHeight: height }} aria-hidden="true" />
);

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategoryGrid />

      <Suspense fallback={<SectionPlaceholder />}>
        <FeaturedSection type="top" title="Les plus demandés" subtitle="Nos best-sellers plébiscités par nos clients" icon={<TrendingUp size={18} />} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="promo" title="Offres & Promotions" subtitle="Profitez de nos réductions" icon={<Flame size={18} />} />
        </div>
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="400px" />}>
        <FeaturedSection type="category" category="immunite" title="Immunité & Vitalité" icon={<Shield size={18} />} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="400px" />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="category" category="muscles" title="Performance Musculaire" icon={<Dumbbell size={18} />} />
        </div>
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="400px" />}>
        <FeaturedSection type="category" category="cerveau" title="Cerveau & Focus" icon={<Brain size={18} />} />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="400px" />}>
        <div className="bg-secondary/20">
          <FeaturedSection type="new" title="Nouveautés" subtitle="Derniers produits ajoutés" icon={<Sparkles size={18} />} limit={4} />
        </div>
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="150px" />}>
        <TrustBadges />
      </Suspense>

      <Suspense fallback={<SectionPlaceholder height="250px" />}>
        <Testimonials />
      </Suspense>
    </div>
  );
};

export default Index;
