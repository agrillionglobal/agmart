import { Pressable, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

type Icon = React.ComponentProps<typeof Feather>["name"];

export function CategoryChip({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: Icon;
  selected?: boolean;
  onPress?: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: selected ? colors.primary : colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {icon && (
        <Feather
          name={icon}
          size={14}
          color={selected ? colors.primaryForeground : colors.foreground}
        />
      )}
      <Text
        style={[
          styles.text,
          { color: selected ? colors.primaryForeground : colors.foreground },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: { fontFamily: "Inter_600SemiBold", fontSize: 13 },
});
