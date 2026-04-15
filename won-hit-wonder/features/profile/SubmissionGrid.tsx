import { FlatList, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";

import { colors, radii, spacing } from "@/constants/tokens";
import type { Submission } from "@/lib/types";

type SubmissionWithSong = Submission & {
  song: { title: string; artist: string };
};

interface SubmissionGridProps {
  submissions: SubmissionWithSong[];
}

const GridItem = ({ item }: { item: SubmissionWithSong }) => (
  <View style={styles.item}>
    <Image
      source={{ uri: item.thumbnail_url ?? undefined }}
      style={styles.thumbnail}
      contentFit="cover"
    />
    <View style={styles.overlay}>
      <Text style={styles.songTitle} numberOfLines={1}>
        {item.song.title}
      </Text>
    </View>
    <View style={styles.votesBadge}>
      <Text style={styles.votesText}>❤️ {item.vote_count}</Text>
    </View>
  </View>
);

export const SubmissionGrid = ({ submissions }: SubmissionGridProps) => {
  if (submissions.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Contest Submissions</Text>
      <FlatList
        data={submissions}
        renderItem={({ item }) => <GridItem item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  row: {
    gap: spacing.sm,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: radii.sm,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  songTitle: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  votesBadge: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: radii.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  votesText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },
});
