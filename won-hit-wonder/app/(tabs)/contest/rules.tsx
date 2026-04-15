import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { GradientButton } from "@/components/GradientButton";
import { useActiveContest } from "@/features/contest/useActiveContest";
import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import { useRecordingStore } from "@/stores/recording.store";

interface RuleItemProps {
  number: number;
  text: string;
}

const RuleItem = ({ number, text }: RuleItemProps) => (
  <View style={styles.ruleItem}>
    <View style={styles.ruleBullet}>
      <Text style={styles.ruleBulletText}>{number}</Text>
    </View>
    <Text style={styles.ruleText}>{text}</Text>
  </View>
);

const RulesScreen = () => {
  const insets = useSafeAreaInsets();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: contest } = useActiveContest();
  const { songId, songTitle, reset } = useRecordingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!agreed) {
      Alert.alert(
        "Agreement required",
        "Please agree to the contest rules before submitting.",
      );
      return;
    }
    if (!userId || !contest?.id || !songId) {
      Alert.alert("Missing info", "Please select a song and try again.");
      return;
    }

    setIsSubmitting(true);

    // Delete any existing submission for this contest first (allows re-submission)
    await supabase
      .from("submissions")
      .delete()
      .eq("user_id", userId)
      .eq("contest_id", contest.id);

    const { error } = await supabase.from("submissions").insert({
      contest_id: contest.id,
      user_id: userId,
      song_id: songId,
      video_url: `https://example.com/v/${userId}-${Date.now()}.mp4`,
      thumbnail_url: `https://picsum.photos/seed/${Date.now()}/400/700`,
      duration_ms: 180000,
      status: "published",
      vote_count: 0,
    });

    setIsSubmitting(false);

    if (error) {
      Alert.alert("Submission failed", error.message);
      return;
    }

    router.push("/(tabs)/contest/share");
  }, [agreed, userId, contest?.id, songId]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Contest Rules</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Song reminder */}
        <View style={styles.songBadge}>
          <Text style={styles.songLabel}>🎵 {songTitle ?? "Your Song"}</Text>
        </View>

        {/* Rules */}
        <View style={styles.rulesCard}>
          <RuleItem
            number={1}
            text="Each contest runs for 90 days. All applicants can submit one entry per contest."
          />
          <RuleItem
            number={2}
            text="Your entry must be an original performance of the selected song. Lip-syncing is not allowed."
          />
          <RuleItem
            number={3}
            text="Videos must be between 30 seconds and 5 minutes long."
          />
          <RuleItem
            number={4}
            text="The community votes to determine the winner. Each user gets one vote per contest."
          />
          <RuleItem
            number={5}
            text="The winner receives $10,000 cash and a single track record deal with professional studio time."
          />
          <RuleItem
            number={6}
            text="Won Hit Wonder reserves the right to remove entries that violate community guidelines."
          />
        </View>

        {/* Agreement checkbox */}
        <Pressable
          style={styles.agreeRow}
          onPress={() => setAgreed((v) => !v)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="I agree to the contest rules"
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
          <Text style={styles.agreeText}>
            By uploading my entry, I agree to the Won Hit Wonder Contest Details
            and User Agreement.
          </Text>
        </Pressable>
      </ScrollView>

      {/* Submit button */}
      <View style={styles.bottomBar}>
        {isSubmitting ? (
          <ActivityIndicator size="large" color={colors.purple} />
        ) : (
          <GradientButton
            label="Submit Your Entry"
            onPress={handleSubmit}
            accessibilityHint="Submits your contest entry"
          />
        )}
      </View>
    </View>
  );
};

export default RulesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    marginTop: -3,
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  songBadge: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  songLabel: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "600",
  },
  rulesCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: radii.md,
    padding: spacing.lg,
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  ruleItem: {
    flexDirection: "row",
    gap: spacing.md,
  },
  ruleBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(116, 47, 229, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  ruleBulletText: {
    color: colors.purple,
    fontSize: 13,
    fontWeight: "700",
  },
  ruleText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  agreeRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.purple,
    borderColor: colors.purple,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  agreeText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
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
  },
});
