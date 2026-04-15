import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/constants/tokens";

const LocationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location</Text>
    </View>
  );
};

export default LocationScreen;

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
