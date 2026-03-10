import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Compte créé ! Vous êtes connecté.");
        navigate("/admin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Connexion réussie");
        navigate("/admin");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-primary-foreground" />
          </div>
          <h1 className="font-heading text-2xl font-bold">ADMINISTRATION</h1>
          <p className="text-sm text-muted-foreground mt-1">Ultra Nutrition — Panneau Admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@ultranutrition.dz" className="w-full h-12 rounded-md bg-card border border-border px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required maxLength={100} />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mot de passe</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-12 rounded-md bg-card border border-border px-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required minLength={6} maxLength={50} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button type="submit" disabled={loading} className="w-full h-12 gradient-primary text-primary-foreground font-heading text-base">
            {loading ? "Chargement..." : isSignup ? "Créer un compte" : "Se connecter"}
          </Button>
        </form>

        <button onClick={() => setIsSignup(!isSignup)} className="w-full text-center text-xs text-muted-foreground mt-4 hover:text-primary transition-colors">
          {isSignup ? "Déjà un compte ? Se connecter" : "Première utilisation ? Créer un compte"}
        </button>
      </motion.div>
    </div>
  );
}
