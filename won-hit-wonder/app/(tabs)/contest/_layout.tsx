import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const ContestLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="upload" />
      <Stack.Screen name="rules" />
      <Stack.Screen name="streamer" options={{ gestureEnabled: false }} />
      <Stack.Screen name="record" options={{ gestureEnabled: false }} />
      <Stack.Screen name="trim" />
      <Stack.Screen name="share" options={{ gestureEnabled: false }} />
    </Stack>
  );
};

export default ContestLayout;
