import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DeliveryZone {
  id: string;
  code: string;
  name: string;
  has_world_express: boolean;
  has_swift_express: boolean;
  swift_bureau_price: number;
  swift_domicile_price: number;
  world_bureau_price: number;
  world_domicile_price: number;
  remote_price: number;
}

export interface DeliveryOption {
  id: string;
  label: string;
  company: string;
  type: "bureau" | "domicile";
  price: number;
}

export function useDeliveryZones() {
  return useQuery({
    queryKey: ["delivery_zones"],
    queryFn: async (): Promise<DeliveryZone[]> => {
      const { data, error } = await supabase
        .from("delivery_zones" as any)
        .select("*")
        .order("code");
      if (error) throw error;
      return (data as any[]) || [];
    },
    staleTime: 10 * 60_000,
  });
}

export function getDeliveryOptionsFromZone(zone: DeliveryZone): DeliveryOption[] {
  const options: DeliveryOption[] = [];

  if (zone.has_swift_express) {
    options.push(
      { id: "swift_bureau", label: "Bureau Swift Express", company: "Swift Express", type: "bureau", price: zone.swift_bureau_price },
      { id: "swift_domicile", label: "Domicile Swift Express", company: "Swift Express", type: "domicile", price: zone.swift_domicile_price },
    );
  }

  if (zone.has_world_express) {
    options.push(
      { id: "world_bureau", label: "Bureau World Express", company: "World Express", type: "bureau", price: zone.world_bureau_price },
      { id: "world_domicile", label: "Domicile World Express", company: "World Express", type: "domicile", price: zone.world_domicile_price },
    );
  }

  if (!zone.has_world_express && !zone.has_swift_express) {
    options.push(
      { id: "world_domicile_remote", label: "Domicile World Express (zone éloignée)", company: "World Express", type: "domicile", price: zone.remote_price },
    );
  }

  return options;
}
