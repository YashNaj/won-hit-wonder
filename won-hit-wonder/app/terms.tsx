import { StyleSheet, Text, View } from "react-native";

import { Stack } from "expo-router";

import { colors, typography } from "@/constants/tokens";

const TermsScreen = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Terms & Conditions",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
        }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Terms & Conditions</Text>
      </View>
    </>
  );
};

export default TermsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.white,
    ...typography.h2,
  },
});
