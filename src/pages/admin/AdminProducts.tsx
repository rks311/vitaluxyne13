import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, getStorageUrl, type DbProduct } from "@/types/database";
import { Package, Plus, Search, Edit, Trash2, X, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const defaultProduct = {
  name: "", brand: "", category: "immunite", price: 0, old_price: null as number | null,
  cost_price: 0, description: "", flavors: [] as string[], weights: [] as string[],
  objectives: [] as string[], in_stock: true, is_top_sale: false, is_promo: false,
  image_url: null as string | null, stock_qty: 0,
};

const categoryOptions = [
  { value: "beaute", label: "Beauté" },
  { value: "cerveau", label: "Cerveau & Concentration" },
  { value: "stress", label: "Stress & Sommeil" },
  { value: "muscles", label: "Muscles" },
  { value: "os", label: "Os & Articulations" },
  { value: "coeur", label: "Cœur" },
  { value: "immunite", label: "Immunité" },
  { value: "hormones", label: "Hormones" },
  { value: "perte-de-poids", label: "Perte de poids" },
];

export default function AdminProducts() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<DbProduct | null>(null);
  const [form, setForm] = useState(defaultProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flavorsInput, setFlavorsInput] = useState("");
  const [weightsInput, setWeightsInput] = useState("");
  const [objectivesInput, setObjectivesInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const loadProducts = async () => {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  };

  useEffect(() => { loadProducts(); }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => {
    setEditing(null);
    setForm(defaultProduct);
    setFlavorsInput(""); setWeightsInput(""); setObjectivesInput("");
    setShowForm(true);
  };

  const openEdit = (p: DbProduct) => {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand, category: p.category, price: p.price,
      old_price: p.old_price, cost_price: (p as any).cost_price ?? 0,
      description: p.description || "", flavors: p.flavors || [], weights: p.weights || [],
      objectives: p.objectives || [], in_stock: p.in_stock ?? true,
      is_top_sale: p.is_top_sale ?? false, is_promo: p.is_promo ?? false,
      image_url: p.image_url, stock_qty: (p as any).stock_qty ?? 0,
    });
    setFlavorsInput((p.flavors || []).join(", "));
    setWeightsInput((p.weights || []).join(", "));
    setObjectivesInput((p.objectives || []).join(", "));
    setShowForm(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const path = `products/${Date.now()}.${file.name.split(".").pop()}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { contentType: file.type, upsert: true });
      if (error) throw error;
      setForm((f) => ({ ...f, image_url: path }));
      toast.success("Image uploadée !");
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price) { toast.error("Remplissez les champs requis"); return; }
    setSaving(true);
    const data: any = {
      name: form.name, brand: form.brand, category: form.category, price: form.price,
      old_price: form.old_price || null, cost_price: form.cost_price || 0,
      description: form.description || null,
      flavors: flavorsInput.split(",").map(s => s.trim()).filter(Boolean),
      weights: weightsInput.split(",").map(s => s.trim()).filter(Boolean),
      objectives: objectivesInput.split(",").map(s => s.trim()).filter(Boolean),
      in_stock: form.in_stock, is_top_sale: form.is_top_sale, is_promo: form.is_promo,
      image_url: form.image_url, stock_qty: form.stock_qty,
    };

    if (editing) {
      const { error } = await supabase.from("products").update(data).eq("id", editing.id);
      if (error) { toast.error("Erreur"); setSaving(false); return; }
      toast.success("Produit modifié !");
    } else {
      const { error } = await supabase.from("products").insert(data);
      if (error) { toast.error("Erreur"); setSaving(false); return; }
      toast.success("Produit ajouté !");
    }
    setSaving(false);
    setShowForm(false);
    loadProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce produit ?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { toast.error("Erreur"); return; }
    toast.success("Produit supprimé");
    loadProducts();
  };

  const profit = form.price - (form.cost_price || 0);
  const margin = form.price > 0 ? Math.round((profit / form.price) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit..." className="w-full h-10 rounded-md bg-card border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary" maxLength={100} />
        </div>
        <button onClick={openAdd} className="h-10 px-4 rounded-md gradient-primary text-primary-foreground text-sm font-medium flex items-center gap-2">
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold text-lg">{editing ? "Modifier" : "Ajouter"} un produit</h3>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Image du produit</label>
                <div className="flex items-center gap-3 flex-wrap">
                  {form.image_url && (
                    <div className="w-24 h-24 rounded-xl overflow-hidden border border-border bg-secondary/30">
                      <img src={getStorageUrl(form.image_url)} alt="" className="w-full h-full object-contain p-1" />
                    </div>
                  )}
                  <button onClick={() => fileRef.current?.click()} disabled={uploading} className="h-9 px-3 rounded-md bg-secondary text-sm flex items-center gap-2 hover:bg-muted transition-colors">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    {uploading ? "Upload..." : "📸 Choisir image"}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground mb-1 block">Nom *</label><input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" maxLength={100} /></div>
                <div><label className="text-xs text-muted-foreground mb-1 block">Marque *</label><input value={form.brand} onChange={(e) => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" maxLength={100} /></div>
              </div>

              <div><label className="text-xs text-muted-foreground mb-1 block">Catégorie</label>
                <select value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm">
                  {categoryOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>

              {/* Pricing section with profit preview */}
              <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
                <p className="text-xs font-heading font-bold text-foreground">💰 Tarification</p>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Prix d'achat</label>
                    <input type="number" value={form.cost_price || ""} onChange={(e) => setForm(f => ({ ...f, cost_price: +e.target.value }))} placeholder="0" className="w-full h-10 rounded-md bg-card border border-border px-3 text-sm" min={0} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Prix de vente *</label>
                    <input type="number" value={form.price || ""} onChange={(e) => setForm(f => ({ ...f, price: +e.target.value }))} className="w-full h-10 rounded-md bg-card border border-border px-3 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Ancien prix</label>
                    <input type="number" value={form.old_price || ""} onChange={(e) => setForm(f => ({ ...f, old_price: e.target.value ? +e.target.value : null }))} placeholder="Facultatif" className="w-full h-10 rounded-md bg-card border border-border px-3 text-sm" />
                  </div>
                </div>
                {/* Live profit preview */}
                <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Bénéfice unitaire:</span>
                    <span className={`text-sm font-heading font-bold ${profit > 0 ? 'text-emerald-500' : 'text-red-400'}`}>
                      {formatPrice(profit)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Marge:</span>
                    <span className={`text-sm font-heading font-bold ${margin > 20 ? 'text-emerald-500' : margin > 0 ? 'text-amber-500' : 'text-red-400'}`}>
                      {margin}%
                    </span>
                  </div>
                </div>
              </div>

              <div><label className="text-xs text-muted-foreground mb-1 block">Description</label><textarea value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full rounded-md bg-secondary border border-border px-3 py-2 text-sm resize-none" maxLength={500} /></div>

              <div><label className="text-xs text-muted-foreground mb-1 block">Goûts (séparés par virgule)</label><input value={flavorsInput} onChange={(e) => setFlavorsInput(e.target.value)} placeholder="Chocolat, Vanille, Fraise" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Poids (séparés par virgule)</label><input value={weightsInput} onChange={(e) => setWeightsInput(e.target.value)} placeholder="1kg, 2.5kg" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Objectifs (séparés par virgule)</label><input value={objectivesInput} onChange={(e) => setObjectivesInput(e.target.value)} placeholder="Immunité, Énergie" className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" /></div>
              <div><label className="text-xs text-muted-foreground mb-1 block">Quantité en stock</label><input type="number" value={form.stock_qty} onChange={(e) => setForm(f => ({ ...f, stock_qty: +e.target.value }))} className="w-full h-10 rounded-md bg-secondary border border-border px-3 text-sm" min={0} /></div>

              <div className="flex flex-wrap gap-4 py-2">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.in_stock} onChange={(e) => setForm(f => ({ ...f, in_stock: e.target.checked }))} className="accent-primary" /> En stock</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_top_sale} onChange={(e) => setForm(f => ({ ...f, is_top_sale: e.target.checked }))} className="accent-primary" /> Top vente</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_promo} onChange={(e) => setForm(f => ({ ...f, is_promo: e.target.checked }))} className="accent-primary" /> Promo</label>
              </div>

              <button onClick={handleSave} disabled={saving} className="w-full h-11 rounded-md gradient-primary text-primary-foreground font-heading font-bold">
                {saving ? "Enregistrement..." : editing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left px-4 py-3 font-medium">Produit</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Marque</th>
                <th className="text-left px-3 py-3 font-medium">Prix</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Bénéfice</th>
                <th className="text-left px-3 py-3 font-medium hidden md:table-cell">Stock</th>
                <th className="text-left px-3 py-3 font-medium hidden lg:table-cell">Catégorie</th>
                <th className="text-right px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const costPrice = (p as any).cost_price || 0;
                const unitProfit = p.price - costPrice;
                const unitMargin = p.price > 0 ? Math.round((unitProfit / p.price) * 100) : 0;
                return (
                  <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden border border-border shrink-0 bg-secondary/30">
                          <img src={getStorageUrl(p.image_url)} alt="" className="w-full h-full object-contain p-0.5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{p.name}</p>
                          <p className="text-[10px] text-muted-foreground md:hidden">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground hidden md:table-cell">{p.brand}</td>
                    <td className="px-3 py-3">
                      <span className="font-heading font-bold text-primary">{formatPrice(p.price)}</span>
                      {p.old_price && <span className="text-[10px] text-muted-foreground line-through ms-1">{formatPrice(p.old_price)}</span>}
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <div>
                        <span className={`text-xs font-bold ${unitProfit > 0 ? 'text-emerald-500' : 'text-red-400'}`}>{formatPrice(unitProfit)}</span>
                        <span className="text-[10px] text-muted-foreground ms-1">({unitMargin}%)</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${p.in_stock ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                          {p.in_stock ? "En stock" : "Rupture"}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">{(p as any).stock_qty ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs hidden lg:table-cell capitalize">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-primary transition-colors"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Aucun produit</td></tr>}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
