import { supabase } from "@/lib/supabase";
import type { Vote } from "@/lib/types";

export const voteKeys = {
  all: ["votes"] as const,
  forContest: (contestId: string, userId: string) =>
    ["votes", contestId, userId] as const,
};

export const castVote = async (
  submissionId: string,
  contestId: string,
  voterId: string,
): Promise<Vote> => {
  const { data, error } = await supabase
    .from("votes")
    .insert({
      submission_id: submissionId,
      contest_id: contestId,
      voter_id: voterId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Vote;
};

export const removeVote = async (
  voterId: string,
  contestId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("voter_id", voterId)
    .eq("contest_id", contestId);

  if (error) throw error;
};

export const fetchUserVoteForContest = async (
  contestId: string,
  voterId: string,
): Promise<Vote | null> => {
  const { data, error } = await supabase
    .from("votes")
    .select("*")
    .eq("voter_id", voterId)
    .eq("contest_id", contestId)
    .maybeSingle();

  if (error) throw error;
  return data as Vote | null;
};
