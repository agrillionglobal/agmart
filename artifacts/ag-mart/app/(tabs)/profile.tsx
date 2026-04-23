import { Image, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { formatNaira } from "@/components/lib/format";
import { getImage } from "@/components/lib/images";

export default function Profile() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, products, orders, vendors, updateUser, resetAll } = useStore();

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const tabPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  const isSeller = user?.role === "farmer" || user?.role === "vendor";
  const myVendor = vendors[0];

  // Vendor metrics (mocked from data)
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const activeListings = products.length;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: tabPad, gap: 16 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>

        {/* Profile card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.profileRow}>
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.primaryForeground, fontFamily: "Inter_700Bold", fontSize: 22 }}>
                {(user?.name?.[0] || "U").toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Text style={[styles.name, { color: colors.foreground }]}>{user?.name || "User"}</Text>
                {myVendor?.verified && <VerifiedBadge size="sm" />}
              </View>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                {user?.location || "Nigeria"} · {user?.role}
              </Text>
              <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                +234 {user?.phone || "—"}
              </Text>
            </View>
          </View>
        </View>

        {isSeller ? (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              {user?.role === "farmer" ? "Farmer dashboard" : "Vendor dashboard"}
            </Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Stat label="Revenue" value={formatNaira(totalRevenue)} icon="trending-up" tint={colors.success} />
              <Stat label="Listings" value={String(activeListings)} icon="grid" tint={colors.primary} />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Stat label="Orders" value={String(orders.length)} icon="package" tint={colors.warning} />
              <Stat
                label="Rating"
                value={`${(myVendor?.rating || 4.6).toFixed(1)}`}
                icon="star"
                tint={colors.warning}
              />
            </View>
            <Button
              title="Add new listing"
              onPress={() => {}}
              size="lg"
              icon={<Feather name="plus" size={18} color={colors.primaryForeground} />}
            />
          </>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Buyer summary</Text>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Stat label="Total saved" value={formatNaira(user?.lifetimeSavings || 0)} icon="trending-up" tint={colors.success} />
              <Stat label="AG Points" value={String(user?.agPoints || 0)} icon="zap" tint={colors.warning} />
            </View>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <Stat label="Orders" value={String(orders.length)} icon="package" tint={colors.primary} />
              <Stat label="Trust" value={String(user?.trustScore || 0)} icon="shield" tint={colors.primary} />
            </View>
          </>
        )}

        {/* Menu */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MenuItem icon="map-pin" label="Delivery addresses" onPress={() => {}} />
          <MenuItem icon="credit-card" label="Payment methods" onPress={() => router.push("/wallet")} />
          <MenuItem icon="zap" label="AG Points & Credit" onPress={() => router.push("/credit")} />
          <MenuItem icon="shield" label="Trust Center" onPress={() => router.push("/trust")} />
          <MenuItem icon="bell" label="Notifications" onPress={() => router.push("/notifications")} />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={[styles.menu, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Feather name="moon" size={18} color={colors.foreground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Dark mode</Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
              System
            </Text>
          </View>
          <View style={styles.row}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <Feather name="globe" size={18} color={colors.foreground} />
              <Text style={[styles.rowLabel, { color: colors.foreground }]}>Language</Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
              English
            </Text>
          </View>
          <MenuItem icon="help-circle" label="Help & support" onPress={() => {}} />
          <MenuItem icon="file-text" label="Terms & privacy" onPress={() => {}} />
        </View>

        {/* Switch role (demo) */}
        <Pressable
          onPress={() =>
            updateUser({
              role: user?.role === "buyer" ? "farmer" : "buyer",
            })
          }
          style={[
            styles.outlineBtn,
            { borderColor: colors.border, backgroundColor: colors.card },
          ]}
        >
          <Feather name="repeat" size={16} color={colors.foreground} />
          <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold" }}>
            Switch to {user?.role === "buyer" ? "seller view" : "buyer view"}
          </Text>
        </Pressable>

        <Pressable
          onPress={resetAll}
          style={[styles.outlineBtn, { borderColor: colors.destructive + "60" }]}
        >
          <Feather name="log-out" size={16} color={colors.destructive} />
          <Text style={{ color: colors.destructive, fontFamily: "Inter_600SemiBold" }}>
            Log out & reset demo
          </Text>
        </Pressable>
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
    <View style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Feather name={icon} size={14} color={tint} />
      </View>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function MenuItem({
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
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && { opacity: 0.7 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Feather name={icon} size={18} color={colors.foreground} />
        <Text style={[styles.rowLabel, { color: colors.foreground }]}>{label}</Text>
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  name: { fontFamily: "Inter_700Bold", fontSize: 18 },
  meta: { fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, marginTop: 8 },
  stat: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  menu: { borderRadius: 16, borderWidth: 1, overflow: "hidden" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  rowLabel: { fontFamily: "Inter_500Medium", fontSize: 14 },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
});
