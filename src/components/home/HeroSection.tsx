import { ArrowDown, MessageCircle, Star } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import heroBg from "@/assets/hero-lifestyle.webp";

export default function HeroSection() {
  const { t } = useLang();

  const scrollToCategories = () => {
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden min-h-[280px] md:min-h-[420px]" aria-label="Bannière principale">
      {/* Full image background */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          role="presentation"
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          width={1920}
          height={1080}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
      </div>

      <div className="container relative z-10 pt-12 pb-10 md:pt-24 md:pb-20 flex flex-col items-center text-center">
        <h1
          className="font-heading text-2xl md:text-5xl font-extrabold text-white leading-[1.15] mb-3 md:mb-4 max-w-lg md:max-w-2xl"
        >
          Votre santé,{" "}
          <span className="text-accent">notre priorité</span>
        </h1>

        <p
          className="text-white/70 text-sm md:text-base mb-6 max-w-sm"
        >
          Compléments alimentaires premium livrés partout en Algérie
        </p>

        <div
          className="flex gap-2.5 w-full max-w-xs md:max-w-sm"
        >
          <button
            onClick={scrollToCategories}
            className="flex-1 h-11 font-heading text-sm font-semibold gradient-primary text-primary-foreground rounded-full shadow-lg shadow-primary/30 flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform"
          >
            Découvrir
            <ArrowDown size={14} aria-hidden="true" />
          </button>
          <a
            href="https://www.facebook.com/share/1BH8Aohcnu/"
            target="_blank"
            rel="noopener noreferrer"
            className="h-11 px-5 font-heading text-sm font-semibold rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center gap-1.5 active:scale-[0.97] transition-all"
            aria-label="Contacter sur Messenger"
          >
            <MessageCircle size={14} aria-hidden="true" />
            Messenger
          </a>
        </div>

        <div
          className="flex items-center gap-2 mt-5"
          aria-label="Note moyenne 5 étoiles, plus de 500 clients satisfaits"
        >
          <div className="flex gap-0.5" aria-hidden="true">
            {[1,2,3,4,5].map(i => <Star key={i} size={10} className="fill-accent text-accent" />)}
          </div>
          <span className="text-[11px] text-white/60">+500 clients satisfaits</span>
        </div>
      </div>
    </section>
  );
}
