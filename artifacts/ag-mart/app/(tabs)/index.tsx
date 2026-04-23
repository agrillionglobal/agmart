import { useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { ProductCard } from "@/components/ProductCard";
import { CategoryChip } from "@/components/CategoryChip";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

const CATS: { label: string; icon: React.ComponentProps<typeof Feather>["name"] }[] = [
  { label: "Crops", icon: "feather" },
  { label: "Livestock", icon: "github" },
  { label: "Fishery", icon: "anchor" },
  { label: "Farm Inputs", icon: "droplet" },
  { label: "Bundles", icon: "package" },
];

export default function Home() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, products, vendors, notifications, cart } = useStore();
  const [refreshing, setRefreshing] = useState(false);

  const unread = notifications.filter((n) => !n.read).length;
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const featured = [...products]
    .map((p) => ({ p, save: (p.marketPrice - p.farmGatePrice) / p.marketPrice }))
    .sort((a, b) => b.save - a.save)
    .slice(0, 6)
    .map((x) => x.p);
  const trustedVendors = vendors.filter((v) => v.verified).slice(0, 8);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const tabPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: tabPad }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={[styles.hello, { color: colors.mutedForeground }]}>
              Hi, {user?.name?.split(" ")[0] || "there"}
            </Text>
            <Text style={[styles.location, { color: colors.foreground }]}>
              <Feather name="map-pin" size={12} color={colors.primary} /> {user?.location || "Nigeria"}
            </Text>
          </View>
          <View style={styles.topRight}>
            <Pressable
              onPress={() => router.push("/cart")}
              style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="shopping-bag" size={18} color={colors.foreground} />
              {cartCount > 0 && (
                <View style={[styles.dotBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.dotText}>{cartCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => router.push("/notifications")}
              style={[styles.iconBtn, { backgroundColor: colors.muted }]}
            >
              <Feather name="bell" size={18} color={colors.foreground} />
              {unread > 0 && (
                <View style={[styles.dotBadge, { backgroundColor: colors.destructive }]}>
                  <Text style={styles.dotText}>{unread}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Wallet Strip */}
        <View style={styles.walletStrip}>
          <Pressable
            onPress={() => router.push("/wallet")}
            style={[styles.walletItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.walletLabel, { color: colors.mutedForeground }]}>Wallet</Text>
            <Text style={[styles.walletValue, { color: colors.foreground }]}>
              {formatNaira(user?.walletBalance || 0)}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/wallet")}
            style={[styles.walletItem, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.walletLabel, { color: colors.mutedForeground }]}>AG Points</Text>
            <View style={styles.pointsRow}>
              <Feather name="zap" size={14} color={colors.warning} />
              <Text style={[styles.walletValue, { color: colors.foreground }]}>
                {user?.agPoints || 0}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Search */}
        <Pressable
          onPress={() => router.push("/(tabs)/browse")}
          style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <Text style={[styles.searchText, { color: colors.mutedForeground }]}>
            Search produce, livestock, inputs…
          </Text>
        </Pressable>

        {/* Savings hero */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <View style={styles.heroSparkle}>
            <Feather name="trending-up" size={20} color={colors.primaryForeground} />
          </View>
          <Text style={[styles.heroLabel, { color: colors.primaryForeground + "CC" }]}>
            You&apos;ve saved
          </Text>
          <Text style={[styles.heroAmount, { color: colors.primaryForeground }]}>
            {formatNaira(user?.lifetimeSavings || 0)}
          </Text>
          <Text style={[styles.heroSub, { color: colors.primaryForeground + "CC" }]}>
            vs market price · {user?.agPoints || 0} pts earned
          </Text>
        </View>

        {/* Categories */}
        <SectionHeader title="Shop by category" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {CATS.map((c) => (
            <CategoryChip
              key={c.label}
              label={c.label}
              icon={c.icon}
              onPress={() => router.push({ pathname: "/(tabs)/browse", params: { cat: c.label } })}
            />
          ))}
        </ScrollView>

        {/* Featured Deals */}
        <SectionHeader title="Today's biggest savings" link="See all" onLink={() => router.push("/(tabs)/browse")} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {featured.map((p) => {
            const v = vendors.find((vv) => vv.id === p.vendorId);
            return (
              <ProductCard
                key={p.id}
                product={p}
                vendorVerified={v?.verified}
                variant="compact"
              />
            );
          })}
        </ScrollView>

        {/* Subscriptions */}
        <SectionHeader title="Subscribe & save" />
        <View style={styles.subRow}>
          <SubCard
            title="Weekly Food Basket"
            subtitle="Fresh produce delivered every Saturday"
            badge="Save 30%"
            icon="calendar"
            onPress={() => router.push("/product/p10")}
          />
          <SubCard
            title="Monthly Supply Plan"
            subtitle="A full month of essentials at one price"
            badge="Save 35%"
            icon="repeat"
            onPress={() => router.push("/product/p20")}
          />
        </View>

        {/* Trusted vendors */}
        <SectionHeader title="Trusted vendors" link="Trust Center" onLink={() => router.push("/trust")} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        >
          {trustedVendors.map((v) => (
            <Pressable
              key={v.id}
              onPress={() => router.push(`/vendor/${v.id}`)}
              style={[styles.vendorCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Image source={getImage(v.avatar)} style={styles.vendorAvatar} />
              <Text style={[styles.vendorName, { color: colors.foreground }]} numberOfLines={1}>
                {v.name}
              </Text>
              <VerifiedBadge size="sm" />
              <View style={styles.vendorRating}>
                <Feather name="star" size={11} color={colors.warning} />
                <Text style={[styles.vendorRatingText, { color: colors.mutedForeground }]}>
                  {v.rating.toFixed(1)} · {v.totalSales} sales
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <SectionHeader title="Quick actions" />
        <View style={styles.quickRow}>
          <QuickAction icon="plus-circle" label="Fund Wallet" onPress={() => router.push("/wallet")} />
          <QuickAction icon="credit-card" label="Use Credit" onPress={() => router.push("/credit")} />
          <QuickAction icon="truck" label="Track Orders" onPress={() => router.push("/(tabs)/orders")} />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({
  title,
  link,
  onLink,
}: {
  title: string;
  link?: string;
  onLink?: () => void;
}) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {link && (
        <Pressable onPress={onLink} hitSlop={6}>
          <Text style={[styles.sectionLink, { color: colors.primary }]}>{link}</Text>
        </Pressable>
      )}
    </View>
  );
}

function SubCard({
  title,
  subtitle,
  badge,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ComponentProps<typeof Feather>["name"];
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.subCard,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[styles.subIcon, { backgroundColor: colors.primary + "1A" }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.subTitle, { color: colors.foreground }]} numberOfLines={1}>
        {title}
      </Text>
      <Text style={[styles.subSub, { color: colors.mutedForeground }]} numberOfLines={2}>
        {subtitle}
      </Text>
      <View style={[styles.subBadge, { backgroundColor: colors.success + "1A" }]}>
        <Text style={{ color: colors.success, fontFamily: "Inter_700Bold", fontSize: 11 }}>
          {badge}
        </Text>
      </View>
    </Pressable>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  onPress: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quick,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Feather name={icon} size={20} color={colors.primary} />
      <Text style={[styles.quickLabel, { color: colors.foreground }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  hello: { fontFamily: "Inter_400Regular", fontSize: 13 },
  location: { fontFamily: "Inter_600SemiBold", fontSize: 15, marginTop: 2 },
  topRight: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dotBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: { color: "#FFF", fontFamily: "Inter_700Bold", fontSize: 10 },

  walletStrip: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginTop: 16 },
  walletItem: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, gap: 4 },
  walletLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  walletValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  pointsRow: { flexDirection: "row", alignItems: "center", gap: 4 },

  search: {
    marginHorizontal: 20,
    marginTop: 12,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  searchText: { fontFamily: "Inter_500Medium", fontSize: 14 },

  hero: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 20,
    gap: 4,
  },
  heroSparkle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  heroAmount: { fontFamily: "Inter_700Bold", fontSize: 38, letterSpacing: -1 },
  heroSub: { fontFamily: "Inter_500Medium", fontSize: 12 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17 },
  sectionLink: { fontFamily: "Inter_600SemiBold", fontSize: 13 },

  chipRow: { paddingHorizontal: 20, gap: 8 },

  subRow: { paddingHorizontal: 20, flexDirection: "row", gap: 12 },
  subCard: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  subIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  subTitle: { fontFamily: "Inter_700Bold", fontSize: 14 },
  subSub: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 16 },
  subBadge: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, marginTop: 4 },

  vendorCard: {
    width: 140,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 6,
  },
  vendorAvatar: { width: 56, height: 56, borderRadius: 28 },
  vendorName: { fontFamily: "Inter_600SemiBold", fontSize: 13, marginTop: 2 },
  vendorRating: { flexDirection: "row", alignItems: "center", gap: 3 },
  vendorRatingText: { fontFamily: "Inter_500Medium", fontSize: 10 },

  quickRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20 },
  quick: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  quickLabel: { fontFamily: "Inter_600SemiBold", fontSize: 12 },
});
