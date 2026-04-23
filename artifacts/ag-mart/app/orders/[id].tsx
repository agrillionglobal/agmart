import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { Order, useStore } from "@/store";
import { Button } from "@/components/Button";
import { StatusPill } from "@/components/StatusPill";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

const STEPS: { key: Order["status"]; label: string; icon: React.ComponentProps<typeof Feather>["name"] }[] = [
  { key: "processing", label: "Order placed", icon: "clipboard" },
  { key: "in_transit", label: "On the way", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "check-circle" },
];

export default function OrderDetail() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { orders, products, vendors, updateOrderStatus } = useStore();

  const order = orders.find((o) => o.id === id);
  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
          Order not found
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }
  const vendor = vendors.find((v) => v.id === order.vendorId);
  const stepIdx = STEPS.findIndex((s) => s.key === order.status);

  const onConfirm = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await updateOrderStatus(order.id, "delivered");
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Order #{order.id.slice(-6).toUpperCase()}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140, gap: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>
            Placed {new Date(order.createdAt).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}
          </Text>
          <StatusPill status={order.status} />
        </View>

        {/* Tracking timeline */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tracking</Text>
          <View style={{ marginTop: 12 }}>
            {STEPS.map((s, i) => {
              const done = i <= stepIdx;
              const active = i === stepIdx;
              return (
                <View key={s.key} style={styles.step}>
                  <View style={styles.stepLeft}>
                    <View
                      style={[
                        styles.stepDot,
                        {
                          backgroundColor: done ? colors.primary : colors.muted,
                          borderColor: active ? colors.primary : "transparent",
                        },
                      ]}
                    >
                      <Feather
                        name={s.icon}
                        size={14}
                        color={done ? colors.primaryForeground : colors.mutedForeground}
                      />
                    </View>
                    {i < STEPS.length - 1 && (
                      <View
                        style={[
                          styles.stepLine,
                          { backgroundColor: i < stepIdx ? colors.primary : colors.muted },
                        ]}
                      />
                    )}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 18 }}>
                    <Text
                      style={{
                        color: done ? colors.foreground : colors.mutedForeground,
                        fontFamily: done ? "Inter_700Bold" : "Inter_500Medium",
                        fontSize: 14,
                      }}
                    >
                      {s.label}
                    </Text>
                    {active && (
                      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
                        Estimated arrival in 2–3 days
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Map placeholder */}
        <View style={[styles.mapCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <View style={styles.mapPin}>
            <Feather name="navigation" size={28} color={colors.primary} />
          </View>
          <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
            En route from {vendor?.location || "Farm"} to {order.deliveryAddress.split(",")[0]}
          </Text>
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
            Live tracking will activate when courier picks up
          </Text>
        </View>

        {/* Items */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Items</Text>
          {order.items.map((it, idx) => {
            const p = products.find((pp) => pp.id === it.productId);
            return (
              <View key={idx} style={styles.itemRow}>
                <Image source={getImage(p?.image || "tomatoes")} style={styles.itemThumb} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }} numberOfLines={1}>
                    {p?.name || "Item"}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
                    Qty {it.qty} · {formatNaira(it.price)}
                  </Text>
                </View>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                  {formatNaira(it.qty * it.price)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Delivery & Payment */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, gap: 8 }]}>
          <Detail icon="map-pin" label="Delivery" value={order.deliveryAddress} />
          <Detail icon="credit-card" label="Paid via" value={order.paymentMethod} />
          <Detail icon="zap" label="AG Points earned" value={`+${order.agPointsEarned}`} />
          <Detail icon="trending-up" label="You saved" value={formatNaira(order.savings)} />
        </View>

        {/* Escrow */}
        <View
          style={[
            styles.escrow,
            {
              backgroundColor: order.status === "delivered" ? colors.success + "1A" : colors.primary + "1A",
              borderColor: order.status === "delivered" ? colors.success : colors.primary,
            },
          ]}
        >
          <Feather
            name={order.status === "delivered" ? "check-circle" : "lock"}
            size={20}
            color={order.status === "delivered" ? colors.success : colors.primary}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: order.status === "delivered" ? colors.success : colors.primary,
                fontFamily: "Inter_700Bold",
                fontSize: 14,
              }}
            >
              {order.status === "delivered" ? "Funds released to vendor" : "Escrow lock active"}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 }}>
              {order.status === "delivered"
                ? "You confirmed delivery. Vendor has been paid."
                : `${formatNaira(order.total)} held safely until you confirm delivery.`}
            </Text>
          </View>
        </View>

        {vendor && (
          <Pressable
            onPress={() => router.push(`/chat/${vendor.id}`)}
            style={[styles.contact, { borderColor: colors.border, backgroundColor: colors.card }]}
          >
            <Feather name="message-circle" size={18} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 14 }}>
              Chat with {vendor.name}
            </Text>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} style={{ marginLeft: "auto" }} />
          </Pressable>
        )}
      </ScrollView>

      {order.status === "in_transit" && (
        <View
          style={[
            styles.footer,
            { backgroundColor: colors.background, borderColor: colors.border, paddingBottom: insets.bottom + 12 },
          ]}
        >
          <Button
            title="Confirm delivery & release funds"
            onPress={onConfirm}
            size="lg"
            icon={<Feather name="check" size={18} color={colors.primaryForeground} />}
          />
        </View>
      )}
    </View>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  value: string;
}) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
      <Feather name={icon} size={16} color={colors.mutedForeground} />
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, width: 110 }}>
        {label}
      </Text>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 13, flex: 1 }} numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 18 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 14 },
  step: { flexDirection: "row", gap: 12 },
  stepLeft: { alignItems: "center" },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  stepLine: { width: 2, flex: 1, marginVertical: 2 },
  mapCard: { padding: 20, borderRadius: 16, borderWidth: 1, alignItems: "center", gap: 4 },
  mapPin: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  itemThumb: { width: 48, height: 48, borderRadius: 10 },
  escrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
