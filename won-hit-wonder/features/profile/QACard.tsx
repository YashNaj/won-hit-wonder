import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { colors, radii, spacing } from "@/constants/tokens";
import type { ProfileQA } from "@/lib/types";

interface QACardProps {
  qa: ProfileQA;
  isEditing?: boolean;
  onAnswerChange?: (qaId: string, answer: string) => void;
}

export const QACard = ({
  qa,
  isEditing = false,
  onAnswerChange,
}: QACardProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const showContent = isEditing || expanded;

  return (
    <Pressable
      onPress={isEditing ? undefined : toggle}
      accessibilityRole={isEditing ? "none" : "button"}
      accessibilityLabel={qa.question}
      accessibilityState={isEditing ? undefined : { expanded }}
    >
      <View style={styles.card}>
        <LinearGradient
          colors={[qa.accent_color, "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        />
        <View style={styles.cardBody}>
          <View style={styles.row}>
            <View
              style={[
                styles.emojiCircle,
                { backgroundColor: qa.accent_color + "30" },
              ]}
            >
              <Text style={styles.emoji}>{qa.emoji}</Text>
            </View>
            <Text
              style={styles.question}
              numberOfLines={showContent ? undefined : 2}
            >
              {qa.question}
            </Text>
            {!isEditing ? (
              <Text style={styles.chevron}>{expanded ? "▲" : "▼"}</Text>
            ) : null}
          </View>

          {isEditing ? (
            <View style={styles.inputArea}>
              <TextInput
                style={styles.answerInput}
                value={qa.answer ?? ""}
                onChangeText={(text) => onAnswerChange?.(qa.id, text)}
                placeholder="Type your answer..."
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                multiline
                maxLength={300}
                accessibilityLabel={`Answer for: ${qa.question}`}
              />
              <Text style={styles.charCount}>{qa.answer?.length ?? 0}/300</Text>
            </View>
          ) : showContent && qa.answer ? (
            <Text style={styles.answer}>{qa.answer}</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: "hidden",
  },
  gradientBorder: {
    height: 2,
  },
  cardBody: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  emojiCircle: {
    width: 37,
    height: 37,
    borderRadius: 18.5,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 20,
  },
  question: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: 10,
  },
  answer: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 37 + 8,
  },
  inputArea: {
    marginLeft: 37 + 8,
    gap: 4,
  },
  answerInput: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: radii.sm,
    padding: spacing.sm,
    color: colors.white,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 72,
    textAlignVertical: "top",
  },
  charCount: {
    color: colors.textSecondary,
    fontSize: 10,
    alignSelf: "flex-end",
    opacity: 0.6,
  },
});
