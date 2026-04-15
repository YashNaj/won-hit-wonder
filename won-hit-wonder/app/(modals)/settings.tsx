import { useCallback, useEffect, useState } from "react";
import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { colors, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

interface ToggleRowProps {
  label: string;
  subtitle: string;
  value: boolean;
  onToggle: (val: boolean) => void;
}

const ToggleRow = ({ label, subtitle, value, onToggle }: ToggleRowProps) => (
  <View style={styles.toggleRow}>
    <View style={styles.toggleInfo}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <Text style={styles.toggleSubtitle}>{subtitle}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#333", true: colors.purple }}
      thumbColor={colors.white}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
    />
  </View>
);

const SettingsScreen = () => {
  const userId = useAuthStore((s) => s.user?.id);
  const [dailyNotifs, setDailyNotifs] = useState(true);
  const [inAppNotifs, setInAppNotifs] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data } = await supabase
        .from("users")
        .select("notification_daily, notification_in_app")
        .eq("id", userId)
        .single();
      if (data) {
        setDailyNotifs(data.notification_daily);
        setInAppNotifs(data.notification_in_app);
      }
    };
    load();
  }, [userId]);

  const updateSetting = useCallback(
    async (field: string, value: boolean) => {
      if (!userId) return;
      await supabase
        .from("users")
        .update({ [field]: value })
        .eq("id", userId);
    },
    [userId],
  );

  const handleDaily = useCallback(
    (val: boolean) => {
      setDailyNotifs(val);
      updateSetting("notification_daily", val);
    },
    [updateSetting],
  );

  const handleInApp = useCallback(
    (val: boolean) => {
      setInAppNotifs(val);
      updateSetting("notification_in_app", val);
    },
    [updateSetting],
  );

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <ToggleRow
          label="Daily Notifications"
          subtitle="Receive notifications about contest alerts and artist subscriptions"
          value={dailyNotifs}
          onToggle={handleDaily}
        />
        <View style={styles.divider} />
        <ToggleRow
          label="In-App Notifications"
          subtitle="Show notification banners while using the app"
          value={inAppNotifs}
          onToggle={handleInApp}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable style={styles.linkRow} accessibilityRole="link">
          <Text style={styles.linkText}>Edit Profile</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.linkRow} accessibilityRole="link">
          <Text style={styles.linkText}>Subscription</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable style={styles.linkRow} accessibilityRole="link">
          <Text style={styles.linkText}>Terms & Conditions</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={styles.linkRow} accessibilityRole="link">
          <Text style={styles.linkText}>Privacy Policy</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
        <View style={styles.divider} />
        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Version</Text>
          <Text style={styles.versionText}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.md,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  toggleInfo: {
    flex: 1,
    gap: 3,
  },
  toggleLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
  },
  toggleSubtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  linkText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: 20,
  },
  versionText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
