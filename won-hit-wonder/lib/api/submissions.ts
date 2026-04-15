import { supabase } from "@/lib/supabase";
import type { FeedSubmission, Submission } from "@/lib/types";

export const submissionKeys = {
  all: ["submissions"] as const,
  feed: (contestId: string) => ["submissions", "feed", contestId] as const,
  byUser: (userId: string) => ["submissions", "user", userId] as const,
  detail: (id: string) => ["submissions", id] as const,
};

export const fetchFeedSubmissions = async (
  contestId: string,
): Promise<FeedSubmission[]> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, user:users(*), song:songs(*)")
    .eq("contest_id", contestId)
    .eq("status", "published")
    .order("vote_count", { ascending: false });

  if (error) throw error;
  return data as FeedSubmission[];
};

export const fetchUserSubmissions = async (
  userId: string,
): Promise<(Submission & { song: { title: string; artist: string } })[]> => {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, song:songs(title, artist)")
    .eq("user_id", userId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as (Submission & { song: { title: string; artist: string } })[];
};
