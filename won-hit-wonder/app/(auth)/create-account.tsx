import { useCallback, useState } from "react";
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
import { colors, spacing, typography } from "@/constants/tokens";
import { useSignUp } from "@/features/auth/useSignUp";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const validate = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
): FormErrors => {
  const errors: FormErrors = {};
  if (!firstName.trim()) errors.firstName = "Required";
  if (!lastName.trim()) errors.lastName = "Required";
  if (!email.trim()) errors.email = "Required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email";
  if (!password) errors.password = "Required";
  else if (password.length < 6) errors.password = "Min 6 characters";
  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords don't match";
  return errors;
};

const CreateAccountScreen = () => {
  const router = useRouter();
  const { signUp, isLoading, error } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleCreate = useCallback(() => {
    const errors = validate(
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    );
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    signUp(email, password, `${firstName.trim()} ${lastName.trim()}`);
  }, [firstName, lastName, email, password, confirmPassword, signUp]);

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
            <Text style={styles.headline}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join the contest and show off your talent!
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.halfField}>
                <GlassInput
                  label="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First"
                  autoCapitalize="words"
                  error={formErrors.firstName}
                  accessibilityLabel="First name"
                />
              </View>
              <View style={styles.halfField}>
                <GlassInput
                  label="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last"
                  autoCapitalize="words"
                  error={formErrors.lastName}
                  accessibilityLabel="Last name"
                />
              </View>
            </View>

            <GlassInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={formErrors.email}
              accessibilityLabel="Email address"
            />
            <GlassInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Min 6 characters"
              secureTextEntry
              autoCapitalize="none"
              error={formErrors.password}
              accessibilityLabel="Password"
            />
            <GlassInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Re-enter password"
              secureTextEntry
              autoCapitalize="none"
              error={formErrors.confirmPassword}
              accessibilityLabel="Confirm password"
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttonArea}>
              {isLoading ? (
                <ActivityIndicator color={colors.purple} size="large" />
              ) : (
                <GradientButton
                  label="Create Account"
                  onPress={handleCreate}
                  accessibilityHint="Creates your account and signs you in"
                />
              )}
            </View>
          </View>

          <Pressable
            onPress={() => router.back()}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Sign In"
          >
            <Text style={styles.signInLink}>
              Already have an account?{" "}
              <Text style={styles.signInLinkBold}>Sign In</Text>
            </Text>
          </Pressable>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </GlassBackground>
  );
};

export default CreateAccountScreen;

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
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  halfField: {
    flex: 1,
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
  signInLink: {
    color: colors.textSecondary,
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.xl,
  },
  signInLinkBold: {
    color: colors.blueAlt,
    fontWeight: "600",
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
