import { useCallback, useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { submissionKeys } from "@/lib/api/submissions";
import { castVote, fetchUserVoteForContest, removeVote } from "@/lib/api/votes";
import { useAuthStore } from "@/stores/auth.store";

export const useVote = (contestId: string) => {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const [votedSubmissionId, setVotedSubmissionId] = useState<string | null>(
    null,
  );
  const [hasChecked, setHasChecked] = useState(false);

  // Check if user already voted in this contest
  useEffect(() => {
    if (!user || !contestId || hasChecked) return;
    const check = async () => {
      const vote = await fetchUserVoteForContest(contestId, user.id);
      if (vote) setVotedSubmissionId(vote.submission_id);
      setHasChecked(true);
    };
    check();
  }, [user, contestId, hasChecked]);

  const toggleVote = useCallback(
    async (submissionId: string) => {
      if (!user) return;

      if (votedSubmissionId === submissionId) {
        setVotedSubmissionId(null);
        await removeVote(user.id, contestId);
      } else {
        setVotedSubmissionId(submissionId);
        await castVote(submissionId, contestId, user.id);
      }

      queryClient.invalidateQueries({
        queryKey: submissionKeys.feed(contestId),
      });
    },
    [user, contestId, votedSubmissionId, queryClient],
  );

  return { votedSubmissionId, toggleVote };
};
