import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "@/constants/tokens";

const AllAccessPassScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Access Pass</Text>
    </View>
  );
};

export default AllAccessPassScreen;

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
