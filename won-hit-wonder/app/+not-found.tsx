import { StyleSheet, Text, View } from "react-native";

import { Link, Stack } from "expo-router";

import { colors, typography, spacing } from "@/constants/tokens";

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Text style={styles.title}>Page Not Found</Text>
        <Link href="/(tabs)/home" style={styles.link}>
          <Text style={styles.linkText}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
};

export default NotFoundScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  title: {
    color: colors.white,
    ...typography.h2,
    marginBottom: spacing.lg,
  },
  link: {
    paddingVertical: spacing.md,
  },
  linkText: {
    color: colors.blueAlt,
    ...typography.button,
  },
});
