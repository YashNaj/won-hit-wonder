import { useCallback } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { colors, radii, spacing, typography } from "@/constants/tokens";

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  accessibilityHint?: string;
}

export const GradientButton = ({
  label,
  onPress,
  accessibilityHint,
}: GradientButtonProps) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <LinearGradient
        colors={["#0e60ff", "#d500cd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 311,
    height: 56,
    alignSelf: "center",
    borderRadius: radii.lg,
    overflow: "hidden",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radii.lg,
    paddingHorizontal: spacing.lg,
  },
  label: {
    color: colors.white,
    ...typography.button,
    letterSpacing: 0.5,
  },
});
