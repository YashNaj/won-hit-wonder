import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, spacing } from "@/constants/tokens";
import { HamburgerMenu } from "@/components/HamburgerMenu";

interface AppHeaderProps {
  unreadCount?: number;
}

export const AppHeader = ({ unreadCount = 0 }: AppHeaderProps) => {
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        {/* Hamburger button */}
        <Pressable
          onPress={openMenu}
          style={styles.menuBtn}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          hitSlop={12}
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={[styles.menuLine, styles.menuLineShort]} />
            <View style={styles.menuLine} />
          </View>
          {unreadCount > 0 ? <View style={styles.notifDot} /> : null}
        </Pressable>

        {/* Spacer */}
        <View style={styles.flex} />

        {/* Add/create button */}
        <Pressable
          style={styles.addBtn}
          accessibilityRole="button"
          accessibilityLabel="Create new entry"
          hitSlop={12}
        >
          <Text style={styles.addIcon}>+</Text>
        </Pressable>
      </View>

      <HamburgerMenu
        visible={menuOpen}
        onClose={closeMenu}
        unreadCount={unreadCount}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: 8,
  },
  flex: { flex: 1 },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    gap: 4,
  },
  menuLine: {
    width: 18,
    height: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  menuLineShort: {
    width: 12,
  },
  notifDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.hotPink,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "300",
    marginTop: -2,
  },
});
