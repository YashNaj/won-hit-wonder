import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useQueryClient } from "@tanstack/react-query";

import { GlassBackground } from "@/components/GlassBackground";
import { ActiveSubmission } from "@/features/profile/ActiveSubmission";
import { ProfileHeader } from "@/features/profile/ProfileHeader";
import { QACard } from "@/features/profile/QACard";
import { SubmissionGrid } from "@/features/profile/SubmissionGrid";
import { useProfile } from "@/features/profile/useProfile";
import { colors, radii, spacing } from "@/constants/tokens";
import { updateProfileQAAnswer } from "@/lib/api/profileQas";
import { userKeys } from "@/lib/api/users";
import { useAuthStore } from "@/stores/auth.store";
import type { ProfileQA } from "@/lib/types";

const ProfileScreen = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");
  const queryClient = useQueryClient();
  const { user, stats, qas, submissions, isLoading } = useProfile(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState<Record<string, string>>(
    {},
  );
  const [isSaving, setIsSaving] = useState(false);

  const activeSubmission = submissions[0];

  const handleEdit = useCallback(() => {
    const answers: Record<string, string> = {};
    qas.forEach((qa) => {
      answers[qa.id] = qa.answer ?? "";
    });
    setEditedAnswers(answers);
    setIsEditing(true);
  }, [qas]);

  const handleAnswerChange = useCallback((qaId: string, answer: string) => {
    setEditedAnswers((prev) => ({ ...prev, [qaId]: answer }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    const promises = Object.entries(editedAnswers).map(([qaId, answer]) =>
      updateProfileQAAnswer(qaId, answer),
    );
    await Promise.all(promises);
    queryClient.invalidateQueries({ queryKey: userKeys.qas(userId) });
    setIsEditing(false);
    setIsSaving(false);
  }, [editedAnswers, userId, queryClient]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedAnswers({});
  }, []);

  if (isLoading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  const displayQAs: ProfileQA[] = isEditing
    ? qas.map((qa) => ({
        ...qa,
        answer: editedAnswers[qa.id] ?? qa.answer,
      }))
    : qas;

  return (
    <GlassBackground variant="profile">
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          user={user}
          stats={stats}
          isOwnProfile={true}
          onAvatarUpdated={() =>
            queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) })
          }
        />

        {/* Edit / Save toggle */}
        <View style={styles.editRow}>
          {isEditing ? (
            <View style={styles.editActions}>
              <Pressable
                onPress={handleCancel}
                style={styles.cancelBtn}
                accessibilityRole="button"
                accessibilityLabel="Cancel editing"
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={styles.saveBtn}
                accessibilityRole="button"
                accessibilityLabel="Save changes"
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={handleEdit}
              style={styles.editBtn}
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
            >
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          )}
        </View>

        {/* Active Submission Highlight */}
        <ActiveSubmission submission={activeSubmission} />

        {/* Q&A Section — inline editable */}
        {displayQAs.length > 0 ? (
          <View style={styles.qaSection}>
            {displayQAs.map((qa) => (
              <QACard
                key={qa.id}
                qa={qa}
                isEditing={isEditing}
                onAnswerChange={handleAnswerChange}
              />
            ))}
          </View>
        ) : null}

        {/* Submissions Grid */}
        <SubmissionGrid submissions={submissions} />

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </GlassBackground>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  loading: {
    flex: 1,
    backgroundColor: "#0b0a17",
    justifyContent: "center",
    alignItems: "center",
  },
  editRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  editBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: radii.sm,
  },
  editText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  editActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "500",
  },
  saveBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    backgroundColor: colors.purple,
    borderRadius: radii.sm,
    minWidth: 60,
    alignItems: "center",
  },
  saveText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
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
