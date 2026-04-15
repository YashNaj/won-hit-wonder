import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GradientButton } from "@/components/GradientButton";
import { colors, spacing, typography } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { useRecordingStore } from "@/stores/recording.store";

const ShareScreen = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const { songTitle, reset } = useRecordingStore();

  const handleDone = useCallback(() => {
    reset();
    router.navigate("/(tabs)/home");
  }, [reset]);

  const handleResetSubmission = useCallback(async () => {
    if (!userId) return;
    await supabase.from("submissions").delete().eq("user_id", userId);
    reset();
    router.navigate("/(tabs)/contest");
  }, [userId, reset]);

  return (
    <GlassBackground>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <Text style={styles.checkEmoji}>✅</Text>
        </View>

        <Text style={styles.headline}>Entry Submitted!</Text>

        {songTitle ? <Text style={styles.songName}>🎵 {songTitle}</Text> : null}

        <Text style={styles.body}>
          Now's your chance to win the grand prize. Share your video and start
          getting those votes!
        </Text>

        <Text style={styles.reminder}>
          Please remember, you can only submit one entry per contest.
        </Text>

        <View style={styles.shareRow}>
          <View style={styles.shareBtn}>
            <Text style={styles.shareEmoji}>📱</Text>
            <Text style={styles.shareLabel}>Share</Text>
          </View>
          <View style={styles.shareBtn}>
            <Text style={styles.shareEmoji}>🔗</Text>
            <Text style={styles.shareLabel}>Copy Link</Text>
          </View>
          <View style={styles.shareBtn}>
            <Text style={styles.shareEmoji}>💬</Text>
            <Text style={styles.shareLabel}>Message</Text>
          </View>
        </View>

        <GradientButton
          label="Done"
          onPress={handleDone}
          accessibilityHint="Returns to the home feed"
        />

        <Pressable
          onPress={handleResetSubmission}
          style={styles.devButton}
          accessibilityRole="button"
          accessibilityLabel="Reset submission for testing"
        >
          <Text style={styles.devButtonText}>🧪 Reset My Submission (dev)</Text>
        </Pressable>
      </View>
    </GlassBackground>
  );
};

export default ShareScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(116, 47, 229, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  checkEmoji: {
    fontSize: 40,
  },
  headline: {
    color: colors.white,
    ...typography.h2,
    textAlign: "center",
  },
  songName: {
    color: colors.gold,
    fontSize: 16,
    fontWeight: "600",
  },
  body: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: "center",
    lineHeight: 20,
  },
  reminder: {
    color: colors.textSecondary,
    ...typography.bodySmall,
    textAlign: "center",
    fontStyle: "italic",
    opacity: 0.7,
  },
  shareRow: {
    flexDirection: "row",
    gap: spacing.xl,
    marginVertical: spacing.lg,
  },
  shareBtn: {
    alignItems: "center",
    gap: spacing.xs,
  },
  shareEmoji: {
    fontSize: 28,
  },
  shareLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  devButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  devButtonText: {
    color: colors.textSecondary,
    fontSize: 11,
  },
});
