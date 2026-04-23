import { useState, useRef, useEffect } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { getImage } from "@/components/lib/images";

interface Msg {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

const seedMessages = (vendorName: string): Msg[] => [
  {
    id: "m1",
    text: `Hello! Welcome to ${vendorName}. How can we help you today?`,
    fromMe: false,
    time: "Yesterday",
  },
  {
    id: "m2",
    text: "I'd like to know if the tomatoes are still in stock and freshly harvested?",
    fromMe: true,
    time: "10:42",
  },
  {
    id: "m3",
    text: "Yes, harvested this morning. We can deliver tomorrow if you order today.",
    fromMe: false,
    time: "10:45",
  },
];

export default function Chat() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { vendors } = useStore();
  const vendor = vendors.find((v) => v.id === vendorId);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (vendor) setMessages(seedMessages(vendor.name));
  }, [vendor]);

  const send = () => {
    if (!text.trim()) return;
    const time = new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" });
    setMessages((m) => [...m, { id: String(Date.now()), text: text.trim(), fromMe: true, time }]);
    setText("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          text: "Got it. We'll prepare your order right away.",
          fromMe: false,
          time,
        },
      ]);
      scrollRef.current?.scrollToEnd();
    }, 800);
    setTimeout(() => scrollRef.current?.scrollToEnd(), 50);
  };

  if (!vendor) return null;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.header, { paddingTop: topPad + 8, borderColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Image source={getImage(vendor.avatar)} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text style={{ color: colors.foreground, fontFamily: "Inter_700Bold", fontSize: 16 }}>
              {vendor.name}
            </Text>
            {vendor.verified && <VerifiedBadge size="sm" />}
          </View>
          <Text style={{ color: colors.success, fontFamily: "Inter_500Medium", fontSize: 11, marginTop: 2 }}>
            Online · usually replies in 5 min
          </Text>
        </View>
        <Pressable hitSlop={10}>
          <Feather name="phone" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 20, gap: 10 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        <View style={[styles.systemMsg, { backgroundColor: colors.primary + "10" }]}>
          <Feather name="shield" size={12} color={colors.primary} />
          <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold", fontSize: 11 }}>
            Chat is monitored. Never pay outside AG Mart.
          </Text>
        </View>
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.fromMe
                ? { backgroundColor: colors.primary, alignSelf: "flex-end", borderBottomRightRadius: 4 }
                : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, alignSelf: "flex-start", borderBottomLeftRadius: 4 },
            ]}
          >
            <Text
              style={{
                color: m.fromMe ? colors.primaryForeground : colors.foreground,
                fontFamily: "Inter_500Medium",
                fontSize: 14,
              }}
            >
              {m.text}
            </Text>
            <Text
              style={{
                color: m.fromMe ? colors.primaryForeground + "AA" : colors.mutedForeground,
                fontFamily: "Inter_500Medium",
                fontSize: 10,
                marginTop: 4,
                alignSelf: "flex-end",
              }}
            >
              {m.time}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View
        style={[
          styles.inputBar,
          { backgroundColor: colors.background, borderColor: colors.border, paddingBottom: insets.bottom + 8 },
        ]}
      >
        <View style={[styles.inputWrap, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message…"
            placeholderTextColor={colors.mutedForeground}
            style={{ flex: 1, color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14 }}
            onSubmitEditing={send}
          />
        </View>
        <Pressable
          onPress={send}
          style={[styles.sendBtn, { backgroundColor: colors.primary, opacity: text.trim() ? 1 : 0.5 }]}
        >
          <Feather name="send" size={18} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  systemMsg: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  bubble: { maxWidth: "78%", padding: 12, borderRadius: 16 },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
  },
  sendBtn: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
});
