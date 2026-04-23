import { useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

const TABS = ["Active", "Completed", "All"] as const;

export default function Orders() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { orders, products } = useStore();
  const [tab, setTab] = useState<(typeof TABS)[number]>("Active");

  const filtered = orders.filter((o) => {
    if (tab === "Active") return ["processing", "in_transit"].includes(o.status);
    if (tab === "Completed") return ["delivered"].includes(o.status);
    return true;
  });

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const tabPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={{ paddingHorizontal: 20, paddingTop: 8 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>My Orders</Text>
        <View style={[styles.tabRow, { backgroundColor: colors.muted }]}>
          {TABS.map((t) => (
            <Pressable
              key={t}
              onPress={() => setTab(t)}
              style={[
                styles.tab,
                tab === t && { backgroundColor: colors.background, shadowOpacity: 0.06 },
              ]}
            >
              <Text
                style={{
                  fontFamily: tab === t ? "Inter_700Bold" : "Inter_500Medium",
                  color: tab === t ? colors.foreground : colors.mutedForeground,
                  fontSize: 13,
                }}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: tabPad, gap: 12 }}>
        {filtered.length === 0 ? (
          <EmptyState
            icon="package"
            title={tab === "Completed" ? "No completed orders yet" : "No orders here"}
            subtitle="Browse the marketplace to start saving."
            ctaTitle="Browse products"
            onCta={() => router.push("/(tabs)/browse")}
          />
        ) : (
          filtered.map((o) => {
            const firstItem = o.items[0];
            const product = products.find((p) => p.id === firstItem?.productId);
            return (
              <Pressable
                key={o.id}
                onPress={() => router.push(`/orders/${o.id}`)}
                style={({ pressed }) => [
                  styles.card,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.9 : 1 },
                ]}
              >
                <Image source={getImage(product?.image || "tomatoes")} style={styles.thumb} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.orderId, { color: colors.mutedForeground }]}>
                      Order #{o.id.slice(-6).toUpperCase()}
                    </Text>
                    <StatusPill status={o.status} />
                  </View>
                  <Text style={[styles.itemTitle, { color: colors.foreground }]} numberOfLines={1}>
                    {product?.name || firstItem?.name}
                    {o.items.length > 1 ? ` +${o.items.length - 1} more` : ""}
                  </Text>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[styles.price, { color: colors.foreground }]}>{formatNaira(o.total)}</Text>
                    <Text style={[styles.date, { color: colors.mutedForeground }]}>
                      {new Date(o.createdAt).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                    </Text>
                  </View>
                  {o.status === "delivered" ? (
                    <View style={[styles.escrow, { backgroundColor: colors.success + "1A" }]}>
                      <Feather name="check-circle" size={11} color={colors.success} />
                      <Text style={{ color: colors.success, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
                        Funds released to vendor
                      </Text>
                    </View>
                  ) : (
                    <View style={[styles.escrow, { backgroundColor: colors.primary + "1A" }]}>
                      <Feather name="lock" size={11} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontSize: 11, fontFamily: "Inter_600SemiBold" }}>
                        Escrow locked
                      </Text>
                    </View>
                  )}
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
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5, marginBottom: 16 },
  tabRow: { flexDirection: "row", padding: 4, borderRadius: 12 },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 10 },
  card: { flexDirection: "row", padding: 12, borderRadius: 16, borderWidth: 1, gap: 12 },
  thumb: { width: 72, height: 72, borderRadius: 12 },
  orderId: { fontFamily: "Inter_500Medium", fontSize: 11 },
  itemTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  price: { fontFamily: "Inter_700Bold", fontSize: 16 },
  date: { fontFamily: "Inter_500Medium", fontSize: 12 },
  escrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 2,
  },
});
