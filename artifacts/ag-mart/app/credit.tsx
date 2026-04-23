import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { formatNaira } from "@/components/lib/format";

const TIERS = [
  { name: "New", minScore: 0, limit: 10000, color: "#94A3B8" },
  { name: "Building", minScore: 40, limit: 50000, color: "#8FAD2A" },
  { name: "Trusted", minScore: 70, limit: 200000, color: "#D97706" },
  { name: "Elite", minScore: 90, limit: 500000, color: "#9333EA" },
];

export default function Credit() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useStore();

  const limit = user?.creditLimit || 0;
  const used = user?.creditUsed || 0;
  const available = limit - used;
  const usedPct = limit > 0 ? (used / limit) * 100 : 0;
  const trustScore = user?.trustScore || 0;
  const currentTier = [...TIERS].reverse().find((t) => trustScore >= t.minScore) || TIERS[0];
  const nextTier = TIERS.find((t) => t.minScore > trustScore);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>AG Credit</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}>
        {/* Credit hero */}
        <View style={[styles.hero, { backgroundColor: colors.primary }]}>
          <Text style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Inter_500Medium", fontSize: 13 }}>
            Available credit
          </Text>
          <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 38, letterSpacing: -1 }}>
            {formatNaira(available)}
          </Text>
          <View style={{ marginTop: 12 }}>
            <View style={styles.barBg}>
              <View style={[styles.barFg, { width: `${usedPct}%` }]} />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Inter_500Medium", fontSize: 11 }}>
                Used {formatNaira(used)}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontFamily: "Inter_500Medium", fontSize: 11 }}>
                Limit {formatNaira(limit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Tier */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                Your tier
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
                <Feather name="award" size={20} color={currentTier.color} />
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 22 }}>
                  {currentTier.name}
                </Text>
              </View>
            </View>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
              {trustScore}
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 13 }}>
                {" "}/100
              </Text>
            </Text>
          </View>
          {nextTier && (
            <View style={{ marginTop: 16 }}>
              <View style={[styles.barBgGrey, { backgroundColor: colors.muted }]}>
                <View
                  style={[
                    styles.barFgGrey,
                    {
                      backgroundColor: colors.primary,
                      width: `${(trustScore / nextTier.minScore) * 100}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={{
                  color: colors.mutedForeground,
                  fontFamily: "Inter_500Medium",
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                {nextTier.minScore - trustScore} more points to reach{" "}
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold" }}>
                  {nextTier.name}
                </Text>{" "}
                — unlocks {formatNaira(nextTier.limit)} limit
              </Text>
            </View>
          )}
        </View>

        {/* Tiers list */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Credit tiers</Text>
        <View style={{ gap: 8 }}>
          {TIERS.map((t) => {
            const active = currentTier.name === t.name;
            return (
              <View
                key={t.name}
                style={[
                  styles.tierRow,
                  {
                    backgroundColor: active ? colors.primary + "10" : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <View style={[styles.tierDot, { backgroundColor: t.color }]} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                    {t.name}
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12 }}>
                    Trust {t.minScore}+
                  </Text>
                </View>
                <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
                  {formatNaira(t.limit)}
                </Text>
              </View>
            );
          })}
        </View>

        {/* How to grow */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Boost your trust score</Text>
        <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Tip icon="check-circle" text="Confirm delivery promptly on every order" />
          <Tip icon="repeat" text="Make on-time repayments on credit purchases" />
          <Tip icon="star" text="Build a track record of completed orders" />
          <Tip icon="user-check" text="Verify your ID and bank details" />
        </View>

        <Button
          title="Use credit on next purchase"
          onPress={() => router.push("/(tabs)/browse")}
          size="lg"
          icon={<Feather name="zap" size={18} color={colors.primaryForeground} />}
        />
      </ScrollView>
    </View>
  );
}

function Tip({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  text: string;
}) {
  const colors = useColors();
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 }}>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.primary + "1A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 13, flex: 1 }}>
        {text}
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
  hero: { padding: 20, borderRadius: 20 },
  barBg: { height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.25)", overflow: "hidden" },
  barFg: { height: "100%", backgroundColor: "#fff", borderRadius: 4 },
  barBgGrey: { height: 8, borderRadius: 4, overflow: "hidden" },
  barFgGrey: { height: "100%", borderRadius: 4 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, marginTop: 8 },
  tierRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  tierDot: { width: 12, height: 12, borderRadius: 6 },
  tipCard: { padding: 12, borderRadius: 16, borderWidth: 1 },
});
