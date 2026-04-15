import { useQuery } from "@tanstack/react-query";

import { fetchSongs, songKeys } from "@/lib/api/songs";

export const useSongs = () => {
  return useQuery({
    queryKey: songKeys.all,
    queryFn: fetchSongs,
  });
};
