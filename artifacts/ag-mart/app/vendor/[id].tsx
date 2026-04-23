import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getImage } from "@/components/lib/images";

export default function VendorProfile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { vendors, products } = useStore();
  const vendor = vendors.find((v) => v.id === id);

  if (!vendor) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
          Vendor not found
        </Text>
      </View>
    );
  }

  const vendorProducts = products.filter((p) => p.vendorId === vendor.id);
  const yearsOnPlatform = Math.max(1, new Date().getFullYear() - new Date(vendor.joinedAt).getFullYear());

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        <View style={[styles.cover, { backgroundColor: colors.primary, paddingTop: topPad + 16 }]}>
          <Pressable
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.25)" }]}
          >
            <Feather name="arrow-left" size={20} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.profileWrap}>
          <Image source={getImage(vendor.avatar)} style={[styles.avatar, { borderColor: colors.background }]} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22 }}>
              {vendor.name}
            </Text>
            {vendor.verified && <VerifiedBadge />}
          </View>
          <View style={{ flexDirection: "row", gap: 4, alignItems: "center", marginTop: 4 }}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>
              {vendor.location} · Joined {yearsOnPlatform}+ year{yearsOnPlatform > 1 ? "s" : ""} ago
            </Text>
          </View>

          <View style={[styles.statRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Stat label="Rating" value={vendor.rating.toFixed(1)} icon="star" tint={colors.warning} />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <Stat label="Sales" value={vendor.totalSales.toLocaleString()} icon="package" tint={colors.primary} />
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <Stat label="Listings" value={String(vendorProducts.length)} icon="grid" tint={colors.success} />
          </View>

          <View style={{ flexDirection: "row", gap: 10, width: "100%", marginTop: 16 }}>
            <Button
              title="Message"
              onPress={() => router.push(`/chat/${vendor.id}`)}
              variant="outline"
              style={{ flex: 1 }}
              icon={<Feather name="message-circle" size={16} color={colors.primary} />}
            />
            <Button
              title="Follow"
              onPress={() => {}}
              style={{ flex: 1 }}
              icon={<Feather name="user-plus" size={16} color={colors.primaryForeground} />}
            />
          </View>

          {vendor.verified && (
            <View style={[styles.verifiedNotice, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <Feather name="shield" size={18} color={colors.primary} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 13 }}>
                  AG Verified Vendor
                </Text>
                <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 }}>
                  Identity, farm and bank details verified by AG Mart Trust.
                </Text>
              </View>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Listings</Text>
        <View style={styles.grid}>
          {vendorProducts.map((p) => (
            <View key={p.id} style={{ width: "48%" }}>
              <ProductCard product={p} vendorVerified={vendor.verified} />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function Stat({
  label,
  value,
  icon,
  tint,
}: {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  tint: string;
}) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: "center", gap: 4 }}>
      <Feather name={icon} size={16} color={tint} />
      <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 }}>{value}</Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  cover: { height: 140, paddingHorizontal: 16 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  profileWrap: { paddingHorizontal: 20, alignItems: "center", marginTop: -50 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4 },
  statRow: {
    flexDirection: "row",
    width: "100%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  statDivider: { width: 1, marginHorizontal: 4 },
  verifiedNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 16,
  },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, paddingHorizontal: 20, marginTop: 24 },
  grid: { padding: 20, flexDirection: "row", flexWrap: "wrap", gap: 12 },
});
