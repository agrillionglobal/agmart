import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Order } from "@/store";

const labels: Record<Order["status"], string> = {
  processing: "Processing",
  in_transit: "In Transit",
  delivered: "Delivered",
};

export function StatusPill({ status }: { status: Order["status"] }) {
  const colors = useColors();
  const color =
    status === "delivered"
      ? colors.success
      : status === "in_transit"
        ? colors.warning
        : colors.primary;
  return (
    <View style={[styles.pill, { backgroundColor: color + "1A", borderColor: color }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{labels[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
});
