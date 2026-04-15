import { supabase } from "@/lib/supabase";

export const followKeys = {
  all: ["follows"] as const,
  isFollowing: (followerId: string, followingId: string) =>
    ["follows", followerId, followingId] as const,
};

export const followUser = async (
  followerId: string,
  followingId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });

  if (error) throw error;
};

export const unfollowUser = async (
  followerId: string,
  followingId: string,
): Promise<void> => {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) throw error;
};

export const checkIsFollowing = async (
  followerId: string,
  followingId: string,
): Promise<boolean> => {
  const { count, error } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) throw error;
  return (count ?? 0) > 0;
};
