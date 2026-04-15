import { useQuery } from "@tanstack/react-query";

import { contestKeys, fetchActiveContest } from "@/lib/api/contests";

export const useActiveContest = () => {
  return useQuery({
    queryKey: contestKeys.active(),
    queryFn: fetchActiveContest,
  });
};
