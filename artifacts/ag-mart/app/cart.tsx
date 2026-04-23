import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

export default function Cart() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { cart, products, updateCartQty, removeFromCart } = useStore();

  const lineItems = cart
    .map((c) => {
      const p = products.find((pp) => pp.id === c.productId);
      if (!p) return null;
      return { ...c, product: p };
    })
    .filter(Boolean) as { productId: string; qty: number; price: number; product: typeof products[number] }[];

  const subtotal = lineItems.reduce((s, it) => s + it.qty * it.price, 0);
  const marketTotal = lineItems.reduce((s, it) => s + it.qty * it.product.marketPrice, 0);
  const savings = marketTotal - subtotal;
  const delivery = subtotal > 0 ? 1500 : 0;
  const total = subtotal + delivery;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Cart</Text>
        <View style={{ width: 40 }} />
      </View>

      {lineItems.length === 0 ? (
        <EmptyState
          icon="shopping-bag"
          title="Your cart is empty"
          subtitle="Add fresh produce, livestock or inputs to get started."
          ctaTitle="Browse products"
          onCta={() => router.replace("/(tabs)/browse")}
        />
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 220, gap: 12 }}>
            {lineItems.map((it) => (
              <View
                key={it.productId}
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Image source={getImage(it.product.image)} style={styles.thumb} />
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
                    {it.product.name}
                  </Text>
                  <Text style={[styles.meta, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {it.product.location}
                  </Text>
                  <View style={styles.rowFoot}>
                    <Text style={[styles.price, { color: colors.foreground }]}>
                      {formatNaira(it.price * it.qty)}
                    </Text>
                    <View style={[styles.qty, { borderColor: colors.border }]}>
                      <Pressable
                        onPress={() => {
                          if (it.qty <= 1) removeFromCart(it.productId);
                          else updateCartQty(it.productId, it.qty - 1);
                        }}
                        style={styles.qBtn}
                      >
                        <Feather name="minus" size={14} color={colors.foreground} />
                      </Pressable>
                      <Text style={[styles.qVal, { color: colors.foreground }]}>{it.qty}</Text>
                      <Pressable
                        onPress={() => updateCartQty(it.productId, it.qty + 1)}
                        style={styles.qBtn}
                      >
                        <Feather name="plus" size={14} color={colors.foreground} />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </View>
            ))}

            <View
              style={[
                styles.summary,
                { backgroundColor: colors.card, borderColor: colors.border, marginTop: 8 },
              ]}
            >
              <Row label="Subtotal" value={formatNaira(subtotal)} />
              <Row label="Delivery" value={formatNaira(delivery)} />
              <Row label="You save" value={formatNaira(savings)} valueColor={colors.success} />
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Row label="Total" value={formatNaira(total)} bold />
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { backgroundColor: colors.background, borderColor: colors.border, paddingBottom: insets.bottom + 12 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: "Inter_500Medium" }}>
                {lineItems.length} item{lineItems.length === 1 ? "" : "s"}
              </Text>
              <Text style={{ color: colors.foreground, fontSize: 22, fontFamily: "Inter_700Bold" }}>
                {formatNaira(total)}
              </Text>
            </View>
            <Button
              title="Checkout"
              onPress={() => router.push("/checkout")}
              size="lg"
              style={{ flex: 1.4 }}
              icon={<Feather name="arrow-right" size={18} color={colors.primaryForeground} />}
            />
          </View>
        </>
      )}
    </View>
  );
}

function Row({
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
  row: { flexDirection: "row", padding: 12, borderRadius: 14, borderWidth: 1, gap: 12 },
  thumb: { width: 72, height: 72, borderRadius: 12 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  meta: { fontFamily: "Inter_500Medium", fontSize: 12 },
  rowFoot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  price: { fontFamily: "Inter_700Bold", fontSize: 16 },
  qty: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 999 },
  qBtn: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  qVal: { fontFamily: "Inter_700Bold", fontSize: 13, minWidth: 22, textAlign: "center" },
  summary: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 8 },
  sumRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  divider: { height: 1, marginVertical: 4 },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
