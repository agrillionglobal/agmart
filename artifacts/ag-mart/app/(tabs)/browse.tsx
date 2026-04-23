import { useState, useMemo } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useStore } from "@/store";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/Button";
import { CategoryChip } from "@/components/CategoryChip";

const CATS = ["All", "Crops", "Livestock", "Fishery", "Farm Inputs", "Bundles"];

export default function Browse() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ cat?: string }>();
  const { products, vendors } = useStore();

  const [active, setActive] = useState<string>(params.cat || "All");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (active !== "All" && p.category !== active) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (maxPrice && p.farmGatePrice > Number(maxPrice)) return false;
      if (locationFilter && !p.location.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      if (verifiedOnly) {
        const v = vendors.find((vv) => vv.id === p.vendorId);
        if (!v?.verified) return false;
      }
      return true;
    });
  }, [products, vendors, active, search, maxPrice, locationFilter, verifiedOnly]);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const tabPad = Platform.OS === "web" ? 100 : insets.bottom + 80;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: topPad }}>
      <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.foreground }]}>Browse</Text>
          <Pressable
            onPress={() => setFilterOpen(true)}
            style={[styles.iconBtn, { backgroundColor: colors.muted }]}
          >
            <Feather name="sliders" size={18} color={colors.foreground} />
          </Pressable>
        </View>
        <View
          style={[
            styles.search,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search produce, livestock, inputs…"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingVertical: 8 }}
      >
        {CATS.map((c) => (
          <CategoryChip
            key={c}
            label={c}
            selected={active === c}
            onPress={() => setActive(c)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: tabPad, gap: 12 }}
        renderItem={({ item }) => {
          const v = vendors.find((vv) => vv.id === item.vendorId);
          return (
            <View style={{ flex: 1 }}>
              <ProductCard product={item} vendorVerified={v?.verified} />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: "center" }}>
            <Feather name="search" size={32} color={colors.mutedForeground} />
            <Text
              style={{
                color: colors.mutedForeground,
                marginTop: 12,
                fontFamily: "Inter_500Medium",
              }}
            >
              No products match your filters
            </Text>
          </View>
        }
      />

      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.modalBg} onPress={() => setFilterOpen(false)}>
          <Pressable
            style={[
              styles.sheet,
              { backgroundColor: colors.background, paddingBottom: insets.bottom + 24 },
            ]}
            onPress={() => {}}
          >
            <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
            <Text style={[styles.sheetTitle, { color: colors.foreground }]}>Filters</Text>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Location</Text>
              <View style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <TextInput
                  value={locationFilter}
                  onChangeText={setLocationFilter}
                  placeholder="e.g. Lagos, Kano"
                  placeholderTextColor={colors.mutedForeground}
                  style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14 }}
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Max price (₦)</Text>
              <View style={[styles.input, { borderColor: colors.border, backgroundColor: colors.card }]}>
                <TextInput
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  placeholder="No limit"
                  keyboardType="number-pad"
                  placeholderTextColor={colors.mutedForeground}
                  style={{ color: colors.foreground, fontFamily: "Inter_500Medium", fontSize: 14 }}
                />
              </View>
            </View>

            <View style={[styles.field, { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }]}>
              <Text style={[styles.fieldLabel, { color: colors.foreground, fontFamily: "Inter_600SemiBold" }]}>
                Verified vendors only
              </Text>
              <Switch
                value={verifiedOnly}
                onValueChange={setVerifiedOnly}
                trackColor={{ false: colors.muted, true: colors.primary }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <Button
                title="Clear"
                variant="outline"
                onPress={() => {
                  setVerifiedOnly(false);
                  setMaxPrice("");
                  setLocationFilter("");
                }}
                style={{ flex: 1 }}
              />
              <Button title="Apply" onPress={() => setFilterOpen(false)} style={{ flex: 1 }} />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  title: { fontFamily: "Inter_700Bold", fontSize: 26, letterSpacing: -0.5 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  search: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchInput: { flex: 1, fontFamily: "Inter_500Medium", fontSize: 14 },

  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, gap: 16 },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: "center" },
  sheetTitle: { fontFamily: "Inter_700Bold", fontSize: 20 },
  field: { gap: 8 },
  fieldLabel: { fontFamily: "Inter_500Medium", fontSize: 13 },
  input: { paddingHorizontal: 14, height: 48, borderRadius: 12, borderWidth: 1, justifyContent: "center" },
});
