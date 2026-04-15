import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const ModalsLayout = () => {
  return (
    <Stack
      screenOptions={{
        presentation: "modal",
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.white,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="notifications"
        options={{ headerTitle: "Notifications" }}
      />
      <Stack.Screen name="settings" options={{ headerTitle: "Settings" }} />
    </Stack>
  );
};

export default ModalsLayout;
