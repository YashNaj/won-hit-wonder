import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/tokens";
import { ContestCountdown } from "@/features/feed/ContestCountdown";
import type { ActiveContest } from "@/lib/types";

interface ContestHeaderProps {
  contest: ActiveContest | null | undefined;
}

export const ContestHeader = ({ contest }: ContestHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>{contest?.title ?? "Won Hit Wonder"}</Text>
      <Text style={styles.subtitle}>
        Choose a song and show us what you've got!
      </Text>
      <ContestCountdown />
      <View style={styles.ruleBox}>
        <Text style={styles.ruleText}>
          Each contest runs for 90 days. You can submit one entry per contest.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: "center",
    gap: spacing.md,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
  },
  ruleBox: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  ruleText: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
});
