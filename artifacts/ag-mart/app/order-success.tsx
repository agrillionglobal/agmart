import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { useColors } from "@/hooks/useColors";
import { Button } from "@/components/Button";
import { useStore } from "@/store";
import { formatNaira } from "@/components/lib/format";

export default function OrderSuccess() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ points?: string; savings?: string }>();
  const { orders } = useStore();
  const lastOrder = orders[0];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const points = Number(params.points) || lastOrder?.agPointsEarned || 0;
  const savings = Number(params.savings) || lastOrder?.savings || 0;

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.center}>
        <Animated.View entering={ZoomIn.duration(420)}>
          <View style={[styles.checkRing, { backgroundColor: colors.primary + "1A" }]}>
            <View style={[styles.check, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={42} color={colors.primaryForeground} />
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeIn.delay(200).duration(400)}
          style={[styles.title, { color: colors.foreground }]}
        >
          Order placed
        </Animated.Text>
        <Animated.Text
          entering={FadeIn.delay(280).duration(400)}
          style={[styles.subtitle, { color: colors.mutedForeground }]}
        >
          Your funds are safely locked in escrow.
        </Animated.Text>

        <Animated.View
          entering={FadeInDown.delay(360).duration(420)}
          style={[styles.rewardCard, { backgroundColor: colors.primary }]}
        >
          <View style={styles.rewardRow}>
            <View style={styles.rewardCol}>
              <Feather name="zap" size={18} color="#fff" />
              <Text style={styles.rewardValue}>+{points}</Text>
              <Text style={styles.rewardLabel}>AG Points</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rewardCol}>
              <Feather name="trending-up" size={18} color="#fff" />
              <Text style={styles.rewardValue}>{formatNaira(savings)}</Text>
              <Text style={styles.rewardLabel}>You saved</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.rewardCol}>
              <Feather name="shield" size={18} color="#fff" />
              <Text style={styles.rewardValue}>+1</Text>
              <Text style={styles.rewardLabel}>Trust score</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeIn.delay(450).duration(400)}
          style={[styles.tip, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="info" size={16} color={colors.primary} />
          <Text style={{ color: colors.mutedForeground, fontFamily: "Inter_500Medium", fontSize: 12, flex: 1 }}>
            Confirm delivery in the Orders tab to release funds to the vendor and earn your points.
          </Text>
        </Animated.View>
      </View>

      <View style={{ gap: 10 }}>
        <Button
          title={lastOrder ? "Track this order" : "View orders"}
          onPress={() => router.replace(lastOrder ? `/orders/${lastOrder.id}` : "/(tabs)/orders")}
          size="lg"
        />
        <Pressable onPress={() => router.replace("/")} style={styles.link}>
          <Text style={[styles.linkText, { color: colors.mutedForeground }]}>Back to home</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 24, justifyContent: "space-between" },
  center: { alignItems: "center", gap: 12 },
  checkRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  check: { width: 96, height: 96, borderRadius: 48, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: "Inter_700Bold", fontSize: 28, letterSpacing: -0.5, marginTop: 8 },
  subtitle: { fontFamily: "Inter_500Medium", fontSize: 14, textAlign: "center" },
  rewardCard: { width: "100%", padding: 18, borderRadius: 20, marginTop: 16 },
  rewardRow: { flexDirection: "row", alignItems: "center" },
  rewardCol: { flex: 1, alignItems: "center", gap: 4 },
  rewardValue: { color: "#fff", fontFamily: "Inter_700Bold", fontSize: 20 },
  rewardLabel: { color: "rgba(255,255,255,0.85)", fontFamily: "Inter_500Medium", fontSize: 11 },
  divider: { width: 1, height: 50, backgroundColor: "rgba(255,255,255,0.25)" },
  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  link: { alignItems: "center", padding: 8 },
  linkText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
