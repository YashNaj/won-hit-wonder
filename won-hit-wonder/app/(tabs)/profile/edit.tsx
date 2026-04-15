import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Image } from "expo-image";
import { useRouter } from "expo-router";

import { GlassInput } from "@/components/GlassInput";
import { GradientButton } from "@/components/GradientButton";
import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

const EditProfileScreen = () => {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const load = async () => {
      const { data } = await supabase
        .from("users")
        .select("display_name, username, bio, location, avatar_url")
        .eq("id", userId)
        .single();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setUsername(data.username ?? "");
        setBio(data.bio ?? "");
        setLocation(data.location ?? "");
        setAvatarUrl(data.avatar_url);
      }
      setIsLoading(false);
    };
    load();
  }, [userId]);

  const handleSave = useCallback(async () => {
    if (!userId) return;
    setIsSaving(true);
    await supabase
      .from("users")
      .update({
        display_name: displayName.trim(),
        username: username.trim() || null,
        bio: bio.trim() || null,
        location: location.trim() || null,
      })
      .eq("id", userId);
    setIsSaving(false);
    router.back();
  }, [userId, displayName, username, bio, location, router]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        {/* Avatar */}
        <Pressable
          style={styles.avatarSection}
          accessibilityRole="button"
          accessibilityLabel="Change profile photo"
        >
          <View style={styles.avatarBorder}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatar}
                contentFit="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarPlaceholderText}>📷</Text>
              </View>
            )}
          </View>
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </Pressable>

        {/* Form fields */}
        <View style={styles.form}>
          <GlassInput
            label="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Your name"
            autoCapitalize="words"
            accessibilityLabel="Display name"
          />
          <GlassInput
            label="Username"
            value={username}
            onChangeText={setUsername}
            placeholder="@username"
            autoCapitalize="none"
            accessibilityLabel="Username"
          />
          <GlassInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself..."
            autoCapitalize="sentences"
            accessibilityLabel="Bio"
          />
          <GlassInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="City, State"
            autoCapitalize="words"
            accessibilityLabel="Location"
          />
        </View>

        {/* Save button */}
        <View style={styles.buttonArea}>
          {isSaving ? (
            <ActivityIndicator color={colors.purple} size="large" />
          ) : (
            <GradientButton
              label="Save Changes"
              onPress={handleSave}
              accessibilityHint="Saves your profile changes"
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: colors.purple,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(116, 47, 229, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderText: {
    fontSize: 32,
  },
  changePhotoText: {
    color: colors.blueAlt,
    fontSize: 14,
    fontWeight: "600",
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  buttonArea: {
    minHeight: 56,
    justifyContent: "center",
  },
});
