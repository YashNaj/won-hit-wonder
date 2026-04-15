import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GlassInput } from "@/components/GlassInput";
import { GradientButton } from "@/components/GradientButton";
import { colors, spacing, typography } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = useCallback(async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    setIsLoading(true);
    setError(null);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
    );
    if (resetError) {
      setError(resetError.message);
    } else {
      setSent(true);
    }
    setIsLoading(false);
  }, [email]);

  return (
    <GlassBackground>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.content}>
          <Text style={styles.headline}>Forgot Password</Text>

          {sent ? (
            <View style={styles.sentBox}>
              <Text style={styles.sentEmoji}>📧</Text>
              <Text style={styles.sentTitle}>Check your email</Text>
              <Text style={styles.sentBody}>
                We've sent a password reset link to {email}
              </Text>
              <Pressable
                onPress={() => router.back()}
                accessibilityRole="button"
                accessibilityLabel="Back to login"
              >
                <Text style={styles.backLink}>Back to Sign In</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Text style={styles.subtitle}>
                Enter your email address and we'll send you a link to reset your
                password.
              </Text>

              <View style={styles.form}>
                <GlassInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  accessibilityLabel="Email address"
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={styles.buttonArea}>
                  {isLoading ? (
                    <ActivityIndicator color={colors.purple} size="large" />
                  ) : (
                    <GradientButton
                      label="Send Reset Link"
                      onPress={handleReset}
                      accessibilityHint="Sends a password reset email"
                    />
                  )}
                </View>
              </View>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 120,
  },
  headline: {
    color: colors.white,
    ...typography.h2,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
    marginBottom: spacing.xl,
    lineHeight: 20,
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
  sentBox: {
    alignItems: "center",
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  sentEmoji: {
    fontSize: 48,
  },
  sentTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  sentBody: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: "center",
    lineHeight: 20,
  },
  backLink: {
    color: colors.blueAlt,
    fontSize: 14,
    fontWeight: "600",
    marginTop: spacing.md,
  },
});
