import { useQuery } from "@tanstack/react-query";

import {
  fetchProfileQAs,
  fetchUser,
  fetchUserStats,
  userKeys,
} from "@/lib/api/users";
import { fetchUserSubmissions, submissionKeys } from "@/lib/api/submissions";

export const useProfile = (userId: string) => {
  const user = useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => fetchUser(userId),
    enabled: !!userId,
  });

  const stats = useQuery({
    queryKey: userKeys.stats(userId),
    queryFn: () => fetchUserStats(userId),
    enabled: !!userId,
  });

  const qas = useQuery({
    queryKey: userKeys.qas(userId),
    queryFn: () => fetchProfileQAs(userId),
    enabled: !!userId,
  });

  const submissions = useQuery({
    queryKey: submissionKeys.byUser(userId),
    queryFn: () => fetchUserSubmissions(userId),
    enabled: !!userId,
  });

  return {
    user: user.data,
    stats: stats.data,
    qas: qas.data ?? [],
    submissions: submissions.data ?? [],
    isLoading: user.isLoading || stats.isLoading,
  };
};
