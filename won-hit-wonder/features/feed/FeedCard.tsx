import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { colors, spacing } from "@/constants/tokens";
import { VoteButton } from "@/features/feed/VoteButton";
import type { FeedSubmission } from "@/lib/types";

const { width: SW, height: SH } = Dimensions.get("window");
const CARD_HEIGHT = SH - 85; // subtract tab bar

interface FeedCardProps {
  submission: FeedSubmission;
  isVoted: boolean;
  onVote: () => void;
  onPress?: () => void;
}

export const FeedCard = ({
  submission,
  isVoted,
  onVote,
  onPress,
}: FeedCardProps) => {
  const { user, song } = submission;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Full-bleed thumbnail */}
      <Image
        source={{ uri: submission.thumbnail_url ?? undefined }}
        style={styles.thumbnail}
        contentFit="cover"
      />

      {/* Dark gradient overlay at bottom */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.85)"]}
        locations={[0.3, 0.6, 1]}
        style={styles.gradient}
      />

      {/* Side action bar */}
      <View style={styles.sideBar}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user.avatar_url ?? undefined }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
        <VoteButton
          voteCount={submission.vote_count}
          isVoted={isVoted}
          onPress={onVote}
        />
        <View style={styles.sideIcon}>
          <Text style={styles.sideEmoji}>💬</Text>
        </View>
        <View style={styles.sideIcon}>
          <Text style={styles.sideEmoji}>↗</Text>
        </View>
      </View>

      {/* Bottom info overlay */}
      <View style={styles.bottomInfo}>
        <Text style={styles.displayName}>
          {user.display_name}
          {user.is_verified ? " ✓" : ""}
        </Text>
        <Text style={styles.songTitle}>
          🎵 {song.title} — {song.artist}
        </Text>
        {user.location ? (
          <Text style={styles.location}>📍 {user.location}</Text>
        ) : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: SW,
    height: CARD_HEIGHT,
    backgroundColor: colors.background,
  },
  thumbnail: {
    ...StyleSheet.absoluteFillObject,
    width: SW,
    height: CARD_HEIGHT,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: CARD_HEIGHT * 0.5,
  },
  sideBar: {
    position: "absolute",
    right: spacing.md,
    bottom: 120,
    alignItems: "center",
    gap: 20,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.purple,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  sideIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  sideEmoji: {
    fontSize: 22,
  },
  bottomInfo: {
    position: "absolute",
    left: spacing.md,
    right: 80,
    bottom: spacing.xl,
    gap: 6,
  },
  displayName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  songTitle: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "400",
  },
  location: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
