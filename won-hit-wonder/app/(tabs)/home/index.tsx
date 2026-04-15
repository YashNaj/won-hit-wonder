import { useCallback, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import type { ViewToken } from "react-native";

import { router } from "expo-router";

import { AppHeader } from "@/components/AppHeader";
import { ContestCountdown } from "@/features/feed/ContestCountdown";
import { FeedCard } from "@/features/feed/FeedCard";
import { FeedFilters } from "@/features/feed/FeedFilters";
import type { LocationFilter, SortOption } from "@/features/feed/FeedFilters";
import { useFeed } from "@/features/feed/useFeed";
import { useVote } from "@/features/feed/useVote";
import { colors, spacing } from "@/constants/tokens";
import type { FeedSubmission } from "@/lib/types";

const { height: SH } = Dimensions.get("window");
const CARD_HEIGHT = SH - 85;

const HomeScreen = () => {
  const { contest, submissions, isLoading } = useFeed();
  const { votedSubmissionId, toggleVote } = useVote(contest?.id ?? "");

  // Filter state
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [sort, setSort] = useState<SortOption>("popular");
  const [location, setLocation] = useState<LocationFilter>("global");
  const [showBestShot, setShowBestShot] = useState(false);

  // Apply sort to submissions client-side
  const sortedSubmissions = useMemo(() => {
    if (!submissions) return [];
    const sorted = [...submissions];
    switch (sort) {
      case "popular":
        sorted.sort((a, b) => b.vote_count - a.vote_count);
        break;
      case "recent":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
        break;
      case "least":
        sorted.sort((a, b) => a.vote_count - b.vote_count);
        break;
      case "no_votes":
        return sorted.filter((s) => s.vote_count === 0);
    }
    return sorted;
  }, [submissions, sort]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;
  const onViewableItemsChanged = useRef(
    (_info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {},
  ).current;

  const getItemLayout = useCallback(
    (_data: unknown, index: number) => ({
      length: CARD_HEIGHT,
      offset: CARD_HEIGHT * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback((item: FeedSubmission) => item.id, []);

  const handleCardPress = useCallback((submissionId: string) => {
    router.push(`/(tabs)/home/stream/${submissionId}` as never);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: FeedSubmission }) => (
      <FeedCard
        submission={item}
        isVoted={votedSubmissionId === item.id}
        onVote={() => toggleVote(item.id)}
        onPress={() => handleCardPress(item.id)}
      />
    ),
    [votedSubmissionId, toggleVote, handleCardPress],
  );

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader unreadCount={3} />

      {/* Countdown + filter button */}
      <View style={styles.topOverlay}>
        <ContestCountdown />
        <Pressable
          onPress={() => setFiltersVisible(true)}
          style={styles.filterBtn}
          accessibilityRole="button"
          accessibilityLabel="Open filters"
        >
          <Text style={styles.filterIcon}>⚙</Text>
          <Text style={styles.filterText}>Filters</Text>
        </Pressable>
      </View>

      <FlatList
        data={sortedSubmissions}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT}
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        removeClippedSubviews
        maxToRenderPerBatch={3}
        initialNumToRender={2}
        windowSize={5}
      />

      <FeedFilters
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        sort={sort}
        onSortChange={setSort}
        location={location}
        onLocationChange={setLocation}
        showBestShot={showBestShot}
        onBestShotChange={setShowBestShot}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  topOverlay: {
    position: "absolute",
    top: 55,
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: "center",
    gap: spacing.sm,
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  filterIcon: {
    fontSize: 12,
  },
  filterText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "600",
  },
});
