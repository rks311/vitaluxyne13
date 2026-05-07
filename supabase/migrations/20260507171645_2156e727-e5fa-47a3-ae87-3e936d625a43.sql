
-- 1. Roles enum & table
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 2. Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. RLS on user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all roles" ON public.user_roles
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Seed admin
INSERT INTO public.user_roles (user_id, role)
VALUES ('acabccf7-116f-465d-96c8-e1b8befdfff0', 'admin')
ON CONFLICT DO NOTHING;

-- 5. Tighten RLS — orders
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Orders viewable by admins" ON public.orders;
CREATE POLICY "Orders viewable by admins" ON public.orders
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. order_items
DROP POLICY IF EXISTS "Order items viewable by admins" ON public.order_items;
CREATE POLICY "Order items viewable by admins" ON public.order_items
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. clients
DROP POLICY IF EXISTS "Admins can update clients" ON public.clients;
DROP POLICY IF EXISTS "Clients viewable by admins" ON public.clients;
CREATE POLICY "Clients viewable by admins" ON public.clients
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update clients" ON public.clients
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete clients" ON public.clients
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 8. products
DROP POLICY IF EXISTS "Only admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Only admins can update products" ON public.products;
DROP POLICY IF EXISTS "Only admins can delete products" ON public.products;
CREATE POLICY "Only admins can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update products" ON public.products
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete products" ON public.products
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 9. packs
DROP POLICY IF EXISTS "Only admins can insert packs" ON public.packs;
DROP POLICY IF EXISTS "Only admins can update packs" ON public.packs;
DROP POLICY IF EXISTS "Only admins can delete packs" ON public.packs;
CREATE POLICY "Only admins can insert packs" ON public.packs
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update packs" ON public.packs
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete packs" ON public.packs
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 10. pack_items
DROP POLICY IF EXISTS "Only admins can manage pack items" ON public.pack_items;
CREATE POLICY "Only admins can manage pack items" ON public.pack_items
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 11. promos
DROP POLICY IF EXISTS "Only admins can manage promos" ON public.promos;
CREATE POLICY "Only admins can manage promos" ON public.promos
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 12. delivery_zones
DROP POLICY IF EXISTS "Only admins can insert delivery zones" ON public.delivery_zones;
DROP POLICY IF EXISTS "Only admins can update delivery zones" ON public.delivery_zones;
DROP POLICY IF EXISTS "Only admins can delete delivery zones" ON public.delivery_zones;
CREATE POLICY "Only admins can insert delivery zones" ON public.delivery_zones
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update delivery zones" ON public.delivery_zones
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete delivery zones" ON public.delivery_zones
  FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 13. site_settings
DROP POLICY IF EXISTS "Only admins can insert settings" ON public.site_settings;
DROP POLICY IF EXISTS "Only admins can update settings" ON public.site_settings;
CREATE POLICY "Only admins can insert settings" ON public.site_settings
  FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update settings" ON public.site_settings
  FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
