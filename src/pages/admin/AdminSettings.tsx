import { Store, Globe, Save, Lock, Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Auth fields
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [currentPasswordForPwd, setCurrentPasswordForPwd] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [authSaving, setAuthSaving] = useState(false);

  // Confirmation dialogs
  const [showEmailConfirm, setShowEmailConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings" as any).select("key, value");
      const s: Record<string, string> = {};
      (data as any[])?.forEach((r: any) => { s[r.key] = r.value; });
      setSettings(s);
      setLoading(false);

      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setCurrentEmail(user.email);
        setNewEmail(user.email);
      }
    })();
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from("site_settings" as any).upsert({ key, value, updated_at: new Date().toISOString() } as any, { onConflict: "key" });
      }
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
      toast.success("Paramètres sauvegardés !");
    } catch {
      toast.error("Erreur lors de la sauvegarde");
    }
    setSaving(false);
  };

  const validateEmailChange = () => {
    if (!newEmail.trim()) { toast.error("Entrez le nouvel email"); return false; }
    if (newEmail === currentEmail) { toast.error("Le nouvel email est identique à l'actuel"); return false; }
    if (!currentPasswordForEmail.trim()) { toast.error("Entrez votre mot de passe actuel pour confirmer"); return false; }
    return true;
  };

  const handleEmailChange = async () => {
    setShowEmailConfirm(false);
    setAuthSaving(true);
    try {
      // Re-authenticate with current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPasswordForEmail,
      });
      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        setAuthSaving(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setCurrentPasswordForEmail("");
      toast.success("Un email de confirmation a été envoyé à la nouvelle adresse. Vérifiez votre boîte de réception.");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du changement d'email");
    }
    setAuthSaving(false);
  };

  const validatePasswordChange = () => {
    if (!currentPasswordForPwd.trim()) { toast.error("Entrez votre mot de passe actuel"); return false; }
    if (!newPassword || !confirmPassword) { toast.error("Remplissez tous les champs"); return false; }
    if (newPassword.length < 6) { toast.error("Le nouveau mot de passe doit contenir au moins 6 caractères"); return false; }
    if (newPassword !== confirmPassword) { toast.error("Les mots de passe ne correspondent pas"); return false; }
    return true;
  };

  const handlePasswordChange = async () => {
    setShowPasswordConfirm(false);
    setAuthSaving(true);
    try {
      // Re-authenticate with current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPasswordForPwd,
      });
      if (signInError) {
        toast.error("Mot de passe actuel incorrect");
        setAuthSaving(false);
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setCurrentPasswordForPwd("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Mot de passe modifié avec succès !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors du changement de mot de passe");
    }
    setAuthSaving(false);
  };

  if (loading) return <div className="flex items-center justify-center h-40"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;

  const Field = ({ label, settingKey, type = "text", maxLength = 100 }: { label: string; settingKey: string; type?: string; maxLength?: number }) => (
    <div>
      <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
      <input
        type={type}
        value={settings[settingKey] || ""}
        onChange={e => updateSetting(settingKey, e.target.value)}
        className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
        maxLength={maxLength}
      />
    </div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Store Info */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Store size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Informations boutique</h3>
        </div>
        <div className="space-y-3">
          <Field label="Nom de la boutique" settingKey="store_name" />
          <Field label="Email de contact" settingKey="email" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Téléphone" settingKey="phone" maxLength={20} />
            <Field label="Messenger" settingKey="whatsapp" maxLength={20} />
          </div>
          <Field label="Adresse" settingKey="address" maxLength={200} />
        </div>
      </div>


      {/* Social */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Globe size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Réseaux sociaux</h3>
        </div>
        <div className="space-y-3">
          <Field label="Instagram" settingKey="instagram" />
          <Field label="Facebook" settingKey="facebook" maxLength={200} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving} className="gradient-primary text-primary-foreground font-heading h-11 px-6">
        <Save size={16} className="mr-2" /> {saving ? "Sauvegarde..." : "Sauvegarder les paramètres"}
      </Button>

      {/* Email Change */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Mail size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Changer l'email admin</h3>
        </div>
        <p className="text-xs text-muted-foreground">Un email de confirmation sera envoyé à la nouvelle adresse. Vous devez entrer votre mot de passe actuel pour confirmer.</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Email actuel</label>
            <input
              type="email"
              value={currentEmail}
              disabled
              className="w-full h-10 rounded-md bg-muted border border-border px-3 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nouvel email</label>
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mot de passe actuel (confirmation)</label>
            <input
              type="password"
              value={currentPasswordForEmail}
              onChange={e => setCurrentPasswordForEmail(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <Button
          onClick={() => { if (validateEmailChange()) setShowEmailConfirm(true); }}
          disabled={authSaving}
          variant="outline"
          className="font-heading"
        >
          <Mail size={14} className="mr-2" /> Changer l'email
        </Button>
      </div>

      {/* Password Change */}
      <div className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Lock size={18} className="text-primary" />
          <h3 className="font-heading font-bold text-base">Changer le mot de passe</h3>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPasswordForPwd}
              onChange={e => setCurrentPasswordForPwd(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              minLength={6}
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              minLength={6}
            />
          </div>
        </div>
        <Button
          onClick={() => { if (validatePasswordChange()) setShowPasswordConfirm(true); }}
          disabled={authSaving}
          variant="outline"
          className="font-heading"
        >
          <Lock size={14} className="mr-2" /> Changer le mot de passe
        </Button>
      </div>

      {/* Email Change Confirmation Dialog */}
      <AlertDialog open={showEmailConfirm} onOpenChange={setShowEmailConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              Confirmer le changement d'email
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer votre email de connexion de <strong className="text-foreground">{currentEmail}</strong> à <strong className="text-foreground">{newEmail}</strong> ?
              <br /><br />
              Un email de confirmation sera envoyé à la nouvelle adresse. Vous devrez cliquer sur le lien pour valider le changement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleEmailChange} disabled={authSaving}>
              Confirmer le changement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Password Change Confirmation Dialog */}
      <AlertDialog open={showPasswordConfirm} onOpenChange={setShowPasswordConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-500" />
              Confirmer le changement de mot de passe
            </AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer votre mot de passe ? Vous serez toujours connecté après le changement.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasswordChange} disabled={authSaving}>
              Confirmer le changement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
