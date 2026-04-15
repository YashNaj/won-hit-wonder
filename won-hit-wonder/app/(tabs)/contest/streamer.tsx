import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { colors, spacing } from "@/constants/tokens";
import { useRecordingStore } from "@/stores/recording.store";

// Demo lyrics for "Achy Breaky Heart"
const DEMO_LYRICS = [
  { time: 0, line: "You can tell the world" },
  { time: 3, line: "you never was my girl" },
  { time: 6, line: "You can burn my clothes" },
  { time: 9, line: "when I'm gone" },
  { time: 12, line: "" },
  { time: 13, line: "Or you can tell your friends" },
  { time: 16, line: "just what a fool I've been" },
  { time: 19, line: "And laugh and joke" },
  { time: 22, line: "about me on the phone" },
  { time: 25, line: "" },
  { time: 26, line: "[ Chorus ]" },
  { time: 27, line: "" },
  { time: 28, line: "But don't tell my heart" },
  { time: 31, line: "my achy breaky heart" },
  { time: 34, line: "I just don't think" },
  { time: 37, line: "he'd understand" },
  { time: 40, line: "" },
  { time: 41, line: "And if you tell my heart" },
  { time: 44, line: "my achy breaky heart" },
  { time: 47, line: "He might blow up" },
  { time: 50, line: "and kill this man" },
  { time: 53, line: "" },
  { time: 54, line: "[ Verse 2 ]" },
  { time: 55, line: "" },
  { time: 56, line: "You can tell your ma" },
  { time: 59, line: "I moved to Arkansas" },
  { time: 62, line: "You can tell your dog" },
  { time: 65, line: "to bite my leg" },
];

const StreamerScreen = () => {
  const insets = useSafeAreaInsets();
  const { songTitle } = useRecordingStore();
  const [elapsed, setElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<ScrollView>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    } else if (timer.current) {
      clearInterval(timer.current);
    }
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [isPlaying]);

  // Auto-scroll lyrics
  useEffect(() => {
    const currentIdx = DEMO_LYRICS.findLastIndex((l) => l.time <= elapsed);
    if (currentIdx > 2 && scrollRef.current) {
      scrollRef.current.scrollTo({ y: currentIdx * 42 - 100, animated: true });
    }
  }, [elapsed]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    router.back();
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0d0015", "#1a0533", "#0b0a17"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Top info */}
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <View style={styles.songInfo}>
          <Text style={styles.artistName}>Charlie Day</Text>
          <Text style={styles.songName}>
            {songTitle ?? "Achy Breaky Heart"}
          </Text>
        </View>
        <Text style={styles.timer}>{formatTime(elapsed)} / 3:21</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min((elapsed / 201) * 100, 100)}%` },
          ]}
        />
      </View>

      {/* Lyrics */}
      <ScrollView
        ref={scrollRef}
        style={styles.lyricsScroll}
        contentContainerStyle={styles.lyricsContent}
        showsVerticalScrollIndicator={false}
      >
        {DEMO_LYRICS.map((lyric, i) => {
          const isCurrent =
            elapsed >= lyric.time &&
            (i === DEMO_LYRICS.length - 1 || elapsed < DEMO_LYRICS[i + 1].time);
          const isPast = elapsed > lyric.time && !isCurrent;
          const isMarker = lyric.line.startsWith("[");

          return (
            <Text
              key={i}
              style={[
                styles.lyricLine,
                isCurrent && styles.lyricCurrent,
                isPast && styles.lyricPast,
                isMarker && styles.lyricMarker,
                !lyric.line && styles.lyricEmpty,
              ]}
            >
              {lyric.line}
            </Text>
          );
        })}
      </ScrollView>

      {/* Bottom controls — Stop / Pause / Record */}
      <View style={styles.bottomPanel}>
        <View style={styles.handle} />
        <View style={styles.controls}>
          <Pressable
            onPress={handleStop}
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Stop"
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
            accessibilityLabel={isPlaying ? "Pause" : "Resume"}
          >
            <View style={[styles.controlCircle, styles.pauseCircle]}>
              {isPlaying ? (
                <View style={styles.pauseBars}>
                  <View style={styles.pauseBar} />
                  <View style={styles.pauseBar} />
                </View>
              ) : (
                <Text style={styles.playTriangle}>▶</Text>
              )}
            </View>
            <Text style={[styles.controlLabel, { color: colors.blue }]}>
              {isPlaying ? "Pause" : "Resume"}
            </Text>
          </Pressable>

          <Pressable
            style={styles.controlBtn}
            accessibilityRole="button"
            accessibilityLabel="Record"
          >
            <View style={[styles.controlCircle, styles.recordCircle]}>
              <View style={styles.recordInner} />
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

export default StreamerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: 4,
  },
  songInfo: {
    alignItems: "center",
    gap: 2,
  },
  artistName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
  songName: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  timer: {
    color: colors.textSecondary,
    fontSize: 10,
    fontVariant: ["tabular-nums"],
    marginTop: 4,
  },
  progressTrack: {
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: 1,
  },
  progressFill: {
    height: 2,
    backgroundColor: colors.white,
    borderRadius: 1,
  },
  lyricsScroll: {
    flex: 1,
    marginTop: spacing.xl,
  },
  lyricsContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 200,
  },
  lyricLine: {
    color: "rgba(255, 255, 255, 0.3)",
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 42,
  },
  lyricCurrent: {
    color: colors.white,
  },
  lyricPast: {
    color: "rgba(255, 255, 255, 0.15)",
  },
  lyricMarker: {
    color: colors.purple,
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },
  lyricEmpty: {
    height: 20,
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
  playTriangle: {
    color: colors.blue,
    fontSize: 22,
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
  controlLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
});
