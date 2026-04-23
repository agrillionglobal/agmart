import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

export function VerifiedBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const colors = useColors();
  const sm = size === "sm";
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.primary + "1A",
          paddingHorizontal: sm ? 6 : 8,
          paddingVertical: sm ? 2 : 4,
        },
      ]}
    >
      <Feather name="check-circle" size={sm ? 10 : 12} color={colors.primary} />
      <Text style={[styles.text, { color: colors.primary, fontSize: sm ? 10 : 11 }]}>
        Verified
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 999 },
  text: { fontFamily: "Inter_600SemiBold" },
});
