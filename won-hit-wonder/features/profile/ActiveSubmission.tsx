import { StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { colors, radii, spacing } from "@/constants/tokens";
import type { Submission } from "@/lib/types";

type SubmissionWithSong = Submission & {
  song: { title: string; artist: string };
};

interface ActiveSubmissionProps {
  submission: SubmissionWithSong | undefined;
}

export const ActiveSubmission = ({ submission }: ActiveSubmissionProps) => {
  if (!submission) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Active Submission</Text>
      <View style={styles.card}>
        <Image
          source={{ uri: submission.thumbnail_url ?? undefined }}
          style={styles.thumbnail}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={styles.songTitle} numberOfLines={1}>
            {submission.song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {submission.song.artist}
          </Text>
          <Text style={styles.votes}>❤️ {submission.vote_count} votes</Text>
        </View>
        <View style={styles.playBtn}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: radii.md,
    padding: spacing.sm,
    gap: spacing.md,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: radii.sm,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  songTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  artist: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  votes: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  playBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: colors.white,
    fontSize: 16,
  },
});
