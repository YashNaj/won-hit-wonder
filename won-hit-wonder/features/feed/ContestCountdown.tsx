import { StyleSheet, Text, View } from "react-native";

import { colors, spacing } from "@/constants/tokens";
import { useContestCountdown } from "@/features/feed/useContestCountdown";

const pad = (n: number) => String(n).padStart(2, "0");

export const ContestCountdown = () => {
  const { countdown } = useContestCountdown();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>CONTEST COUNTDOWN</Text>
      <View style={styles.timerRow}>
        <View style={styles.unit}>
          <Text style={styles.value}>{pad(countdown.days)}</Text>
          <Text style={styles.unitLabel}>DD</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.unit}>
          <Text style={styles.value}>{pad(countdown.hours)}</Text>
          <Text style={styles.unitLabel}>HH</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.unit}>
          <Text style={styles.value}>{pad(countdown.minutes)}</Text>
          <Text style={styles.unitLabel}>MM</Text>
        </View>
        <Text style={styles.separator}>:</Text>
        <View style={styles.unit}>
          <Text style={styles.value}>{pad(countdown.seconds)}</Text>
          <Text style={styles.unitLabel}>SS</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.xs,
  },
  label: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  timerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  unit: {
    alignItems: "center",
  },
  value: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  unitLabel: {
    color: colors.textSecondary,
    fontSize: 9,
    fontWeight: "500",
  },
  separator: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginHorizontal: 2,
    marginBottom: 12,
  },
});
