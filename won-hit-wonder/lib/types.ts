export type ContestStatus =
  | "upcoming"
  | "active"
  | "voting"
  | "completed"
  | "cancelled";
export type SubmissionStatus =
  | "processing"
  | "published"
  | "rejected"
  | "flagged";
export type NotificationType =
  | "vote_received"
  | "new_follower"
  | "contest_started"
  | "contest_ending_soon"
  | "contest_ended"
  | "submission_approved"
  | "submission_rejected"
  | "winner_announced"
  | "system";

export interface User {
  id: string;
  email: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  is_verified: boolean;
  is_onboarded: boolean;
  notification_daily: boolean;
  notification_in_app: boolean;
  created_at: string;
  updated_at: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string | null;
  status: ContestStatus;
  starts_at: string;
  ends_at: string;
  voting_ends_at: string;
  prize_cash_amount: number;
  prize_record_deal: boolean;
  winner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  duration_ms: number;
  backing_track_url: string;
  cover_image_url: string | null;
  lyrics_json: Array<{ time_ms: number; line: string }> | null;
  is_active: boolean;
  created_at: string;
}

export interface Submission {
  id: string;
  contest_id: string;
  user_id: string;
  song_id: string;
  video_url: string;
  thumbnail_url: string | null;
  duration_ms: number | null;
  status: SubmissionStatus;
  vote_count: number;
  created_at: string;
  updated_at: string;
}

export interface FeedSubmission extends Submission {
  user: User;
  song: Song;
}

export interface Vote {
  id: string;
  submission_id: string;
  voter_id: string;
  contest_id: string;
  created_at: string;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface ProfileQA {
  id: string;
  user_id: string;
  question: string;
  answer: string | null;
  emoji: string;
  accent_color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  data: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

export interface UserStats {
  id: string;
  follower_count: number;
  following_count: number;
  submission_count: number;
}

export interface ActiveContest {
  id: string;
  title: string;
  status: ContestStatus;
  starts_at: string;
  ends_at: string;
  voting_ends_at: string;
  prize_cash_amount: number;
  prize_record_deal: boolean;
  days_remaining: number;
  hours_remaining: number;
  minutes_remaining: number;
  seconds_remaining: number;
}
