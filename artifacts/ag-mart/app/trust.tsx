import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { formatNaira } from "@/components/lib/format";

export default function Trust() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useStore();
  const score = user?.trustScore || 0;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={[styles.backBtn, { backgroundColor: colors.muted }]}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Trust Center</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 24, gap: 16 }}>
        <View style={[styles.scoreCard, { backgroundColor: colors.primary }]}>
          <Feather name="shield" size={32} color="#fff" />
          <Text style={{ color: "rgba(255,255,255,0.85)", fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 8 }}>
            Your AG Trust Score
          </Text>
          <Text style={{ color: "#fff", fontFamily: "Inter_700Bold", fontSize: 56, letterSpacing: -2, lineHeight: 60 }}>
            {score}
            <Text style={{ fontSize: 22, fontFamily: "Inter_500Medium" }}>/100</Text>
          </Text>
          <Text style={{ color: "rgba(255,255,255,0.9)", fontFamily: "Inter_500Medium", fontSize: 13, textAlign: "center" }}>
            Built from {formatNaira(user?.lifetimeSavings || 0)} in savings & {user?.agPoints || 0} AG Points earned
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>How AG Mart protects you</Text>
        <View style={{ gap: 10 }}>
          <Pillar
            icon="lock"
            title="Escrow on every order"
            body="We hold your payment until you confirm delivery. Vendors only get paid when you're satisfied."
          />
          <Pillar
            icon="user-check"
            title="Verified vendors"
            body="Every verified vendor has provided ID, farm location, and bank details validated by our trust team."
          />
          <Pillar
            icon="message-square"
            title="In-app communication"
            body="All chats are monitored. We block off-platform payments to protect against fraud."
          />
          <Pillar
            icon="refresh-cw"
            title="Refund guarantee"
            body="If your order doesn't match the description, your full payment is refunded from escrow within 24 hours."
          />
          <Pillar
            icon="award"
            title="Trust loop rewards"
            body="Every confirmed order builds your trust score, unlocks more credit, and improves your terms."
          />
        </View>

        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16, marginBottom: 12 }}>
            Platform safety, in numbers
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <Stat value="98.4%" label="Disputes resolved" />
            <Stat value="2.1k+" label="Verified vendors" />
            <Stat value="0" label="Funds lost" />
          </View>
        </View>

        <View style={[styles.helpCard, { borderColor: colors.border, backgroundColor: colors.card }]}>
          <Feather name="help-circle" size={20} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>
              Need to report something?
            </Text>
            <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2 }}>
              Reach our 24/7 trust team via in-app chat
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
        </View>
      </ScrollView>
    </View>
  );
}

function Pillar({
  icon,
  title,
  body,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  body: string;
}) {
  const colors = useColors();
  return (
    <View style={[styles.pillar, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.pillarIcon, { backgroundColor: colors.primary + "1A" }]}>
        <Feather name={icon} size={18} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 14 }}>{title}</Text>
        <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, marginTop: 2, lineHeight: 18 }}>
          {body}
        </Text>
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.primary, fontFamily: "Inter_700Bold", fontSize: 22 }}>{value}</Text>
      <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 }}>
        {label}
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
  scoreCard: { padding: 24, borderRadius: 20, alignItems: "center", gap: 4 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, marginTop: 8 },
  pillar: { flexDirection: "row", gap: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  pillarIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  statsCard: { padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 8 },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 8,
  },
});
