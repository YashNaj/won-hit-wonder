import { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router, useLocalSearchParams } from "expo-router";

import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { QACard } from "@/features/profile/QACard";
import { SubmissionGrid } from "@/features/profile/SubmissionGrid";
import { useFollow } from "@/features/profile/useFollow";
import { useProfile } from "@/features/profile/useProfile";
import { colors, radii, spacing } from "@/constants/tokens";

const UserProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, stats, qas, submissions, isLoading } = useProfile(id ?? "");
  const { isFollowing, checkFollow, toggle } = useFollow(id ?? "");

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.navigate("/(tabs)/home" as never);
    }
  }, []);

  useEffect(() => {
    if (id) checkFollow();
  }, [id, checkFollow]);

  if (isLoading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Floating back button */}
      <Pressable
        onPress={handleBack}
        style={[styles.backBtn, { top: insets.top + 8 }]}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Text style={styles.backArrow}>‹</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={user} stats={stats} isOwnProfile={false} />

        {/* Follow button */}
        <View style={styles.followRow}>
          <Pressable
            onPress={toggle}
            style={[styles.followBtn, isFollowing && styles.followBtnActive]}
            accessibilityRole="button"
            accessibilityLabel={isFollowing ? "Unfollow" : "Follow"}
          >
            <Text
              style={[
                styles.followText,
                isFollowing && styles.followTextActive,
              ]}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>
        </View>

        {/* Q&A Section */}
        {qas.length > 0 ? (
          <View style={styles.qaSection}>
            {qas.map((qa) => (
              <QACard key={qa.id} qa={qa} />
            ))}
          </View>
        ) : null}

        {/* Submissions Grid */}
        <SubmissionGrid submissions={submissions} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    marginTop: -3,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  followRow: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  followBtn: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.purple,
    backgroundColor: colors.purple,
  },
  followBtnActive: {
    backgroundColor: "transparent",
  },
  followText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  followTextActive: {
    color: colors.purple,
  },
  qaSection: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});
