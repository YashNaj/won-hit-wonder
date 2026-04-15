import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const ProfileLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ headerBackTitle: "Profile" }} />
      <Stack.Screen name="[id]" options={{ headerBackTitle: "Back" }} />
      <Stack.Screen
        name="followers"
        options={{
          headerShown: true,
          headerTitle: "Subscribers",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="vote-history"
        options={{
          headerShown: true,
          headerTitle: "Vote History",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerShown: true,
          headerTitle: "Edit Profile",
          headerBackTitle: "Back",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.white,
        }}
      />
    </Stack>
  );
};

export default ProfileLayout;
