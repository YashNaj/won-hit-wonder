import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/constants/tokens";

const GrandPrizeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grand Prize</Text>
    </View>
  );
};

export default GrandPrizeScreen;

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
