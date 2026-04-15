import { StyleSheet, Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";

import { colors, radii, spacing, typography } from "@/constants/tokens";

interface GlassInputProps extends Pick<
  TextInputProps,
  | "value"
  | "onChangeText"
  | "placeholder"
  | "secureTextEntry"
  | "autoCapitalize"
  | "keyboardType"
  | "autoComplete"
  | "textContentType"
> {
  label?: string;
  error?: string | null;
  accessibilityLabel: string;
}

export const GlassInput = ({
  label,
  error,
  accessibilityLabel,
  ...inputProps
}: GlassInputProps) => {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="rgba(255, 255, 255, 0.4)"
        selectionColor={colors.purple}
        accessibilityLabel={accessibilityLabel}
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    color: colors.textSecondary,
    ...typography.bodySmall,
    marginLeft: spacing.xs,
  },
  input: {
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    color: colors.white,
    fontSize: 16,
  },
  inputError: {
    borderColor: colors.red,
  },
  errorText: {
    color: colors.red,
    ...typography.caption,
    marginLeft: spacing.xs,
  },
});
