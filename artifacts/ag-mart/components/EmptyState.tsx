import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Button } from "@/components/Button";

type Icon = React.ComponentProps<typeof Feather>["name"];

export function EmptyState({
  icon = "inbox",
  title,
  subtitle,
  ctaTitle,
  onCta,
}: {
  icon?: Icon;
  title: string;
  subtitle?: string;
  ctaTitle?: string;
  onCta?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: colors.muted }]}>
        <Feather name={icon} size={32} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
      )}
      {ctaTitle && onCta && (
        <Button title={ctaTitle} onPress={onCta} variant="primary" style={{ marginTop: 16 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", padding: 40, gap: 8 },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: { fontFamily: "Inter_700Bold", fontSize: 17, textAlign: "center" },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, textAlign: "center" },
});
