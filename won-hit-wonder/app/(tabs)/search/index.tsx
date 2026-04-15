import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image } from "expo-image";
import { router } from "expo-router";

import { colors, radii, spacing } from "@/constants/tokens";
import { supabase } from "@/lib/supabase";
import type { FeedSubmission, User } from "@/lib/types";

type Tab = "users" | "posts";

interface SearchResult {
  users: User[];
  posts: FeedSubmission[];
}

const UserResult = ({ user: u }: { user: User }) => (
  <Pressable
    style={styles.userRow}
    onPress={() => router.push(`/(tabs)/profile/${u.id}` as never)}
    accessibilityRole="button"
    accessibilityLabel={u.display_name ?? "User"}
  >
    <View style={styles.avatar}>
      <Image
        source={{ uri: u.avatar_url ?? undefined }}
        style={styles.avatarImg}
        contentFit="cover"
      />
    </View>
    <View style={styles.userInfo}>
      <View style={styles.nameRow}>
        <Text style={styles.userName} numberOfLines={1}>
          {u.display_name}
        </Text>
        {u.is_verified ? <Text style={styles.verified}>✓</Text> : null}
      </View>
      {u.username ? (
        <Text style={styles.userHandle} numberOfLines={1}>
          @{u.username}
        </Text>
      ) : null}
      {u.location ? (
        <Text style={styles.userLocation} numberOfLines={1}>
          📍 {u.location}
        </Text>
      ) : null}
    </View>
  </Pressable>
);

const PostResult = ({ post }: { post: FeedSubmission }) => (
  <Pressable
    style={styles.postRow}
    onPress={() => router.push(`/(tabs)/home/stream/${post.id}` as never)}
    accessibilityRole="button"
    accessibilityLabel={`${post.user?.display_name} - ${post.song?.title}`}
  >
    <Image
      source={{ uri: post.thumbnail_url ?? undefined }}
      style={styles.postThumb}
      contentFit="cover"
    />
    <View style={styles.postInfo}>
      <Text style={styles.postSong} numberOfLines={1}>
        🎵 {post.song?.title}
      </Text>
      <Text style={styles.postArtist} numberOfLines={1}>
        {post.song?.artist}
      </Text>
      <View style={styles.postMeta}>
        <Text style={styles.postUser}>{post.user?.display_name}</Text>
        <Text style={styles.postVotes}>❤️ {post.vote_count}</Text>
      </View>
    </View>
  </Pressable>
);

const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [results, setResults] = useState<SearchResult>({
    users: [],
    posts: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setResults({ users: [], posts: [] });
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    // Search users by name/username (trigram index)
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .or(`display_name.ilike.%${trimmed}%,username.ilike.%${trimmed}%`)
      .limit(20);

    // Search submissions by song title/artist
    const { data: posts } = await supabase
      .from("submissions")
      .select("*, user:users(*), song:songs(*)")
      .eq("status", "published")
      .or(`song.title.ilike.%${trimmed}%,song.artist.ilike.%${trimmed}%`, {
        referencedTable: "songs",
      })
      .order("vote_count", { ascending: false })
      .limit(20);

    setResults({
      users: (users as User[]) ?? [],
      posts: (posts as FeedSubmission[]) ?? [],
    });
    setIsLoading(false);
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);
      // Debounced search — search after user pauses typing
      const timeout = setTimeout(() => search(text), 400);
      return () => clearTimeout(timeout);
    },
    [search],
  );

  const data = activeTab === "users" ? results.users : results.posts;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={[styles.searchBar, { paddingTop: insets.top + spacing.sm }]}>
        <View style={styles.inputContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={handleChangeText}
            placeholder="Search users or songs..."
            placeholderTextColor="rgba(255, 255, 255, 0.3)"
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Search"
          />
          {query ? (
            <Pressable
              onPress={() => {
                setQuery("");
                setResults({ users: [], posts: [] });
                setHasSearched(false);
              }}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clearBtn}>✕</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          style={[styles.tab, activeTab === "users" && styles.tabActive]}
          onPress={() => setActiveTab("users")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "users" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "users" && styles.tabTextActive,
            ]}
          >
            Users ({results.users.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "posts" && styles.tabActive]}
          onPress={() => setActiveTab("posts")}
          accessibilityRole="tab"
          accessibilityState={{ selected: activeTab === "posts" }}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "posts" && styles.tabTextActive,
            ]}
          >
            Posts ({results.posts.length})
          </Text>
        </Pressable>
      </View>

      {/* Results */}
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.purple}
          style={styles.loader}
        />
      ) : !hasSearched ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={styles.emptyTitle}>Discover</Text>
          <Text style={styles.emptySubtext}>
            Search for artists, songs, or performances
          </Text>
        </View>
      ) : (
        <FlatList
          data={data as (User | FeedSubmission)[]}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) =>
            activeTab === "users" ? (
              <UserResult user={item as User} />
            ) : (
              <PostResult post={item as FeedSubmission} />
            )
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptySubtext}>No results found</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchBar: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
  },
  searchIcon: {
    fontSize: 16,
  },
  input: {
    flex: 1,
    color: colors.white,
    fontSize: 15,
  },
  clearBtn: {
    color: colors.textSecondary,
    fontSize: 14,
    padding: 4,
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
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
  loader: {
    marginTop: spacing.xxl,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 100,
    gap: spacing.sm,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  // User result
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userName: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  verified: {
    color: colors.blueAlt,
    fontSize: 12,
    fontWeight: "700",
  },
  userHandle: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  userLocation: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  // Post result
  postRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  postThumb: {
    width: 64,
    height: 64,
    borderRadius: radii.sm,
  },
  postInfo: {
    flex: 1,
    gap: 3,
  },
  postSong: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  postArtist: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  postMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  postUser: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  postVotes: {
    color: colors.textSecondary,
    fontSize: 12,
  },
});
