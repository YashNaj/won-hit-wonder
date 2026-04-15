import { useCallback, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { checkIsFollowing, followUser, unfollowUser } from "@/lib/api/follows";
import { userKeys } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth.store";

export const useFollow = (targetUserId: string) => {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((s) => s.user);
  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkFollow = useCallback(async () => {
    if (!currentUser) return;
    const result = await checkIsFollowing(currentUser.id, targetUserId);
    setIsFollowing(result);
  }, [currentUser, targetUserId]);

  const toggle = useCallback(async () => {
    if (!currentUser || isLoading) return;
    setIsLoading(true);

    if (isFollowing) {
      setIsFollowing(false);
      await unfollowUser(currentUser.id, targetUserId);
    } else {
      setIsFollowing(true);
      await followUser(currentUser.id, targetUserId);
    }

    queryClient.invalidateQueries({ queryKey: userKeys.stats(targetUserId) });
    setIsLoading(false);
  }, [currentUser, targetUserId, isFollowing, isLoading, queryClient]);

  return { isFollowing, checkFollow, toggle, isLoading };
};
