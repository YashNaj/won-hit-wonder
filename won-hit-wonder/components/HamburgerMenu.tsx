import { useCallback } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { router } from "expo-router";

import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

const { width: SW } = Dimensions.get("window");

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  unreadCount?: number;
}

interface MenuItemProps {
  emoji: string;
  label: string;
  onPress: () => void;
  badge?: number;
}

const MenuItem = ({ emoji, label, onPress, badge }: MenuItemProps) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.menuItem,
      pressed && styles.menuItemPressed,
    ]}
    accessibilityRole="button"
    accessibilityLabel={label}
  >
    <Text style={styles.menuEmoji}>{emoji}</Text>
    <Text style={styles.menuLabel}>{label}</Text>
    {badge ? (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badge}</Text>
      </View>
    ) : null}
  </Pressable>
);

export const HamburgerMenu = ({
  visible,
  onClose,
  unreadCount = 0,
}: HamburgerMenuProps) => {
  const user = useAuthStore((s) => s.user);
  const displayName = useAuthStore(
    (s) => s.session?.user?.user_metadata?.display_name ?? "User",
  );

  const navigate = useCallback(
    (path: string) => {
      onClose();
      setTimeout(() => router.navigate(path as never), 200);
    },
    [onClose],
  );

  const handleSignOut = useCallback(async () => {
    onClose();
    await supabase.auth.signOut();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      <View style={styles.panel}>
        {/* Close button */}
        <Pressable
          onPress={onClose}
          style={styles.closeBtn}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        >
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        {/* User info */}
        <View style={styles.userRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {displayName?.charAt(0) ?? "?"}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menu items */}
        <MenuItem
          emoji="🏠"
          label="Home"
          onPress={() => navigate("/(tabs)/home")}
        />
        <MenuItem
          emoji="🎤"
          label="Compete"
          onPress={() => navigate("/(tabs)/contest")}
        />
        <MenuItem
          emoji="👤"
          label="Profile"
          onPress={() => navigate("/(tabs)/profile")}
        />
        <MenuItem
          emoji="🔔"
          label="Notifications"
          onPress={() => navigate("/(modals)/notifications")}
          badge={unreadCount}
        />
        <MenuItem
          emoji="📊"
          label="Vote History"
          onPress={() => navigate("/(tabs)/profile/vote-history")}
        />
        <MenuItem
          emoji="⚙️"
          label="Settings"
          onPress={() => navigate("/(modals)/settings")}
        />

        <View style={styles.divider} />

        <MenuItem
          emoji="📄"
          label="Terms & Conditions"
          onPress={() => navigate("/terms")}
        />
        <MenuItem
          emoji="🔒"
          label="Privacy Policy"
          onPress={() => navigate("/privacy")}
        />

        <View style={styles.divider} />

        <Pressable
          onPress={handleSignOut}
          style={styles.signOut}
          accessibilityRole="button"
          accessibilityLabel="Sign out"
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtn: {
    position: "absolute",
    top: 55,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  panel: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: SW * 0.78,
    backgroundColor: "rgba(11, 10, 23, 0.95)",
    paddingTop: 70,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  userEmail: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    gap: spacing.md,
  },
  menuItemPressed: {
    opacity: 0.6,
  },
  menuEmoji: {
    fontSize: 20,
    width: 28,
    textAlign: "center",
  },
  menuLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  badge: {
    backgroundColor: colors.hotPink,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  signOut: {
    paddingVertical: 14,
  },
  signOutText: {
    color: colors.red,
    fontSize: 15,
    fontWeight: "500",
  },
});
