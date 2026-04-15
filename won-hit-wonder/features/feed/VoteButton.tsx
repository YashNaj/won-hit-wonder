import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/tokens";

interface VoteButtonProps {
  voteCount: number;
  isVoted: boolean;
  onPress: () => void;
}

export const VoteButton = ({
  voteCount,
  isVoted,
  onPress,
}: VoteButtonProps) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Vote, ${voteCount} votes`}
      accessibilityState={{ selected: isVoted }}
    >
      <View style={[styles.circle, isVoted && styles.circleVoted]}>
        <Text style={styles.heart}>{isVoted ? "❤️" : "🤍"}</Text>
      </View>
      <Text style={styles.count}>{voteCount}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 4,
  },
  pressed: {
    transform: [{ scale: 0.9 }],
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  circleVoted: {
    backgroundColor: "rgba(251, 13, 65, 0.3)",
  },
  heart: {
    fontSize: 24,
  },
  count: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
});
