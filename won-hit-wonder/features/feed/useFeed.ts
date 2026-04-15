import { useQuery } from "@tanstack/react-query";

import { contestKeys, fetchActiveContest } from "@/lib/api/contests";
import { fetchFeedSubmissions, submissionKeys } from "@/lib/api/submissions";

export const useFeed = () => {
  const { data: contest, isLoading: contestLoading } = useQuery({
    queryKey: contestKeys.active(),
    queryFn: fetchActiveContest,
  });

  const {
    data: submissions,
    isLoading: feedLoading,
    refetch,
  } = useQuery({
    queryKey: submissionKeys.feed(contest?.id ?? ""),
    queryFn: () => fetchFeedSubmissions(contest!.id),
    enabled: !!contest?.id,
  });

  return {
    contest,
    submissions: submissions ?? [],
    isLoading: contestLoading || feedLoading,
    refetch,
  };
};
