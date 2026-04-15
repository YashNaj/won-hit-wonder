import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";
import type { Notification } from "@/lib/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  byUser: (userId: string) => ["notifications", userId] as const,
};

const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Notification[];
};

export const useNotifications = () => {
  const userId = useAuthStore((s) => s.user?.id ?? "");

  return useQuery({
    queryKey: notificationKeys.byUser(userId),
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
  });
};
