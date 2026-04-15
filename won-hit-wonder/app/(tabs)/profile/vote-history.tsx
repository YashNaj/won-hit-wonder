import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";

import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

interface VoteRecord {
  id: string;
  created_at: string;
  submission: {
    thumbnail_url: string | null;
    vote_count: number;
    user: { display_name: string | null; avatar_url: string | null };
    song: { title: string; artist: string };
  };
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const VoteItem = ({ item }: { item: VoteRecord }) => (
  <View style={styles.item}>
    <Image
      source={{ uri: item.submission.thumbnail_url ?? undefined }}
      style={styles.thumbnail}
      contentFit="cover"
    />
    <View style={styles.itemInfo}>
      <Text style={styles.itemName} numberOfLines={1}>
        {item.submission.user.display_name}
      </Text>
      <Text style={styles.itemSong} numberOfLines={1}>
        🎵 {item.submission.song.title} — {item.submission.song.artist}
      </Text>
      <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
    </View>
    <View style={styles.voteBadge}>
      <Text style={styles.voteEmoji}>❤️</Text>
      <Text style={styles.voteCount}>{item.submission.vote_count}</Text>
    </View>
  </View>
);

const VoteHistoryScreen = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data } = await supabase
        .from("votes")
        .select(
          "id, created_at, submission:submissions(thumbnail_url, vote_count, user:users(display_name, avatar_url), song:songs(title, artist))",
        )
        .eq("voter_id", userId)
        .order("created_at", { ascending: false });

      setVotes((data as unknown as VoteRecord[]) ?? []);
      setIsLoading(false);
    };
    load();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={votes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <VoteItem item={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🗳️</Text>
            <Text style={styles.emptyText}>No votes yet</Text>
            <Text style={styles.emptySubtext}>
              Vote for your favorite performances in the feed!
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default VoteHistoryScreen;

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
  list: {
    paddingVertical: spacing.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
  },
  itemInfo: {
    flex: 1,
    gap: 3,
  },
  itemName: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  itemSong: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  itemDate: {
    color: colors.textSecondary,
    fontSize: 11,
    opacity: 0.6,
  },
  voteBadge: {
    alignItems: "center",
    gap: 2,
  },
  voteEmoji: {
    fontSize: 18,
  },
  voteCount: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  empty: {
    alignItems: "center",
    paddingTop: 100,
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
