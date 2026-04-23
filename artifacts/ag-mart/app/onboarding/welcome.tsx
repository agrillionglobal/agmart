import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Button } from "@/components/Button";

export default function Welcome() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      <View style={styles.top}>
        <Image source={require("@/assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
        <Text style={[styles.tag, { color: colors.mutedForeground }]}>
          Your Discount, Your Wealth
        </Text>
      </View>

      <View style={styles.middle}>
        <Feature
          icon="trending-down"
          title="Farm gate prices"
          body="Buy direct from verified farms. Skip the middleman."
        />
        <Feature
          icon="shield"
          title="Escrow protected"
          body="Payments held safely until you confirm delivery."
        />
        <Feature
          icon="award"
          title="Earn AG Points"
          body="Every purchase unlocks credit and bigger savings."
        />
      </View>

      <View style={styles.bottom}>
        <Button title="Get Started" onPress={() => router.push("/onboarding/auth")} size="lg" />
        <Pressable onPress={() => router.push("/onboarding/auth")} style={styles.link}>
          <Text style={[styles.linkText, { color: colors.mutedForeground }]}>
            Already have an account?{" "}
            <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
              Login
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Feature({
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
    <View style={styles.feat}>
      <View style={[styles.featIcon, { backgroundColor: colors.primary + "1A" }]}>
        <Feather name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.featTitle, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.featBody, { color: colors.mutedForeground }]}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 28, justifyContent: "space-between" },
  top: { alignItems: "center", gap: 8 },
  logo: { width: 220, height: 220 },
  tag: { fontFamily: "Inter_500Medium", fontSize: 16, marginTop: -8 },
  middle: { gap: 18 },
  feat: { flexDirection: "row", alignItems: "center", gap: 14 },
  featIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  featTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15 },
  featBody: { fontFamily: "Inter_400Regular", fontSize: 13, marginTop: 2 },
  bottom: { gap: 14 },
  link: { alignItems: "center", padding: 8 },
  linkText: { fontFamily: "Inter_500Medium", fontSize: 14 },
});
