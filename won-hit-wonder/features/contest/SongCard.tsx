import { useCallback } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

import { colors, radii, spacing } from "@/constants/tokens";
import type { Song } from "@/lib/types";

interface SongCardProps {
  song: Song;
  isSelected: boolean;
  onSelect: (song: Song) => void;
}

const formatDuration = (ms: number) => {
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

export const SongCard = ({ song, isSelected, onSelect }: SongCardProps) => {
  const handlePress = useCallback(() => {
    onSelect(song);
  }, [song, onSelect]);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${song.title} by ${song.artist}`}
      accessibilityState={{ selected: isSelected }}
    >
      {isSelected ? (
        <LinearGradient
          colors={["#0e60ff", "#d500cd"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.selectedBorder}
        />
      ) : null}
      <View style={styles.content}>
        <Image
          source={{ uri: song.cover_image_url ?? undefined }}
          style={styles.cover}
          contentFit="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {song.artist}
          </Text>
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.duration}>
            {formatDuration(song.duration_ms)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.md,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  cardSelected: {
    backgroundColor: "rgba(14, 96, 255, 0.1)",
  },
  cardPressed: {
    opacity: 0.8,
  },
  selectedBorder: {
    height: 2,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    gap: spacing.md,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: radii.sm,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  title: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  artist: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  durationBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  duration: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
});
