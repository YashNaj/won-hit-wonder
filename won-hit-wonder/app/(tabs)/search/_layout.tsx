import { Stack } from "expo-router";

import { colors } from "@/constants/tokens";

const SearchLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
};

export default SearchLayout;
