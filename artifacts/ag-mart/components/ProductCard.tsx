import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Product } from "@/store";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";
import { SavingsBadge } from "@/components/SavingsBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";

interface Props {
  product: Product;
  vendorVerified?: boolean;
  variant?: "grid" | "compact";
}

export function ProductCard({ product, vendorVerified, variant = "grid" }: Props) {
  const colors = useColors();
  const router = useRouter();
  const savings = product.marketPrice - product.farmGatePrice;
  const pct = Math.round((savings / product.marketPrice) * 100);
  const compact = variant === "compact";

  return (
    <Pressable
      onPress={() => router.push(`/product/${product.id}`)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          width: compact ? 200 : "100%",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.imageWrap}>
        <Image source={getImage(product.image)} style={styles.image} />
        <View style={[styles.badgeWrap]}>
          <SavingsBadge percent={pct} />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: colors.primary }]}>
            {formatNaira(product.farmGatePrice)}
          </Text>
          <Text style={[styles.market, { color: colors.mutedForeground }]}>
            {formatNaira(product.marketPrice)}
          </Text>
        </View>
        <View style={styles.metaRow}>
          {vendorVerified && <VerifiedBadge size="sm" />}
          <View style={styles.rating}>
            <Feather name="star" size={11} color={colors.warning} />
            <Text style={[styles.ratingText, { color: colors.mutedForeground }]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  imageWrap: { position: "relative", aspectRatio: 1.2 },
  image: { width: "100%", height: "100%" },
  badgeWrap: { position: "absolute", top: 8, left: 8 },
  body: { padding: 10, gap: 6 },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  price: { fontFamily: "Inter_700Bold", fontSize: 16 },
  market: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  metaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontFamily: "Inter_500Medium", fontSize: 11 },
});
