import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GlassInput } from "@/components/GlassInput";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii, spacing, typography } from "@/constants/tokens";
import { useSignIn } from "@/features/auth/useSignIn";

const DEMO_EMAIL = "demo@wonhitwonder.com";
const DEMO_PASSWORD = "demo1234";
const TAP_THRESHOLD = 5;

const LoginScreen = () => {
  const router = useRouter();
  const { signIn, isLoading, error } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const tapCount = useRef(0);
  const lastTap = useRef(0);

  const handleTitleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 500) {
      tapCount.current += 1;
    } else {
      tapCount.current = 1;
    }
    lastTap.current = now;

    if (tapCount.current >= TAP_THRESHOLD) {
      tapCount.current = 0;
      setEmail(DEMO_EMAIL);
      setPassword(DEMO_PASSWORD);
      signIn(DEMO_EMAIL, DEMO_PASSWORD);
    }
  }, [signIn]);

  const handleSignIn = useCallback(() => {
    if (!email.trim() || !password) return;
    signIn(email, password);
  }, [email, password, signIn]);

  return (
    <GlassBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.header}>
            <Pressable onPress={handleTitleTap}>
              <Text style={styles.appName}>Won Hit Wonder</Text>
            </Pressable>
            <Text style={styles.headline}>Sign In</Text>
            <Text style={styles.subtitle}>
              Welcome back! Enter your credentials to continue.
            </Text>
          </View>

          <View style={styles.form}>
            <GlassInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              accessibilityLabel="Email address"
            />
            <GlassInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Your password"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              accessibilityLabel="Password"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttonArea}>
              {isLoading ? (
                <ActivityIndicator color={colors.purple} size="large" />
              ) : (
                <GradientButton
                  label="Sign In"
                  onPress={handleSignIn}
                  accessibilityHint="Signs in with your email and password"
                />
              )}
            </View>

            <Pressable
              onPress={() => router.push("/(auth)/forgot-password")}
              accessibilityRole="link"
              accessibilityLabel="Forgot password"
            >
              <Text style={styles.link}>Forgot password?</Text>
            </Pressable>
          </View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            style={styles.outlinedButton}
            onPress={() => router.push("/(auth)/create-account")}
            accessibilityRole="button"
            accessibilityLabel="Create Account"
          >
            <Text style={styles.outlinedButtonText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={styles.demoButton}
            onPress={() => signIn(DEMO_EMAIL, DEMO_PASSWORD)}
            accessibilityRole="button"
            accessibilityLabel="Demo Sign In"
          >
            <Text style={styles.demoButtonText}>
              🎤 Demo Sign In (Charlie Day)
            </Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: 100,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
  },
  appName: {
    color: colors.white,
    ...typography.h4,
    textAlign: "center",
    marginBottom: spacing.xl,
  },
  headline: {
    color: colors.white,
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
  },
  form: {
    gap: spacing.md,
  },
  error: {
    color: colors.red,
    ...typography.bodySmall,
    textAlign: "center",
  },
  buttonArea: {
    marginTop: spacing.sm,
    minHeight: 56,
    justifyContent: "center",
  },
  link: {
    color: colors.blueAlt,
    ...typography.bodySmall,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xl,
    gap: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    ...typography.bodySmall,
  },
  outlinedButton: {
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: radii.lg,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 311,
  },
  outlinedButtonText: {
    color: colors.white,
    ...typography.button,
  },
  demoButton: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.purple,
    borderRadius: radii.lg,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: 311,
    marginTop: spacing.md,
    backgroundColor: "rgba(116, 47, 229, 0.15)",
  },
  demoButtonText: {
    color: colors.purple,
    ...typography.bodySmall,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
