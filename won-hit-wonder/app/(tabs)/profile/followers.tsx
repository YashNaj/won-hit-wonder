import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";

import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import type { User } from "@/lib/types";

type Tab = "followers" | "following";

const UserRow = ({ user: u }: { user: User }) => (
  <Pressable
    style={styles.userRow}
    onPress={() => router.push(`/(tabs)/profile/${u.id}` as never)}
    accessibilityRole="button"
    accessibilityLabel={u.display_name ?? u.email}
  >
    <View style={styles.avatar}>
      <Image
        source={{ uri: u.avatar_url ?? undefined }}
        style={styles.avatarImg}
        contentFit="cover"
      />
    </View>
    <View style={styles.userInfo}>
      <Text style={styles.userName} numberOfLines={1}>
        {u.display_name ?? u.username ?? "User"}
      </Text>
      {u.location ? (
        <Text style={styles.userLocation} numberOfLines={1}>
          📍 {u.location}
        </Text>
      ) : null}
    </View>
  </Pressable>
);

const FollowersScreen = () => {
  const params = useLocalSearchParams<{ tab?: string; userId?: string }>();
  const currentUserId = useAuthStore((s) => s.user?.id ?? "");
  const targetUserId = params.userId ?? currentUserId;

  const [activeTab, setActiveTab] = useState<Tab>(
    (params.tab as Tab) ?? "followers",
  );
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);

      // Fetch followers (people who follow this user)
      const { data: followerData } = await supabase
        .from("follows")
        .select("follower:users!follows_follower_id_fkey(*)")
        .eq("following_id", targetUserId);

      // Fetch following (people this user follows)
      const { data: followingData } = await supabase
        .from("follows")
        .select("following:users!follows_following_id_fkey(*)")
        .eq("follower_id", targetUserId);

      setFollowers(
        (followerData ?? []).map(
          (r) => (r as unknown as { follower: User }).follower,
        ),
      );
      setFollowing(
        (followingData ?? []).map(
          (r) => (r as unknown as { following: User }).following,
        ),
      );
      setIsLoading(false);
    };
    load();
  }, [targetUserId]);

  const data = activeTab === "followers" ? followers : following;

  const filtered = search.trim()
    ? data.filter(
        (u) =>
          u.display_name?.toLowerCase().includes(search.toLowerCase()) ||
          u.username?.toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  const renderItem = useCallback(
    ({ item }: { item: User }) => <UserRow user={item} />,
    [],
  );

  return (
    <View style={styles.container}>
      {/* Tab switcher */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "followers" && styles.tabActive]}
          onPress={() => setActiveTab("followers")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "followers" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "followers" && styles.tabTextActive,
            ]}
          >
            Followers ({followers.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "following" && styles.tabActive]}
          onPress={() => setActiveTab("following")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "following" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "following" && styles.tabTextActive,
            ]}
          >
            Following ({following.length})
          </Text>
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search..."
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          accessibilityLabel="Search followers"
        />
      </View>

      <Text style={styles.hint}>
        You will be notified about artists you follow.
      </Text>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.purple}
          style={styles.loader}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                {search ? "No results found" : "No one yet"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default FollowersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.purple,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: "700",
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    height: 36,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    color: colors.white,
    fontSize: 14,
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  loader: {
    marginTop: spacing.xxl,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  userLocation: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  empty: {
    alignItems: "center",
    paddingTop: spacing.xxl,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
