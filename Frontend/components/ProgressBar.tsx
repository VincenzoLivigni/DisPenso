import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { style } from "../styles/generics";

// proprietà componente
type ProgressBarProps = {
  value?: number; // percentuale 0/100
  size?: number;  // dimensioni cerchio
  strokeWidth?: number; // spessore barra
};

export default function ProgressBar({
  value = 0,
  size = 100,
  strokeWidth = 12,

}: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, Number(value) || 0));

  // calcolo raggio del cerchio.
  const radius = (size - strokeWidth) / 2;
  //calcolo la circonferenza cerchio
  const circumference = 2 * Math.PI * radius;
  const progress = (safeValue / 100) * circumference;

  return (
    <View style={[styles.container, { width: size, height: size }]}>

      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>

        {/* cerchio sfondo */}
        <Circle
          cx={size / 2} // coordinata orizzontale del centro
          cy={size / 2} // cordinata verticale del centro
          r={radius}    // raggio del cerchio
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* progresso */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#63be3f"
          strokeWidth={strokeWidth}
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

      </Svg>

      <Text style={styles.text}>{Math.round(safeValue)}%</Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: style.fontSize.md,
    fontWeight: "600",
    color: style.colors.text,
  },
});