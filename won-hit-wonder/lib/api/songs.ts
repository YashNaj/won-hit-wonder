import { supabase } from "@/lib/supabase";
import type { Song } from "@/lib/types";

export const songKeys = {
  all: ["songs"] as const,
};

export const fetchSongs = async (): Promise<Song[]> => {
  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("is_active", true)
    .order("title");

  if (error) throw error;
  return data as Song[];
};
