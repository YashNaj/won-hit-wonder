import { useCallback } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GradientButton } from "@/components/GradientButton";
import { PrizeCard } from "@/components/PrizeCard";
import { colors, spacing, typography } from "@/constants/tokens";
import { useAuthStore } from "@/stores/auth.store";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const WelcomeScreen = () => {
  const router = useRouter();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const handleContinue = useCallback(async () => {
    await AsyncStorage.setItem("onboarding_complete", "true");
    setOnboarded(true);
  }, [setOnboarded]);

  return (
    <GlassBackground>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Text style={styles.appName} accessibilityRole="header">
          Won Hit Wonder
        </Text>

        <Text style={styles.headline}>Welcome</Text>

        <Text style={styles.body}>
          Welcome to Won Hit Wonder, a singing contest that gives anyone the
          opportunity to win our grand prize every 90 days!
        </Text>

        <Text style={styles.ctaLine}>
          Enter our contest for a chance to win our Grand Prize
        </Text>

        <View
          style={styles.trophyArea}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
        >
          <Text style={styles.trophyEmoji}>🏆</Text>
          <Text style={styles.micEmoji}>🎤</Text>
        </View>

        <PrizeCard />

        <View style={styles.buttonSpacer} />

        <GradientButton
          label="Continue"
          onPress={handleContinue}
          accessibilityHint="Navigates to the grand prize details screen"
        />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </GlassBackground>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 80,
    paddingHorizontal: spacing.lg + 1,
  },
  appName: {
    color: colors.white,
    ...typography.h4,
    textAlign: "center",
    marginBottom: spacing.xxl,
  },
  headline: {
    color: colors.white,
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.white,
    ...typography.bodySmall,
    lineHeight: 18,
    opacity: 0.85,
    marginBottom: spacing.md,
  },
  ctaLine: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: spacing.lg,
  },
  trophyArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    marginBottom: spacing.md,
  },
  trophyEmoji: {
    fontSize: 64,
  },
  micEmoji: {
    fontSize: 28,
    position: "absolute",
    right: SCREEN_WIDTH * 0.2,
    top: 10,
  },
  buttonSpacer: {
    height: spacing.lg,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
