import { useCallback } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";

import { colors, radii, spacing } from "@/constants/tokens";

export type SortOption = "popular" | "recent" | "least" | "no_votes";
export type LocationFilter = "global" | "country" | "state" | "city";

interface FeedFiltersProps {
  visible: boolean;
  onClose: () => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  location: LocationFilter;
  onLocationChange: (loc: LocationFilter) => void;
  showBestShot: boolean;
  onBestShotChange: (val: boolean) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Most Popular" },
  { value: "recent", label: "Most Recent" },
  { value: "least", label: "Least Popular" },
  { value: "no_votes", label: "No Votes" },
];

const LOCATION_OPTIONS: { value: LocationFilter; label: string }[] = [
  { value: "global", label: "Global" },
  { value: "country", label: "Country" },
  { value: "state", label: "State" },
  { value: "city", label: "City" },
];

interface RadioRowProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioRow = ({ label, selected, onPress }: RadioRowProps) => (
  <Pressable
    onPress={onPress}
    style={styles.radioRow}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    <View style={[styles.radio, selected && styles.radioSelected]}>
      {selected ? <View style={styles.radioDot} /> : null}
    </View>
    <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
      {label}
    </Text>
  </Pressable>
);

export const FeedFilters = ({
  visible,
  onClose,
  sort,
  onSortChange,
  location,
  onLocationChange,
  showBestShot,
  onBestShotChange,
}: FeedFiltersProps) => {
  const handleApply = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
      </Pressable>

      <View style={styles.panel}>
        <View style={styles.handle} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Filters</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Best Shot toggle */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Give It Your Best Shot</Text>
            <Switch
              value={showBestShot}
              onValueChange={onBestShotChange}
              trackColor={{ false: "#333", true: colors.purple }}
              thumbColor={colors.white}
              accessibilityRole="switch"
              accessibilityLabel="Give It Your Best Shot"
            />
          </View>

          <View style={styles.divider} />

          {/* Sort */}
          <Text style={styles.sectionTitle}>Sort By</Text>
          {SORT_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              selected={sort === opt.value}
              onPress={() => onSortChange(opt.value)}
            />
          ))}

          <View style={styles.divider} />

          {/* Location */}
          <Text style={styles.sectionTitle}>Location</Text>
          {LOCATION_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              selected={location === opt.value}
              onPress={() => onLocationChange(opt.value)}
            />
          ))}

          {/* Apply button */}
          <Pressable
            onPress={handleApply}
            style={styles.applyBtn}
            accessibilityRole="button"
            accessibilityLabel="Apply filters"
          >
            <Text style={styles.applyText}>Apply Filters</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  panel: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    width: "70%",
    backgroundColor: "rgba(11, 10, 23, 0.95)",
  },
  handle: {
    display: "none",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingTop: 70,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  closeText: {
    color: colors.textSecondary,
    fontSize: 20,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  toggleLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: spacing.md,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    borderColor: colors.purple,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.purple,
  },
  radioLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  radioLabelSelected: {
    color: colors.white,
    fontWeight: "600",
  },
  applyBtn: {
    backgroundColor: colors.purple,
    borderRadius: radii.lg,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.xl,
  },
  applyText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
