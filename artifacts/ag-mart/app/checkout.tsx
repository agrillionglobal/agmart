import { useState } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { makeId, useStore } from "@/store";
import { Button } from "@/components/Button";
import { formatNaira } from "@/components/lib/format";

type PayMethod = "wallet" | "credit" | "transfer";

export default function Checkout() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, cart, products, placeOrder } = useStore();

  const lineItems = cart
    .map((c) => {
      const p = products.find((pp) => pp.id === c.productId);
      return p ? { ...c, product: p } : null;
    })
    .filter(Boolean) as { productId: string; qty: number; price: number; product: typeof products[number] }[];

  const subtotal = lineItems.reduce((s, it) => s + it.qty * it.price, 0);
  const marketTotal = lineItems.reduce((s, it) => s + it.qty * it.product.marketPrice, 0);
  const savings = marketTotal - subtotal;
  const delivery = 1500;
  const total = subtotal + delivery;
  const pointsEarned = Math.round(total * 0.01);

  const [method, setMethod] = useState<PayMethod>("wallet");
  const [address, setAddress] = useState(`${user?.location || "Lagos"}, Nigeria`);
  const [placing, setPlacing] = useState(false);

  const canPay =
    method === "transfer" ||
    (method === "wallet" && (user?.walletBalance || 0) >= total) ||
    (method === "credit" && (user?.creditLimit || 0) - (user?.creditUsed || 0) >= total);

  const onPlace = async () => {
    if (!canPay || lineItems.length === 0) return;
    setPlacing(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await placeOrder({
      id: `ord_${makeId()}`,
      items: lineItems.map((it) => ({ productId: it.productId, qty: it.qty, price: it.price })),
      total,
      savings,
      status: "processing",
      deliveryAddress: address,
      paymentMethod: method === "wallet" ? "Wallet" : method === "credit" ? "AG Credit" : "Bank Transfer",
      createdAt: new Date().toISOString(),
      agPointsEarned: pointsEarned,
      vendorId: lineItems[0].product.vendorId,
    });
    setPlacing(false);
    router.replace({ pathname: "/order-success", params: { points: String(pointsEarned), savings: String(savings) } });
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Checkout</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 200, gap: 16 }}>
        {/* ESCROW HERO */}
        <View style={[styles.escrow, { backgroundColor: colors.primary }]}>
          <View style={styles.escrowIcon}>
            <Feather name="lock" size={20} color={colors.primaryForeground} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 15 }}>
              Your money is safe with Escrow
            </Text>
            <Text style={{ color: colors.primaryForeground + "DD", fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
              We hold your payment until you confirm delivery. No vendor sees a kobo until you&apos;re happy.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Delivery address</Text>
        <View style={[styles.addrCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="map-pin" size={18} color={colors.primary} />
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="House no, street, city"
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14 }}
            multiline
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment method</Text>
        <View style={{ gap: 10 }}>
          <PayOption
            method="wallet"
            current={method}
            onSelect={setMethod}
            icon="credit-card"
            title="AG Wallet"
            subtitle={`Balance: ${formatNaira(user?.walletBalance || 0)}`}
            disabled={(user?.walletBalance || 0) < total}
            disabledHint="Insufficient balance"
          />
          <PayOption
            method="credit"
            current={method}
            onSelect={setMethod}
            icon="zap"
            title="AG Credit (Buy Now, Pay Later)"
            subtitle={`Available: ${formatNaira((user?.creditLimit || 0) - (user?.creditUsed || 0))}`}
          />
          <PayOption
            method="transfer"
            current={method}
            onSelect={setMethod}
            icon="repeat"
            title="Bank Transfer"
            subtitle="Pay via your bank app"
          />
        </View>

        <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 4 }]}>
            Order summary
          </Text>
          <SumRow label={`Items (${lineItems.length})`} value={formatNaira(subtotal)} />
          <SumRow label="Delivery" value={formatNaira(delivery)} />
          <SumRow label="You save" value={formatNaira(savings)} valueColor={colors.success} />
          <SumRow
            label="AG Points earned"
            value={`+${pointsEarned} pts`}
            valueColor={colors.warning}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <SumRow label="Total" value={formatNaira(total)} bold />
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: colors.background, borderColor: colors.border, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <Button
          title={canPay ? `Pay ${formatNaira(total)}` : "Cannot pay"}
          onPress={onPlace}
          loading={placing}
          disabled={!canPay || lineItems.length === 0}
          size="lg"
        />
      </View>
    </View>
  );
}

function PayOption({
  method,
  current,
  onSelect,
  icon,
  title,
  subtitle,
  disabled,
  disabledHint,
}: {
  method: PayMethod;
  current: PayMethod;
  onSelect: (m: PayMethod) => void;
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  disabled?: boolean;
  disabledHint?: string;
}) {
  const colors = useColors();
  const sel = current === method;
  return (
    <Pressable
      onPress={() => !disabled && onSelect(method)}
      style={[
        styles.payOpt,
        {
          backgroundColor: sel ? colors.primary + "10" : colors.card,
          borderColor: sel ? colors.primary : colors.border,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <View style={[styles.payIcon, { backgroundColor: sel ? colors.primary : colors.muted }]}>
        <Feather name={icon} size={18} color={sel ? colors.primaryForeground : colors.foreground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
          {title}
        </Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
          {disabled && disabledHint ? disabledHint : subtitle}
        </Text>
      </View>
      <Feather
        name={sel ? "check-circle" : "circle"}
        size={22}
        color={sel ? colors.primary : colors.border}
      />
    </Pressable>
  );
}

function SumRow({
  label,
  value,
  bold,
  valueColor,
}: {
  label: string;
  value: string;
  bold?: boolean;
  valueColor?: string;
}) {
  const colors = useColors();
  return (
    <View style={styles.sumRow}>
      <Text
        style={{
          color: bold ? colors.foreground : colors.mutedForeground,
          fontFamily: bold ? "Inter_700Bold" : "Inter_500Medium",
          fontSize: bold ? 16 : 13,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: valueColor || colors.foreground,
          fontFamily: bold ? "Inter_700Bold" : "Inter_600SemiBold",
          fontSize: bold ? 18 : 14,
        }}
      >
        {value}
      </Text>
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
  escrow: { flexDirection: "row", alignItems: "flex-start", gap: 12, padding: 16, borderRadius: 18 },
  escrowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 15 },
  addrCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  payOpt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  payIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  summary: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
  sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  divider: { height: 1, marginVertical: 4 },
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
