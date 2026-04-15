import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";

import { GradientButton } from "@/components/GradientButton";
import { ContestCountdown } from "@/features/feed/ContestCountdown";
import { colors, radii, spacing } from "@/constants/tokens";
import { useRecordingStore } from "@/stores/recording.store";

const UploadEntry = () => {
  const insets = useSafeAreaInsets();
  const { songTitle, setVideoUri } = useRecordingStore();

  const [mainVideo, setMainVideo] = useState<string | null>(null);
  const [highlightVideo, setHighlightVideo] = useState<string | null>(null);

  const pickVideo = useCallback(
    async (type: "main" | "highlight") => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Please grant media library access.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["videos"],
        allowsEditing: true,
        quality: 0.8,
      });

      if (result.canceled || !result.assets[0]) return;

      const uri = result.assets[0].uri;
      if (type === "main") {
        setMainVideo(uri);
        setVideoUri(uri);
      } else {
        setHighlightVideo(uri);
      }
    },
    [setVideoUri],
  );

  const handleContinue = useCallback(() => {
    if (!mainVideo) {
      Alert.alert("Upload required", "Please upload your performance video.");
      return;
    }
    router.push("/(tabs)/contest/rules");
  }, [mainVideo]);

  const handleRecord = useCallback(() => {
    router.push("/(tabs)/contest/record");
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Text style={styles.backArrow}>‹</Text>
          </Pressable>
          <Text style={styles.title}>Upload Your Entry</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Song info */}
        <Text style={styles.songLabel}>🎵 {songTitle ?? "Selected Song"}</Text>

        {/* Contest timer */}
        <View style={styles.timerSection}>
          <ContestCountdown />
        </View>

        {/* Main video upload */}
        <Text style={styles.sectionTitle}>Full Performance</Text>
        <Pressable
          style={styles.uploadSlot}
          onPress={() => pickVideo("main")}
          accessibilityRole="button"
          accessibilityLabel="Upload full performance video"
        >
          {mainVideo ? (
            <Image
              source={{ uri: mainVideo }}
              style={styles.videoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>🎬</Text>
              <Text style={styles.uploadText}>Upload Video</Text>
              <Text style={styles.uploadHint}>Tap to choose from library</Text>
            </View>
          )}
          {mainVideo ? (
            <View style={styles.checkBadge}>
              <Text style={styles.checkText}>✓</Text>
            </View>
          ) : null}
        </Pressable>

        {/* Or record */}
        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.orLine} />
        </View>

        <Pressable
          onPress={handleRecord}
          style={styles.recordBtn}
          accessibilityRole="button"
          accessibilityLabel="Record a new video"
        >
          <Text style={styles.recordIcon}>🎤</Text>
          <Text style={styles.recordText}>Record In-App</Text>
        </Pressable>

        {/* Highlight video */}
        <Text style={styles.sectionTitle}>15 Second Highlight</Text>
        <Text style={styles.sectionHint}>
          A short clip that shows your best moment
        </Text>
        <Pressable
          style={[styles.uploadSlot, styles.uploadSlotSmall]}
          onPress={() => pickVideo("highlight")}
          accessibilityRole="button"
          accessibilityLabel="Upload highlight video"
        >
          {highlightVideo ? (
            <Image
              source={{ uri: highlightVideo }}
              style={styles.videoPreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadIcon}>✂️</Text>
              <Text style={styles.uploadText}>Upload Highlight</Text>
              <Text style={styles.uploadHint}>Optional</Text>
            </View>
          )}
        </Pressable>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <GradientButton
          label="Continue to Rules"
          onPress={handleContinue}
          accessibilityHint="Review contest rules before submitting"
        />
      </View>
    </View>
  );
};

export default UploadEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    marginTop: -3,
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  songLabel: {
    color: colors.gold,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  timerSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  sectionHint: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  uploadSlot: {
    height: 320,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    borderStyle: "dashed",
    overflow: "hidden",
    marginBottom: spacing.lg,
  },
  uploadSlotSmall: {
    height: 200,
  },
  videoPreview: {
    width: "100%",
    height: "100%",
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    gap: spacing.sm,
  },
  uploadIcon: {
    fontSize: 40,
  },
  uploadText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  uploadHint: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  checkBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.purple,
    justifyContent: "center",
    alignItems: "center",
  },
  checkText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  orText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  recordBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    height: 48,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.purple,
    marginBottom: spacing.xl,
  },
  recordIcon: {
    fontSize: 18,
  },
  recordText: {
    color: colors.purple,
    fontSize: 15,
    fontWeight: "600",
  },
  spacer: {
    height: spacing.xxl,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: "center",
  },
});
