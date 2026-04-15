import { useCallback } from "react";
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { colors, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import type { User, UserStats } from "@/lib/types";

const { width: SW } = Dimensions.get("window");
const BG_COLOR = "#0b0a17";
const HERO_HEIGHT = 400;

interface ProfileHeaderProps {
  user: User;
  stats: UserStats | undefined;
  isOwnProfile?: boolean;
  onAvatarUpdated?: () => void;
}

// Audio waveform bars (decorative)
const WaveformBars = ({ height }: { height: number }) => {
  const bars = [3, 7, 3, 7, 11, 3, 9, 13, 5, 3, 3];
  return (
    <View style={waveStyles.container}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={[waveStyles.bar, { height: Math.min(h, height) }]}
        />
      ))}
    </View>
  );
};

const waveStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  },
  bar: {
    width: 1.5,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
});

export const ProfileHeader = ({
  user,
  stats,
  isOwnProfile = true,
  onAvatarUpdated,
}: ProfileHeaderProps) => {
  const handleAvatarPress = useCallback(async () => {
    if (!isOwnProfile) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant photo library access to change your avatar.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const ext = asset.uri.split(".").pop() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;

    // Upload to Supabase storage using FormData (works reliably in Expo Go)
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: `avatar.${ext}`,
      type: asset.mimeType ?? "image/jpeg",
    } as unknown as Blob);

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, formData, {
        contentType: "multipart/form-data",
        upsert: true,
      });

    if (uploadError) {
      Alert.alert("Upload failed", uploadError.message);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(path);

    // Update user record
    await supabase
      .from("users")
      .update({ avatar_url: urlData.publicUrl })
      .eq("id", user.id);

    onAvatarUpdated?.();
  }, [isOwnProfile, user.id, onAvatarUpdated]);

  return (
    <View style={styles.container}>
      {/* Large hero photo — full-bleed like Figma */}
      <Pressable
        style={styles.heroArea}
        onPress={isOwnProfile ? handleAvatarPress : undefined}
        accessibilityRole={isOwnProfile ? "button" : "image"}
        accessibilityLabel={
          isOwnProfile ? "Change profile photo" : `${user.display_name}'s photo`
        }
      >
        <Image
          source={{ uri: user.avatar_url ?? undefined }}
          style={styles.heroImage}
          contentFit="cover"
        />

        {/* Dark gradient fade at bottom */}
        <LinearGradient
          colors={["transparent", "rgba(11,10,23,0.5)", BG_COLOR]}
          locations={[0.1, 0.5, 0.95]}
          style={styles.heroGradient}
        />

        {/* Change photo button for own profile */}
        {isOwnProfile ? (
          <View style={styles.changePhotoBtn}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </View>
        ) : null}
      </Pressable>

      {/* Glow is handled by the parent screen */}

      {/* Name + verified badge */}
      <View style={styles.nameRow}>
        <Text style={styles.displayName}>{user.display_name}</Text>
        {user.is_verified ? (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedCheck}>✓</Text>
          </View>
        ) : null}
      </View>

      {/* Location with edit button */}
      {user.location ? (
        <View style={styles.locationRow}>
          <Text style={styles.locationIcon}>📍</Text>
          <Text style={styles.location}>{user.location}</Text>
          {isOwnProfile ? (
            <Pressable
              style={styles.editBtn}
              onPress={() => router.push("/(tabs)/profile/edit")}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Text style={styles.editIcon}>✎</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

      {/* Follower / Following stats */}
      {stats ? (
        <View style={styles.statsRow}>
          <Pressable
            style={styles.stat}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/profile/followers",
                params: { tab: "followers", userId: user.id },
              } as never)
            }
            accessibilityRole="button"
            accessibilityLabel={`${stats.follower_count} Followers`}
          >
            <Text style={styles.statValue}>{stats.follower_count}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>
          <View style={styles.statDivider} />
          <Pressable
            style={styles.stat}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/profile/followers",
                params: { tab: "following", userId: user.id },
              } as never)
            }
            accessibilityRole="button"
            accessibilityLabel={`${stats.following_count} Following`}
          >
            <Text style={styles.statValue}>{stats.following_count}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
        </View>
      ) : null}

      {/* Bio */}
      {user.bio ? <Text style={styles.bio}>{user.bio}</Text> : null}

      {/* Live Session section */}
      <View style={styles.liveSection}>
        <View style={styles.liveHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.liveLabel}>LIVE SESSION!</Text>
        </View>
        <Text style={styles.liveSong}>Achy Breaky Heart</Text>
        <View style={styles.liveControls}>
          {[0, 1, 2, 3].map((i) => (
            <View key={i} style={styles.livePlayBtn}>
              <Text style={styles.playIcon}>▶</Text>
              <WaveformBars height={i === 0 ? 9 : 17} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingBottom: spacing.lg,
  },
  // Hero photo area — large full-bleed like Figma (413x413)
  heroArea: {
    width: SW,
    height: HERO_HEIGHT,
    overflow: "hidden",
  },
  colorWash: {
    ...StyleSheet.absoluteFillObject,
  },
  circleRed: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#fb0d41",
    opacity: 0.6,
    top: -40,
    left: -40,
  },
  circlePink: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#da0b9e",
    opacity: 0.5,
    top: -20,
    right: -50,
  },
  circlePurple: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7240ff",
    opacity: 0.4,
    top: 80,
    left: (SW - 300) / 2,
  },
  heroImage: {
    width: SW + 40,
    height: HERO_HEIGHT + 20,
    marginLeft: -20,
    marginTop: -10,
  },
  contentGlow: {
    position: "absolute",
    top: HERO_HEIGHT - 60,
    left: 0,
    right: 0,
    height: 400,
    overflow: "hidden",
  },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * 0.7,
  },
  changePhotoBtn: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  changePhotoText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 40,
  },
  displayName: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "600",
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.blueAlt,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedCheck: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs,
    gap: 4,
  },
  locationIcon: {
    fontSize: 12,
  },
  location: {
    color: colors.white,
    fontSize: 12,
  },
  editBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  editIcon: {
    color: colors.white,
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.lg,
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 11,
  },
  statDivider: {
    width: 1,
    height: 26,
    backgroundColor: colors.border,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
    lineHeight: 18,
  },
  liveSection: {
    width: 325,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  liveHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fb0d41",
  },
  liveLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  liveSong: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  liveControls: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  livePlayBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0, 0, 0, 0.31)",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  playIcon: {
    color: colors.white,
    fontSize: 10,
  },
});
