import { View, Text, StyleSheet } from "react-native";

export default function ProgressBar({ value = 0 }) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: `${safeValue}%` }]}>
        {safeValue > 10 && <Text style={styles.text}>{safeValue}%</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginVertical: 6,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#63be3f",
    paddingRight: 8,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  text: {
    fontSize: 10,
    fontWeight: 600,
    color: "white",
  },
});
