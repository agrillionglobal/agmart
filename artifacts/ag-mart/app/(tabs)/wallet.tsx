import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { Button } from "@/components/Button";
import { formatNaira } from "@/components/lib/format";

export default function Wallet() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, transactions, fundWallet } = useStore();
  const [fundOpen, setFundOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const trustScore = user?.trustScore || 0;
  const trustPct = Math.min(trustScore, 100);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const tabPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  const onFund = async () => {
    const n = Number(amount);
    if (!n || n < 100) return;
    await fundWallet(n);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setAmount("");
    setFundOpen(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: tabPad, gap: 16 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>Wallet</Text>

        {/* Balance Card */}
        <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.balanceLabel, { color: colors.primaryForeground + "CC" }]}>
            Available balance
          </Text>
          <Text style={[styles.balanceValue, { color: colors.primaryForeground }]}>
            {formatNaira(user?.walletBalance || 0)}
          </Text>
          <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
            <Button
              title="Add Money"
              onPress={() => setFundOpen(true)}
              variant="secondary"
              style={{ flex: 1 }}
            />
            <Button
              title="Withdraw"
              variant="ghost"
              onPress={() => {}}
              style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.15)" }}
              textStyle={{ color: colors.primaryForeground }}
            />
          </View>
        </View>

        {/* Stats Row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => router.push("/credit")}
            style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.warning + "20" }]}>
              <Feather name="zap" size={16} color={colors.warning} />
            </View>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>AG Points</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{user?.agPoints || 0}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/credit")}
            style={[styles.stat, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.statIcon, { backgroundColor: colors.primary + "20" }]}>
              <Feather name="credit-card" size={16} color={colors.primary} />
            </View>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Credit limit</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {formatNaira(user?.creditLimit || 0)}
            </Text>
          </Pressable>
        </View>

        {/* Trust Score */}
        <Pressable
          onPress={() => router.push("/trust")}
          style={[styles.trustCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View>
              <Text style={[styles.trustLabel, { color: colors.mutedForeground }]}>Trust Score</Text>
              <Text style={[styles.trustValue, { color: colors.foreground }]}>{trustScore}<Text style={{ color: colors.mutedForeground, fontSize: 16 }}>/100</Text></Text>
            </View>
            <View style={[styles.trustBadge, { backgroundColor: colors.primary + "1A" }]}>
              <Feather name="shield" size={14} color={colors.primary} />
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 12 }}>
                {trustScore >= 70 ? "Excellent" : trustScore >= 40 ? "Building" : "New"}
              </Text>
            </View>
          </View>
          <View style={[styles.barBg, { backgroundColor: colors.muted }]}>
            <View style={[styles.barFg, { backgroundColor: colors.primary, width: `${trustPct}%` }]} />
          </View>
          <Text style={[styles.trustHint, { color: colors.mutedForeground }]}>
            Higher trust unlocks more credit. Tap to learn how.
          </Text>
        </Pressable>

        {/* Lifetime savings */}
        <View style={[styles.savingsCard, { backgroundColor: colors.success + "10", borderColor: colors.success + "30" }]}>
          <Feather name="trending-up" size={20} color={colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 12, color: colors.success }}>
              Lifetime savings
            </Text>
            <Text style={{ fontFamily: "Inter_700Bold", fontSize: 22, color: colors.foreground }}>
              {formatNaira(user?.lifetimeSavings || 0)}
            </Text>
          </View>
        </View>

        {/* Transactions */}
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent transactions</Text>
        {transactions.slice(0, 20).map((t) => {
          const isCredit = t.type === "credit";
          const isPoints = t.type === "points";
          const tint = isCredit ? colors.success : isPoints ? colors.warning : colors.destructive;
          return (<View
            key={t.id}
            style={[styles.tx, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={[styles.txIcon, { backgroundColor: tint + "20" }]}>
              <Feather
                name={isCredit ? "arrow-down-left" : isPoints ? "zap" : "arrow-up-right"}
                size={16}
                color={tint}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.txTitle, { color: colors.foreground }]} numberOfLines={1}>
                {t.label}
              </Text>
              <Text style={[styles.txDate, { color: colors.mutedForeground }]}>
                {new Date(t.createdAt).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <Text
              style={{
                fontFamily: "Inter_700Bold",
                fontSize: 14,
                color: tint,
              }}
            >
              {isCredit ? "+" : isPoints ? "+" : "−"}
              {isPoints ? `${t.amount} pts` : formatNaira(t.amount)}
            </Text>
          </View>
          );
        })}
      </ScrollView>

      <Modal visible={fundOpen} transparent animationType="slide" onRequestClose={() => setFundOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setFundOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 },
            ]}
            onPress={() => {}}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Add money</Text>
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: colors.mutedForeground }}>
              Demo mode — funds added instantly.
            </Text>
            <View style={[styles.amountInput, { borderColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_700Bold", fontSize: 24 }}>₦</Text>
              <TextInput
                value={amount}
                onChangeText={setAmount}
                keyboardType="number-pad"
                placeholder="5,000"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  flex: 1,
                  color: colors.foreground,
                  fontFamily: "Inter_700Bold",
                  fontSize: 28,
                  marginLeft: 8,
                }}
                autoFocus
              />
            </View>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[2000, 5000, 10000, 25000].map((q) => (
                <Pressable
                  key={q}
                  onPress={() => setAmount(String(q))}
                  style={[styles.quick, { backgroundColor: colors.muted }]}
                >
                  <Text style={{ color: colors.foreground, fontFamily: "Inter_600SemiBold", fontSize: 13 }}>
                    ₦{q.toLocaleString()}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Button title="Confirm" onPress={onFund} size="lg" disabled={!amount || Number(amount) < 100} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  balanceCard: { padding: 20, borderRadius: 20, gap: 4 },
  balanceLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  balanceValue: { fontFamily: "Inter_700Bold", fontSize: 36, letterSpacing: -1 },
  stat: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  statIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  statLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 18 },
  trustCard: { padding: 16, borderRadius: 16, borderWidth: 1, gap: 12 },
  trustLabel: { fontFamily: "Inter_500Medium", fontSize: 12 },
  trustValue: { fontFamily: "Inter_700Bold", fontSize: 28 },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  barBg: { height: 8, borderRadius: 4, overflow: "hidden" },
  barFg: { height: "100%", borderRadius: 4 },
  trustHint: { fontFamily: "Inter_500Medium", fontSize: 12 },
  savingsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 17, marginTop: 12 },
  tx: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 14, borderWidth: 1 },
  txIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  txTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14 },
  txDate: { fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 14 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center" },
  sheetTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  quick: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
});
