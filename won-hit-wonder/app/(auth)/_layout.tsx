import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTransparent: true,
        headerTintColor: colors.white,
        headerTitle: "",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="create-account" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="verify" />
    </Stack>
  );
};

export default AuthLayout;
