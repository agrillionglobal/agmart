import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Button } from "@/components/Button";
import { useStore } from "@/store";

const STATES = [
  "Lagos",
  "Abuja",
  "Kano",
  "Port Harcourt",
  "Ibadan",
  "Kaduna",
  "Enugu",
  "Plateau",
  "Ogun",
  "Rivers",
  "Oyo",
];

export default function Auth() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { updateUser } = useStore();

  const [step, setStep] = useState<"phone" | "otp" | "details">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const sendOtp = () => {
    if (phone.length < 10) {
      setError("Enter a valid phone number");
      return;
    }
    setError("");
    setStep("otp");
  };

  const verifyOtp = () => {
    if (otp.join("").length < 4) {
      setError("Enter the 4-digit code");
      return;
    }
    setError("");
    setStep("details");
  };

  const finish = async () => {
    if (!name.trim() || !location.trim()) {
      setError("Please complete all fields");
      return;
    }
    await updateUser({ name: name.trim(), phone, location });
    router.push("/onboarding/role");
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.wrap,
        { backgroundColor: colors.background, paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
        <Feather name="arrow-left" size={24} color={colors.foreground} />
      </Pressable>

      <View style={styles.dotsRow}>
        {(["phone", "otp", "details"] as const).map((s, i) => (
          <View
            key={s}
            style={[
              styles.dot,
              {
                backgroundColor:
                  ["phone", "otp", "details"].indexOf(step) >= i ? colors.primary : colors.muted,
              },
            ]}
          />
        ))}
      </View>

      {step === "phone" && (
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.foreground }]}>What&apos;s your number?</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We&apos;ll send a verification code to confirm.
          </Text>
          <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.prefix, { color: colors.foreground }]}>+234</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="801 234 5678"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[styles.input, { color: colors.foreground }]}
              autoFocus
            />
          </View>
          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
          <Button title="Send Code" onPress={sendOtp} size="lg" style={{ marginTop: 16 }} />
        </View>
      )}

      {step === "otp" && (
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.foreground }]}>Enter the 4-digit code</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sent to +234 {phone}. Demo: any 4 digits work.
          </Text>
          <View style={styles.otpRow}>
            {otp.map((d, i) => (
              <TextInput
                key={i}
                value={d}
                onChangeText={(v) => {
                  const next = [...otp];
                  next[i] = v.replace(/\D/g, "").slice(0, 1);
                  setOtp(next);
                }}
                keyboardType="number-pad"
                maxLength={1}
                style={[
                  styles.otpInput,
                  { borderColor: d ? colors.primary : colors.border, color: colors.foreground, backgroundColor: colors.card },
                ]}
              />
            ))}
          </View>
          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
          <Button title="Verify" onPress={verifyOtp} size="lg" style={{ marginTop: 16 }} />
        </View>
      )}

      {step === "details" && (
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.foreground }]}>Tell us about you</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            We&apos;ll use this for delivery and matching you with farms nearby.
          </Text>
          <View style={[styles.inputBlock, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Full name"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground, padding: 16 }]}
            />
          </View>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Where are you?</Text>
          <View style={styles.chipWrap}>
            {STATES.map((s) => (
              <Pressable
                key={s}
                onPress={() => setLocation(s)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: location === s ? colors.primary : colors.card,
                    borderColor: location === s ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: location === s ? colors.primaryForeground : colors.foreground,
                    fontFamily: "Inter_500Medium",
                    fontSize: 13,
                  }}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
          {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
          <Button title="Continue" onPress={finish} size="lg" style={{ marginTop: 16 }} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 24, gap: 24, flexGrow: 1 },
  back: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  dotsRow: { flexDirection: "row", gap: 8 },
  dot: { flex: 1, height: 4, borderRadius: 2 },
  section: { gap: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  subtitle: { fontFamily: "Inter_400Regular", fontSize: 14, marginBottom: 12 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    height: 56,
    gap: 10,
  },
  prefix: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
  divider: { width: 1, height: 24 },
  input: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 16 },
  inputBlock: { borderRadius: 14, borderWidth: 1 },
  otpRow: { flexDirection: "row", gap: 12, marginTop: 8 },
  otpInput: {
    flex: 1,
    height: 64,
    borderRadius: 14,
    borderWidth: 1.5,
    textAlign: "center",
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  label: { fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 8 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 999, borderWidth: 1 },
  error: { fontFamily: "Inter_500Medium", fontSize: 13, marginTop: 8 },
});
