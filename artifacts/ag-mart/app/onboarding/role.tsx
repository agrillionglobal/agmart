import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { Button } from "@/components/Button";
import { Role, useStore } from "@/store";

const ROLES: {
  id: Role;
  title: string;
  body: string;
  icon: React.ComponentProps<typeof Feather>["name"];
}[] = [
  { id: "buyer", title: "Buyer", body: "Shop fresh produce at farm gate prices.", icon: "shopping-bag" },
  { id: "farmer", title: "Farmer", body: "Sell your harvest direct to thousands.", icon: "sun" },
  { id: "vendor", title: "Vendor", body: "List your inputs and reach more buyers.", icon: "shopping-cart" },
];

export default function RoleScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser, setOnboarded } = useStore();
  const [selected, setSelected] = useState<Role>("buyer");

  const finish = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateUser({ role: selected });
    await setOnboarded(true);
    router.replace("/");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrap,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>How will you use AG Mart?</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        We&apos;ll personalize your dashboard. You can switch later.
      </Text>

      <View style={styles.list}>
        {ROLES.map((r) => {
          const sel = selected === r.id;
          return (
            <Pressable
              key={r.id}
              onPress={() => {
                Haptics.selectionAsync();
                setSelected(r.id);
              }}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: sel ? colors.primary + "10" : colors.card,
                  borderColor: sel ? colors.primary : colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: sel ? colors.primary : colors.muted },
                ]}
              >
                <Feather
                  name={r.icon}
                  size={22}
                  color={sel ? colors.primaryForeground : colors.foreground}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{r.title}</Text>
                <Text style={[styles.cardBody, { color: colors.mutedForeground }]}>{r.body}</Text>
              </View>
              {sel && <Feather name="check-circle" size={22} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>

      <View style={{ marginTop: "auto", paddingTop: 24 }}>
        <Button title="Continue" onPress={finish} size="lg" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexGrow: 1, paddingHorizontal: 24, gap: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginBottom: 16 },
  list: { gap: 12 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  cardBody: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
});
