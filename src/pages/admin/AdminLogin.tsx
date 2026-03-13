import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLang } from "@/context/LanguageContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, lang, setLang } = useLang();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success(t("admin.loginSuccess"));
      navigate("/admin");
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex justify-end mb-4">
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
            <Globe size={14} /> {t("lang.switch")}
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">{t("admin.loginTitle")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("admin.loginSub")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("admin.email")}</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ultranutrition.dz" className="w-full h-12 rounded-md bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={100} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">{t("admin.password")}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 rounded-md bg-card border border-border px-4 pe-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required minLength={6} maxLength={50} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 gradient-primary text-primary-foreground font-heading text-base">
            {loading ? t("admin.loading") : t("admin.login")}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
