import { Users, Search, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const clients = [
  { id: "1", name: "Karim B.", phone: "0555 12 34 56", email: "karim.b@gmail.com", wilaya: "Alger", orders: 12, totalSpent: 89500 },
  { id: "2", name: "Sofiane M.", phone: "0661 78 90 12", email: "sofiane.m@gmail.com", wilaya: "Oran", orders: 8, totalSpent: 62000 },
  { id: "3", name: "Yacine D.", phone: "0550 45 67 89", email: "yacine.d@gmail.com", wilaya: "Constantine", orders: 15, totalSpent: 125000 },
  { id: "4", name: "Amine R.", phone: "0770 11 22 33", email: "amine.r@gmail.com", wilaya: "Sétif", orders: 5, totalSpent: 34500 },
  { id: "5", name: "Mohamed A.", phone: "0555 99 88 77", email: "mohamed.a@gmail.com", wilaya: "Annaba", orders: 3, totalSpent: 21000 },
  { id: "6", name: "Rami K.", phone: "0661 44 55 66", email: "rami.k@gmail.com", wilaya: "Blida", orders: 7, totalSpent: 48000 },
];

export default function AdminClients() {
  const [search, setSearch] = useState("");
  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.wilaya.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client..."
          className="w-full h-10 rounded-md bg-card border border-border pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          maxLength={100}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-card border border-border rounded-xl p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                {c.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin size={10} /> {c.wilaya}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground mb-4">
              <p className="flex items-center gap-2"><Phone size={12} /> {c.phone}</p>
              <p className="flex items-center gap-2"><Mail size={12} /> {c.email}</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
              <span className="text-muted-foreground">{c.orders} commandes</span>
              <span className="font-heading font-bold text-primary">{new Intl.NumberFormat("fr-DZ").format(c.totalSpent)} DZD</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
