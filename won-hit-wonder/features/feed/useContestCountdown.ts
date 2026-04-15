import { useEffect, useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { contestKeys, fetchActiveContest } from "@/lib/api/contests";

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useContestCountdown = () => {
  const { data: contest } = useQuery({
    queryKey: contestKeys.active(),
    queryFn: fetchActiveContest,
  });

  const [countdown, setCountdown] = useState<Countdown>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!contest?.ends_at) return;

    const tick = () => {
      const diff = new Date(contest.ends_at).getTime() - Date.now();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [contest?.ends_at]);

  return { contest, countdown };
};
