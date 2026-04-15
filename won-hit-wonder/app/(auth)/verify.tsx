import { useCallback, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useRouter } from "expo-router";

import { GlassBackground } from "@/components/GlassBackground";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii, spacing, typography } from "@/constants/tokens";

const CODE_LENGTH = 6;

const VerifyScreen = () => {
  const router = useRouter();
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [error, setError] = useState<string | null>(null);
  const inputs = useRef<(TextInput | null)[]>([]);

  const handleChange = useCallback(
    (text: string, index: number) => {
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);
      setError(null);

      // Auto-advance to next input
      if (text && index < CODE_LENGTH - 1) {
        inputs.current[index + 1]?.focus();
      }
    },
    [code],
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === "Backspace" && !code[index] && index > 0) {
        inputs.current[index - 1]?.focus();
      }
    },
    [code],
  );

  const handleVerify = useCallback(() => {
    const fullCode = code.join("");
    if (fullCode.length < CODE_LENGTH) {
      setError("Please enter the full code");
      return;
    }
    // For demo, accept any 6-digit code
    router.replace("/(auth)/login");
  }, [code, router]);

  const handleResend = useCallback(() => {
    setCode(Array(CODE_LENGTH).fill(""));
    inputs.current[0]?.focus();
  }, []);

  return (
    <GlassBackground>
      <View style={styles.content}>
        <Text style={styles.headline}>Verify Account</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code we sent to your email address.
        </Text>

        {/* OTP input boxes */}
        <View style={styles.codeRow}>
          {code.map((digit, i) => (
            <TextInput
              key={i}
              ref={(ref) => {
                inputs.current[i] = ref;
              }}
              style={[styles.codeBox, digit && styles.codeBoxFilled]}
              value={digit}
              onChangeText={(text) => handleChange(text.slice(-1), i)}
              onKeyPress={({ nativeEvent }) =>
                handleKeyPress(nativeEvent.key, i)
              }
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              accessibilityLabel={`Verification code digit ${i + 1}`}
            />
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <GradientButton
          label="Verify"
          onPress={handleVerify}
          accessibilityHint="Verifies your account with the entered code"
        />

        <Pressable
          onPress={handleResend}
          style={styles.resendBtn}
          accessibilityRole="button"
          accessibilityLabel="Resend verification code"
        >
          <Text style={styles.resendText}>
            Didn't receive it?{" "}
            <Text style={styles.resendLink}>Resend Code</Text>
          </Text>
        </Pressable>
      </View>
    </GlassBackground>
  );
};

export default VerifyScreen;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: 120,
    gap: spacing.lg,
  },
  headline: {
    color: colors.white,
    ...typography.h2,
  },
  subtitle: {
    color: colors.textSecondary,
    ...typography.body,
    lineHeight: 20,
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  codeBoxFilled: {
    borderColor: colors.purple,
    backgroundColor: "rgba(116, 47, 229, 0.15)",
  },
  error: {
    color: colors.red,
    ...typography.bodySmall,
    textAlign: "center",
  },
  resendBtn: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  resendText: {
    color: colors.textSecondary,
    ...typography.body,
  },
  resendLink: {
    color: colors.blueAlt,
    fontWeight: "600",
  },
});
