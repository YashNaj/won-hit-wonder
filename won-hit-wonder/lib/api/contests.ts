import { supabase } from "@/lib/supabase";
import type { ActiveContest } from "@/lib/types";

export const contestKeys = {
  all: ["contests"] as const,
  active: () => ["contests", "active"] as const,
};

export const fetchActiveContest = async (): Promise<ActiveContest | null> => {
  const { data, error } = await supabase.rpc("get_active_contest").single();
  if (error) {
    if (error.code === "PGRST116") return null; // no rows
    throw error;
  }
  return data as ActiveContest;
};
