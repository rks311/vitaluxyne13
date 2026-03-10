import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export default function FlashBanner() {
  const { t } = useLang();
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-y border-primary/20">
      <div className="container py-3 flex items-center justify-center gap-3 text-sm">
        <Zap size={16} className="text-primary animate-pulse" />
        <span className="font-heading font-bold text-primary">{t("flash.title")}</span>
        <span className="text-muted-foreground">{t("flash.ends")}</span>
        <div className="flex items-center gap-1 font-mono font-bold">
          {[pad(timeLeft.hours), pad(timeLeft.minutes), pad(timeLeft.seconds)].map((v, i) => (
            <span key={i} className="flex items-center">
              <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs">{v}</span>
              {i < 2 && <span className="text-primary/50 mx-0.5">:</span>}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
