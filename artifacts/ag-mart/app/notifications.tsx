import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { EmptyState } from "@/components/EmptyState";

const ICONS: Record<string, React.ComponentProps<typeof Feather>["name"]> = {
  order: "package",
  price: "trending-down",
  credit: "zap",
  promo: "gift",
};

const TINTS: Record<string, string> = {
  order: "primary",
  price: "success",
  credit: "warning",
  promo: "primary",
};

export default function Notifications() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationRead } = useStore();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleTap = (id: string) => {
    markNotificationRead(id);
  };

  const tintFor = (key: string) =>
    key === "success" ? colors.success : key === "warning" ? colors.warning : colors.primary;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 10 }}>
        {notifications.length === 0 ? (
          <EmptyState icon="bell" title="No notifications yet" subtitle="We'll let you know when something happens." />
        ) : (
          notifications.map((n) => {
            const tint = tintFor(TINTS[n.type] || "primary");
            return (
              <Pressable
                key={n.id}
                onPress={() => handleTap(n.id)}
                style={[
                  styles.row,
                  {
                    backgroundColor: n.read ? colors.card : colors.primary + "08",
                    borderColor: n.read ? colors.border : colors.primary + "30",
                  },
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: tint + "1A" }]}>
                  <Feather name={ICONS[n.type] || "bell"} size={18} color={tint} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                      {n.title}
                    </Text>
                    {!n.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 2 }}>
                    {n.body}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 20 },
  row: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
});
