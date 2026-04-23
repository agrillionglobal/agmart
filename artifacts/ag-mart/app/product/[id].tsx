import { useState } from "react";
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { SavingsBadge } from "@/components/SavingsBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

export default function ProductDetail() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { products, vendors, addToCart, cart } = useStore();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
          Product not found
        </Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>Go back</Text>
        </Pressable>
      </View>
    );
  }
  const vendor = vendors.find((v) => v.id === product.vendorId);
  const savings = product.marketPrice - product.farmGatePrice;
  const pct = Math.round((savings / product.marketPrice) * 100);
  const inCart = cart.some((c) => c.productId === product.id);

  const onAdd = async () => {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await addToCart({ productId: product.id, qty, price: product.farmGatePrice });
    router.push("/cart");
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 + insets.bottom }}>
        <View style={[styles.imgWrap, { paddingTop: topPad + 8 }]}>
          <Image source={getImage(product.image)} style={styles.image} />
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: colors.background, top: topPad + 16 }]}
          >
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <View style={[styles.savingsBadge, { top: topPad + 16 }]}>
            <SavingsBadge percent={pct} />
          </View>
        </View>

        <View style={styles.body}>
          <Text style={[styles.cat, { color: colors.primary }]}>{product.category}</Text>
          <Text style={[styles.name, { color: colors.foreground }]}>{product.name}</Text>

          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.foreground }]}>
              {formatNaira(product.farmGatePrice)}
            </Text>
            <Text style={[styles.market, { color: colors.mutedForeground }]}>
              {formatNaira(product.marketPrice)}
            </Text>
            <View style={[styles.saveLabel, { backgroundColor: colors.success + "1A" }]}>
              <Text style={{ color: colors.success, fontFamily: "Inter_700Bold", fontSize: 12 }}>
                Save {formatNaira(savings)}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Feather name="map-pin" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {product.location}
              </Text>
            </View>
            <View style={styles.meta}>
              <Feather name="star" size={13} color={colors.warning} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {product.rating.toFixed(1)} rating
              </Text>
            </View>
            <View style={styles.meta}>
              <Feather name="package" size={13} color={colors.mutedForeground} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
                {product.qty} available
              </Text>
            </View>
          </View>

          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>About</Text>
            <Text style={[styles.descBody, { color: colors.mutedForeground }]}>
              {product.description}
            </Text>
          </View>

          {vendor && (
            <Pressable
              onPress={() => router.push(`/vendor/${vendor.id}`)}
              style={[styles.vendor, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Image source={getImage(vendor.avatar)} style={styles.vAvatar} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={[styles.vName, { color: colors.foreground }]}>{vendor.name}</Text>
                  {vendor.verified && <VerifiedBadge size="sm" />}
                </View>
                <Text style={[styles.vMeta, { color: colors.mutedForeground }]}>
                  {vendor.location} · {vendor.totalSales} sales · ★ {vendor.rating.toFixed(1)}
                </Text>
              </View>
              <Pressable
                onPress={() => router.push(`/chat/${vendor.id}`)}
                style={[styles.chatBtn, { backgroundColor: colors.primary + "1A" }]}
              >
                <Feather name="message-circle" size={18} color={colors.primary} />
              </Pressable>
            </Pressable>
          )}

          <View style={[styles.trustStrip, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
            <Feather name="shield" size={18} color={colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 13 }}>
                Escrow Protected
              </Text>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 }}>
                We hold your payment until you confirm delivery
              </Text>
            </View>
          </View>

          <View style={styles.qtyRow}>
            <Text style={[styles.qtyLabel, { color: colors.foreground }]}>Quantity</Text>
            <View style={[styles.qtyCtl, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Pressable onPress={() => setQty(Math.max(1, qty - 1))} style={styles.qtyBtn}>
                <Feather name="minus" size={16} color={colors.foreground} />
              </Pressable>
              <Text style={[styles.qtyVal, { color: colors.foreground }]}>{qty}</Text>
              <Pressable onPress={() => setQty(Math.min(product.qty, qty + 1))} style={styles.qtyBtn}>
                <Feather name="plus" size={16} color={colors.foreground} />
              </Pressable>
            </View>
          </View>
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
            Total
          </Text>
          <Text style={{ color: colors.foreground, fontSize: 22, fontFamily: "Inter_700Bold" }}>
            {formatNaira(product.farmGatePrice * qty)}
          </Text>
        </View>
        <Button
          title={inCart ? "Update Cart" : "Add to Cart"}
          onPress={onAdd}
          size="lg"
          style={{ flex: 1.5 }}
          icon={<Feather name="shopping-bag" size={18} color={colors.primaryForeground} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  imgWrap: { width: "100%", aspectRatio: 1, position: "relative" },
  image: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  savingsBadge: { position: "absolute", right: 16 },
  body: { padding: 20, gap: 12 },
  cat: { fontFamily: "Inter_600SemiBold", fontSize: 12, letterSpacing: 1, textTransform: "uppercase" },
  name: { fontFamily: "Inter_700Bold", fontSize: 24, letterSpacing: -0.5 },
  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  price: { fontFamily: "Inter_700Bold", fontSize: 28 },
  market: { fontFamily: "Inter_500Medium", fontSize: 16, textDecorationLine: "line-through" },
  saveLabel: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 999 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 14, marginTop: 4 },
  meta: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontFamily: "Inter_500Medium", fontSize: 12 },
  section: { padding: 14, borderRadius: 14, borderWidth: 1, gap: 8 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 14 },
  descBody: { fontFamily: "Inter_400Regular", fontSize: 13, lineHeight: 20 },
  vendor: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  vAvatar: { width: 44, height: 44, borderRadius: 22 },
  vName: { fontFamily: "Inter_700Bold", fontSize: 14 },
  vMeta: { fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 },
  chatBtn: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  trustStrip: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  qtyRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  qtyLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  qtyCtl: { flexDirection: "row", alignItems: "center", borderRadius: 999, borderWidth: 1 },
  qtyBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  qtyVal: { fontFamily: "Inter_700Bold", fontSize: 16, minWidth: 32, textAlign: "center" },
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
