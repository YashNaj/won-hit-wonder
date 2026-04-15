import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/constants/tokens";

const TrimScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trim Video</Text>
    </View>
  );
};

export default TrimScreen;

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
