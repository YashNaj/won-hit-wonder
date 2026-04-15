import { useCallback } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GradientButton } from "@/components/GradientButton";
import { PrizeCard } from "@/components/PrizeCard";
import { colors, spacing, typography } from "@/constants/tokens";

const { width: SW } = Dimensions.get("window");

const WonScreen = () => {
  const handleContinue = useCallback(() => {
    router.navigate("/(tabs)/home");
  }, []);

  return (
    <GlassBackground>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Trophy graphic area */}
        <View
          style={styles.trophyArea}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          {/* Gold accent circle */}
          <View style={styles.goldCircle} />
          <Text style={styles.trophyEmoji}>🏆</Text>
          <View style={styles.trophyDecoRow}>
            <Text style={styles.decorEmoji}>🎤</Text>
            <Text style={styles.decorEmoji}>🎵</Text>
          </View>
          <View style={styles.sparkles}>
            <Text style={styles.sparkle}>✨</Text>
            <Text style={[styles.sparkle, styles.sparkleRight]}>✨</Text>
          </View>
        </View>

        {/* Congratulations text */}
        <Text style={styles.congrats}>Congratulations!</Text>
        <Text style={styles.youWon}>You Won</Text>

        {/* Prize card */}
        <View style={styles.prizeSection}>
          <PrizeCard />
        </View>

        {/* What comes next */}
        <View style={styles.nextSection}>
          <Text style={styles.nextTitle}>What Comes Next?</Text>
          <Text style={styles.nextBody}>
            Our team will reach out soon to coordinate your prize and discuss
            next steps. We're excited to support you in making the most of your
            new opportunities.
          </Text>
        </View>

        {/* Continue button */}
        <GradientButton
          label="Continue"
          onPress={handleContinue}
          accessibilityHint="Returns to the home feed"
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </GlassBackground>
  );
};

export default WonScreen;

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    alignItems: "center",
  },
  trophyArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    width: SW,
    marginBottom: spacing.md,
  },
  goldCircle: {
    position: "absolute",
    width: 111,
    height: 111,
    borderRadius: 55.5,
    backgroundColor: "#fea713",
    opacity: 0.3,
  },
  trophyEmoji: {
    fontSize: 80,
  },
  trophyDecoRow: {
    flexDirection: "row",
    gap: 80,
    position: "absolute",
    top: 30,
  },
  decorEmoji: {
    fontSize: 32,
  },
  sparkles: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sparkle: {
    position: "absolute",
    fontSize: 20,
    top: 10,
    left: SW * 0.2,
  },
  sparkleRight: {
    left: undefined,
    right: SW * 0.2,
    top: 60,
  },
  congrats: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  youWon: {
    color: colors.white,
    fontSize: 36,
    fontWeight: "700",
    marginBottom: spacing.xl,
  },
  prizeSection: {
    width: "100%",
    marginBottom: spacing.xl,
  },
  nextSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  nextTitle: {
    color: colors.white,
    ...typography.h2,
  },
  nextBody: {
    color: colors.textSecondary,
    ...typography.bodySmall,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
