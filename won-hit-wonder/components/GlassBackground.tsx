import { Dimensions, StyleSheet, View } from "react-native";

import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { colors } from "@/constants/tokens";

const { width: SW, height: SH } = Dimensions.get("window");

interface GlassBackgroundProps {
  children: React.ReactNode;
  variant?: "default" | "profile";
}

export const GlassBackground = ({
  children,
  variant = "default",
}: GlassBackgroundProps) => {
  const isProfile = variant === "profile";

  return (
    <View style={styles.container}>
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
        accessibilityElementsHidden={true}
        importantForAccessibility="no"
      >
        {!isProfile ? (
          <LinearGradient
            colors={["#1a0533", "#0d0015", colors.background]}
            locations={[0, 0.4, 0.7]}
            style={[StyleSheet.absoluteFillObject, { height: SH * 0.6 }]}
          />
        ) : null}

        {isProfile ? (
          <>
            {/* Red — left edge, 40% cut off, below hero */}
            <View style={styles.profileCircleRed} />
            {/* Pink — right edge, 50% cut off */}
            <View style={styles.profileCirclePink} />
            {/* Purple — left edge, lower, 30% cut off */}
            <View style={styles.profileCirclePurple} />
          </>
        ) : (
          <>
            <View style={styles.circlePurple} />
            <View style={styles.circleMagenta} />
            <View style={styles.circleLarge} />
          </>
        )}

        <BlurView
          intensity={isProfile ? 100 : 80}
          tint="dark"
          style={StyleSheet.absoluteFill}
        />
        {isProfile ? (
          <BlurView
            intensity={100}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ) : null}

        {!isProfile ? (
          <LinearGradient
            colors={["transparent", "rgba(1, 1, 1, 0.6)", colors.background]}
            locations={[0, 0.3, 0.7]}
            style={styles.bottomGradient}
          />
        ) : null}
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  // Default variant circles (Welcome, Login, etc.)
  circlePurple: {
    position: "absolute",
    width: 175,
    height: 175,
    borderRadius: 87.5,
    backgroundColor: colors.purple,
    opacity: 0.7,
    top: SH * 0.08,
    left: -35,
  },
  circleMagenta: {
    position: "absolute",
    width: 248,
    height: 248,
    borderRadius: 124,
    backgroundColor: colors.magenta,
    opacity: 0.5,
    top: SH * 0.05,
    right: -74,
  },
  circleLarge: {
    position: "absolute",
    width: 317,
    height: 317,
    borderRadius: 158.5,
    backgroundColor: colors.purple,
    opacity: 0.7,
    top: SH * 0.4,
    left: (SW - 317) / 2,
  },
  bottomGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: SH * 0.25,
    bottom: 0,
  },
  // Profile variant circles — start below hero, hugging edges, 30-50% off screen
  profileCircleRed: {
    position: "absolute",
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: "#fb0d41",
    opacity: 1,
    top: SH * 0.42,
    left: -175,
  },
  profileCirclePink: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "#da0b9e",
    opacity: 0.9,
    top: SH * 0.52,
    right: -130,
  },
  profileCirclePurple: {
    position: "absolute",
    width: 380,
    height: 380,
    borderRadius: 190,
    backgroundColor: "#7240ff",
    opacity: 0.9,
    top: SH * 0.7,
    left: -115,
  },
});
