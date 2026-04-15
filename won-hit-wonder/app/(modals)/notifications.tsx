import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radii, spacing, typography } from "@/constants/tokens";
import { useNotifications } from "@/features/notifications/useNotifications";
import type { Notification, NotificationType } from "@/lib/types";

const typeEmoji: Record<NotificationType, string> = {
  vote_received: "❤️",
  new_follower: "👤",
  contest_started: "🎉",
  contest_ending_soon: "⏰",
  contest_ended: "🏁",
  submission_approved: "✅",
  submission_rejected: "❌",
  winner_announced: "🏆",
  system: "📢",
};

const formatTimeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationItem = ({ item }: { item: Notification }) => (
  <View style={[styles.item, !item.is_read && styles.itemUnread]}>
    <View style={styles.emojiCircle}>
      <Text style={styles.emoji}>{typeEmoji[item.type]}</Text>
    </View>
    <View style={styles.itemContent}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      {item.body ? (
        <Text style={styles.itemBody} numberOfLines={2}>
          {item.body}
        </Text>
      ) : null}
      <Text style={styles.itemTime}>{formatTimeAgo(item.created_at)}</Text>
    </View>
    {!item.is_read ? <View style={styles.unreadDot} /> : null}
  </View>
);

const NotificationsScreen = () => {
  const { data: notifications, isLoading } = useNotifications();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
    </View>
  );
};

export default NotificationsScreen;

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
  list: {
    paddingVertical: spacing.md,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  itemUnread: {
    backgroundColor: "rgba(116, 47, 229, 0.06)",
  },
  emojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  emoji: {
    fontSize: 20,
  },
  itemContent: {
    flex: 1,
    gap: 2,
  },
  itemTitle: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  itemBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 17,
  },
  itemTime: {
    color: colors.textSecondary,
    fontSize: 11,
    opacity: 0.6,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.purple,
    flexShrink: 0,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    gap: spacing.md,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyText: {
    color: colors.textSecondary,
    ...typography.body,
  },
});
