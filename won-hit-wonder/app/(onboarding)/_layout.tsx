import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const OnboardingLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="grand-prize" />
      <Stack.Screen name="gestures" />
      <Stack.Screen name="location" />
      <Stack.Screen name="all-access-pass" />
    </Stack>
  );
};

export default OnboardingLayout;
