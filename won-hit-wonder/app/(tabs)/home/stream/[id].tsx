import { useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { ContestCountdown } from "@/features/feed/ContestCountdown";
import { VoteButton } from "@/features/feed/VoteButton";
import { useVote } from "@/features/feed/useVote";
import { colors, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import type { FeedSubmission } from "@/lib/types";

const { width: SW, height: SH } = Dimensions.get("window");

const StreamScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const { data: submission, isLoading } = useQuery({
    queryKey: ["submissions", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, user:users(*), song:songs(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as FeedSubmission;
    },
    enabled: !!id,
  });

  const { votedSubmissionId, toggleVote } = useVote(
    submission?.contest_id ?? "",
  );

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  if (isLoading || !submission) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  const { user, song } = submission;

  return (
    <View style={styles.container}>
      {/* Full-bleed thumbnail */}
      <Image
        source={{ uri: submission.thumbnail_url ?? undefined }}
        style={styles.bgImage}
        contentFit="cover"
      />

      {/* Gradient overlays */}
      <LinearGradient
        colors={["rgba(0,0,0,0.6)", "transparent"]}
        style={[styles.topGradient, { paddingTop: insets.top }]}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.bottomGradient}
      />

      {/* Top bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          onPress={handleBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backArrow}>‹</Text>
        </Pressable>
        <View style={styles.topInfo}>
          <View style={styles.avatarSmall}>
            <Image
              source={{ uri: user.avatar_url ?? undefined }}
              style={styles.avatarImg}
              contentFit="cover"
            />
          </View>
          <Text style={styles.userName}>{user.display_name}</Text>
        </View>
        <View style={styles.topSpacer} />
      </View>

      {/* Contest countdown */}
      <View style={styles.countdownArea}>
        <ContestCountdown />
      </View>

      {/* Side action bar */}
      <View style={styles.sideBar}>
        <VoteButton
          voteCount={submission.vote_count}
          isVoted={votedSubmissionId === submission.id}
          onPress={() => toggleVote(submission.id)}
        />
        <View style={styles.sideIcon}>
          <Text style={styles.sideEmoji}>💬</Text>
          <Text style={styles.sideCount}>154</Text>
        </View>
        <View style={styles.sideIcon}>
          <Text style={styles.sideEmoji}>↗</Text>
        </View>
      </View>

      {/* Bottom info */}
      <View style={styles.bottomInfo}>
        <Text style={styles.songTitle}>{song.title}</Text>
        <Text style={styles.artistName}>{song.artist}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>01:28</Text>
          <Text style={styles.timeText}>
            {Math.floor((song.duration_ms ?? 0) / 60000)}:
            {String(
              Math.floor(((song.duration_ms ?? 0) % 60000) / 1000),
            ).padStart(2, "0")}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StreamScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: SW,
    height: SH,
  },
  topGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: SH * 0.4,
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    marginTop: -3,
  },
  topInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.purple,
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  userName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  topSpacer: {
    width: 40,
  },
  countdownArea: {
    position: "absolute",
    top: 110,
    alignSelf: "center",
    zIndex: 10,
  },
  sideBar: {
    position: "absolute",
    right: spacing.md,
    bottom: 180,
    alignItems: "center",
    gap: 20,
  },
  sideIcon: {
    alignItems: "center",
    gap: 4,
  },
  sideEmoji: {
    fontSize: 28,
  },
  sideCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomInfo: {
    position: "absolute",
    bottom: 40,
    left: spacing.lg,
    right: 80,
  },
  songTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  artistName: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 4,
  },
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 1,
    marginTop: spacing.md,
  },
  progressFill: {
    height: 2,
    width: "45%",
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontVariant: ["tabular-nums"],
  },
});
