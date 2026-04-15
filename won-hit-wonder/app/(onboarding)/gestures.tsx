import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/constants/tokens";

const GesturesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestures</Text>
    </View>
  );
};

export default GesturesScreen;

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
