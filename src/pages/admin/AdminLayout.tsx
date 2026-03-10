import { useState, useEffect } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Users, Tags, Boxes, Settings, LogOut, ChevronLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Commandes", icon: ShoppingCart, path: "/admin/orders" },
  { label: "Produits", icon: Package, path: "/admin/products" },
  { label: "Packs", icon: Boxes, path: "/admin/packs" },
  { label: "Clients", icon: Users, path: "/admin/clients" },
  { label: "Promotions", icon: Tags, path: "/admin/promos" },
  { label: "Paramètres", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate("/admin/login");
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/admin/login");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background flex">
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}

      <aside className={cn("fixed md:sticky top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300", collapsed ? "w-[68px]" : "w-64", mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0")}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border shrink-0">
          {!collapsed && <span className="font-heading text-lg font-bold">ULTRA<span className="text-primary">ADMIN</span></span>}
          <button onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
            <ChevronLeft size={18} className={cn("transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }} className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors", active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-2 border-t border-border shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center gap-3 px-4 md:px-6 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
            <Menu size={20} />
          </button>
          <h1 className="font-heading text-lg font-bold">{navItems.find((n) => n.path === location.pathname)?.label || "Admin"}</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
