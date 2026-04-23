import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export function SavingsBadge({ percent }: { percent: number }) {
  const colors = useColors();
  return (
    <View style={[styles.badge, { backgroundColor: colors.success }]}>
      <Feather name="arrow-down" size={10} color="#FFFFFF" />
      <Text style={styles.text}>{percent}% off</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  text: { color: "#FFFFFF", fontFamily: "Inter_700Bold", fontSize: 11 },
});
