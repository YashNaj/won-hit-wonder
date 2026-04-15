import { StyleSheet, Text, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radii, spacing, typography } from "@/constants/tokens";

interface PrizeSectionProps {
  emoji: string;
  emojiSize: number;
  title: string;
  titleSize: number;
  description: string;
}

const PrizeSection = ({
  emoji,
  emojiSize,
  title,
  titleSize,
  description,
}: PrizeSectionProps) => {
  return (
    <View
      style={styles.prizeSection}
      accessible={true}
      accessibilityLabel={`${title}. ${description}`}
    >
      <View
        style={[styles.emojiCircle, { width: emojiSize, height: emojiSize }]}
      >
        <Text style={[styles.emoji, { fontSize: emojiSize * 0.5 }]}>
          {emoji}
        </Text>
      </View>
      <View style={styles.prizeTextContainer}>
        <Text style={[styles.prizeTitle, { fontSize: titleSize }]}>
          {title}
        </Text>
        <Text style={styles.prizeDescription}>{description}</Text>
      </View>
    </View>
  );
};

export const PrizeCard = () => {
  return (
    <View style={styles.cardOuter}>
      <LinearGradient
        colors={["#0e60ff", "#d500cd"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBorder}
      />
      <BlurView intensity={40} tint="dark" style={styles.cardInner}>
        <PrizeSection
          emoji="💰"
          emojiSize={56}
          title="10k"
          titleSize={24}
          description={
            "Win $10,000 and make your dream a reality! This substantial " +
            "cash prize could be the boost you need to take your talent " +
            "to the next level"
          }
        />
        <View style={styles.divider} />
        <PrizeSection
          emoji="🎙"
          emojiSize={64}
          title={"Single Track\nRecord Deal"}
          titleSize={20}
          description={
            "Secure a single track record deal and get your music heard! " +
            "Work with industry professionals to produce a high-quality " +
            "recording of your best song."
          }
        />
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: radii.md,
    overflow: "hidden",
    marginHorizontal: spacing.lg,
  },
  gradientBorder: {
    height: 2,
  },
  cardInner: {
    backgroundColor: "rgba(1, 1, 1, 0.03)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
  },
  prizeSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  emojiCircle: {
    borderRadius: radii.full,
    backgroundColor: "rgba(116, 47, 229, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  emoji: {
    textAlign: "center",
  },
  prizeTextContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  prizeTitle: {
    color: colors.gold,
    fontWeight: "700",
  },
  prizeDescription: {
    color: colors.white,
    ...typography.bodySmall,
    lineHeight: 18,
    opacity: 0.75,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
