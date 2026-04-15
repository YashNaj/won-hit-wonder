import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const HomeLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="stream/[id]"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
