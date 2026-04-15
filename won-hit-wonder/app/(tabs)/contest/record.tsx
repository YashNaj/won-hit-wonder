import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { colors, spacing } from "@/constants/tokens";
import { useRecordingStore } from "@/stores/recording.store";

const RecordScreen = () => {
  const router = useRouter();
  const { songTitle } = useRecordingStore();
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRecording) {
      timer.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isRecording]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const handleRecord = useCallback(() => {
    setIsRecording(true);
  }, []);

  const handleStop = useCallback(() => {
    setIsRecording(false);
    // Go back to the upload screen — submission happens via rules screen
    router.back();
  }, [router]);

  const handlePause = useCallback(() => {
    setIsRecording(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Simulated camera viewfinder */}
      <LinearGradient
        colors={["#0d0015", "#1a0533", "#0b0a17"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top info */}
      <View style={styles.topBar}>
        <Text style={styles.songLabel}>🎵 {songTitle ?? "Select a song"}</Text>
        <View style={styles.timerBadge}>
          {isRecording ? <View style={styles.recDot} /> : null}
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
      </View>

      {/* Center - camera placeholder */}
      <View style={styles.center}>
        <Text style={styles.cameraPlaceholder}>📹</Text>
        <Text style={styles.cameraText}>
          {isRecording ? "Recording..." : "Tap Record to begin"}
        </Text>
      </View>

      {/* Bottom controls — matches Figma: Stop / Pause / Record */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />
        <View style={styles.controls}>
          <Pressable
            onPress={handleStop}
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Stop recording"
          >
            <View style={[styles.controlCircle, styles.stopCircle]}>
              <View style={styles.stopSquare} />
            </View>
            <Text style={[styles.controlLabel, { color: colors.hotPink }]}>
              Stop
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePause}
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Pause recording"
          >
            <View style={[styles.controlCircle, styles.pauseCircle]}>
              <View style={styles.pauseBars}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            </View>
            <Text style={[styles.controlLabel, { color: colors.blue }]}>
              Pause
            </Text>
          </Pressable>

          <Pressable
            onPress={handleRecord}
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Start recording"
          >
            <View style={[styles.controlCircle, styles.recordCircle]}>
              <View
                style={[
                  styles.recordInner,
                  isRecording && styles.recordInnerActive,
                ]}
              />
            </View>
            <Text style={[styles.controlLabel, { color: colors.white }]}>
              Record
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
  },
  songLabel: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  timerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fb0d41",
  },
  timerText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  cameraPlaceholder: {
    fontSize: 64,
  },
  cameraText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  bottomPanel: {
    backgroundColor: "rgba(1, 1, 1, 0.85)",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  handle: {
    width: 49,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.white,
    marginBottom: spacing.lg,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xxl,
  },
  controlBtn: {
    alignItems: "center",
    gap: spacing.sm,
  },
  controlCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: "center",
    alignItems: "center",
  },
  stopCircle: {
    backgroundColor: "rgba(255, 24, 121, 0.15)",
    borderWidth: 2,
    borderColor: colors.hotPink,
  },
  stopSquare: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: colors.hotPink,
  },
  pauseCircle: {
    backgroundColor: "rgba(18, 94, 254, 0.15)",
    borderWidth: 2,
    borderColor: colors.blue,
  },
  pauseBars: {
    flexDirection: "row",
    gap: 6,
  },
  pauseBar: {
    width: 5,
    height: 22,
    borderRadius: 2,
    backgroundColor: colors.blue,
  },
  recordCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 2,
    borderColor: colors.white,
  },
  recordInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fb0d41",
  },
  recordInnerActive: {
    borderRadius: 4,
    width: 22,
    height: 22,
  },
  controlLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
