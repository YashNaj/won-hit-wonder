import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { GradientButton } from "@/components/GradientButton";
import { ContestHeader } from "@/features/contest/ContestHeader";
import { SongCard } from "@/features/contest/SongCard";
import { useActiveContest } from "@/features/contest/useActiveContest";
import { useSongs } from "@/features/contest/useSongs";
import { colors, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { useRecordingStore } from "@/stores/recording.store";
import type { Song } from "@/lib/types";

const ContestScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: contest, isLoading: contestLoading } = useActiveContest();
  const { data: songs, isLoading: songsLoading } = useSongs();
  const { songId, setSong } = useRecordingStore();

  const handleSelect = useCallback(
    (song: Song) => {
      setSong(song.id, song.title);
    },
    [setSong],
  );

  const handleContinue = useCallback(() => {
    if (!songId) return;
    router.push("/(tabs)/contest/upload");
  }, [songId, router]);

  // DEV ONLY: delete current user's submission for this contest so we can re-test
  const handleDeleteSubmission = useCallback(async () => {
    if (!userId || !contest?.id) return;
    await supabase
      .from("submissions")
      .delete()
      .eq("user_id", userId)
      .eq("contest_id", contest.id);
    alert("Submission deleted — you can submit again");
  }, [userId, contest?.id]);

  if (contestLoading || songsLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={songs ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SongCard
            song={item}
            isSelected={songId === item.id}
            onSelect={handleSelect}
          />
        )}
        ListHeaderComponent={<ContestHeader contest={contest} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
      />

      {songId ? (
        <View style={styles.bottomBar}>
          <GradientButton
            label="Continue to Record"
            onPress={handleContinue}
            accessibilityHint="Proceeds to the recording screen with the selected song"
          />
          <Pressable
            onPress={handleDeleteSubmission}
            style={styles.devButton}
            accessibilityRole="button"
            accessibilityLabel="Delete submission for testing"
          >
            <Text style={styles.devButtonText}>
              🧪 Reset My Submission (dev)
            </Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
};

export default ContestScreen;

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
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  separator: {
    height: spacing.sm,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
    gap: spacing.sm,
  },
  devButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  devButtonText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
