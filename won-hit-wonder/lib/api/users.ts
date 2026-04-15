import { supabase } from "@/lib/supabase";
import type { ProfileQA, User, UserStats } from "@/lib/types";

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => ["users", id] as const,
  stats: (id: string) => ["users", "stats", id] as const,
  qas: (id: string) => ["users", "qas", id] as const,
};

export const fetchUser = async (id: string): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as User;
};

export const fetchUserStats = async (id: string): Promise<UserStats> => {
  const { data, error } = await supabase
    .from("user_stats")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as UserStats;
};

export const fetchProfileQAs = async (id: string): Promise<ProfileQA[]> => {
  const { data, error } = await supabase
    .from("profile_qas")
    .select("*")
    .eq("user_id", id)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as ProfileQA[];
};
