-- Won Hit Wonder - Initial Schema
-- Targets live Supabase instance (cyrnqoojtippcvdhgkou)

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================
create type contest_status as enum ('upcoming', 'active', 'voting', 'completed', 'cancelled');
create type submission_status as enum ('processing', 'published', 'rejected', 'flagged');
create type notification_type as enum (
  'vote_received',
  'new_follower',
  'contest_started',
  'contest_ending_soon',
  'contest_ended',
  'submission_approved',
  'submission_rejected',
  'winner_announced',
  'system'
);
create type report_reason as enum ('inappropriate', 'copyright', 'spam', 'other');

-- ============================================================
-- USERS (clone of auth.users, auto-synced)
-- ============================================================
create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  is_verified boolean not null default false,
  is_onboarded boolean not null default false,
  notification_daily boolean not null default true,
  notification_in_app boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table users enable row level security;

create policy "Users are viewable by everyone"
  on users for select using (true);

create policy "Users can update own record"
  on users for update using (auth.uid() = id);

create policy "Users can insert own record"
  on users for insert with check (auth.uid() = id);

-- Auto-create public.users row on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Sync email if changed in auth
create or replace function handle_user_updated()
returns trigger as $$
begin
  update public.users
  set email = new.email
  where id = new.id;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_updated
  after update of email on auth.users
  for each row execute function handle_user_updated();

-- ============================================================
-- PROFILE Q&A
-- ============================================================
create table profile_qas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  question text not null,
  answer text,
  emoji text not null default '🎵',
  accent_color text not null default '#1867ff',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profile_qas enable row level security;

create policy "Q&As are viewable by everyone"
  on profile_qas for select using (true);

create policy "Users can insert own Q&As"
  on profile_qas for insert with check (auth.uid() = user_id);

create policy "Users can update own Q&As"
  on profile_qas for update using (auth.uid() = user_id);

create policy "Users can delete own Q&As"
  on profile_qas for delete using (auth.uid() = user_id);

-- ============================================================
-- FOLLOWS
-- ============================================================
create table follows (
  follower_id uuid not null references users(id) on delete cascade,
  following_id uuid not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

alter table follows enable row level security;

create policy "Follows are viewable by everyone"
  on follows for select using (true);

create policy "Users can follow"
  on follows for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on follows for delete using (auth.uid() = follower_id);

-- ============================================================
-- CONTESTS
-- ============================================================
create table contests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status contest_status not null default 'upcoming',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  voting_ends_at timestamptz not null,
  prize_cash_amount int not null default 10000,
  prize_record_deal boolean not null default true,
  winner_id uuid references users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (voting_ends_at >= ends_at)
);

alter table contests enable row level security;

create policy "Contests are viewable by everyone"
  on contests for select using (true);

-- ============================================================
-- SONGS
-- ============================================================
create table songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text not null,
  duration_ms int not null,
  backing_track_url text not null,
  cover_image_url text,
  lyrics_json jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table songs enable row level security;

create policy "Active songs are viewable by everyone"
  on songs for select using (is_active = true);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
create table submissions (
  id uuid primary key default gen_random_uuid(),
  contest_id uuid not null references contests(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  song_id uuid not null references songs(id),
  video_url text not null,
  thumbnail_url text,
  duration_ms int,
  status submission_status not null default 'processing',
  vote_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (contest_id, user_id)
);

alter table submissions enable row level security;

create policy "Published submissions are viewable by everyone"
  on submissions for select using (status = 'published');

create policy "Users can view own submissions regardless of status"
  on submissions for select using (auth.uid() = user_id);

create policy "Users can insert own submissions"
  on submissions for insert with check (auth.uid() = user_id);

create policy "Users can update own submissions"
  on submissions for update using (auth.uid() = user_id);

-- ============================================================
-- VOTES
-- ============================================================
create table votes (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  voter_id uuid not null references users(id) on delete cascade,
  contest_id uuid not null references contests(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (voter_id, contest_id)
);

alter table votes enable row level security;

create policy "Votes are viewable by everyone"
  on votes for select using (true);

create policy "Authenticated users can vote"
  on votes for insert with check (auth.uid() = voter_id);

create policy "Users can remove own vote"
  on votes for delete using (auth.uid() = voter_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type notification_type not null,
  title text not null,
  body text,
  data jsonb default '{}',
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table notifications enable row level security;

create policy "Users can view own notifications"
  on notifications for select using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on notifications for update using (auth.uid() = user_id);

-- ============================================================
-- REPORTS
-- ============================================================
create table reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references users(id) on delete cascade,
  submission_id uuid not null references submissions(id) on delete cascade,
  reason report_reason not null,
  details text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table reports enable row level security;

create policy "Users can create reports"
  on reports for insert with check (auth.uid() = reporter_id);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_users_username_trgm on users using gin (username gin_trgm_ops);
create index idx_users_display_name_trgm on users using gin (display_name gin_trgm_ops);

create index idx_follows_following on follows (following_id);
create index idx_follows_follower on follows (follower_id);

create index idx_contests_status on contests (status);
create index idx_contests_active on contests (starts_at, ends_at) where status = 'active';

create index idx_submissions_contest on submissions (contest_id, vote_count desc);
create index idx_submissions_user on submissions (user_id, created_at desc);
create index idx_submissions_status on submissions (status);

create index idx_votes_submission on votes (submission_id);
create index idx_votes_voter on votes (voter_id, created_at desc);

create index idx_notifications_user_unread on notifications (user_id, created_at desc) where is_read = false;

create index idx_songs_title_trgm on songs using gin (title gin_trgm_ops);
create index idx_songs_artist_trgm on songs using gin (artist gin_trgm_ops);

create index idx_profile_qas_user on profile_qas (user_id, sort_order);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger users_updated_at
  before update on users for each row execute function update_updated_at();

create trigger profile_qas_updated_at
  before update on profile_qas for each row execute function update_updated_at();

create trigger contests_updated_at
  before update on contests for each row execute function update_updated_at();

create trigger submissions_updated_at
  before update on submissions for each row execute function update_updated_at();

-- ============================================================
-- TRIGGER: sync vote_count on submissions
-- ============================================================
create or replace function update_vote_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update submissions set vote_count = vote_count + 1 where id = new.submission_id;
    return new;
  elsif TG_OP = 'DELETE' then
    update submissions set vote_count = vote_count - 1 where id = old.submission_id;
    return old;
  end if;
end;
$$ language plpgsql security definer;

create trigger votes_update_count
  after insert or delete on votes
  for each row execute function update_vote_count();

-- ============================================================
-- VIEW: profile stats (follower/following/submission counts)
-- ============================================================
create or replace view user_stats as
select
  u.id,
  coalesce(fr.cnt, 0) as follower_count,
  coalesce(fg.cnt, 0) as following_count,
  coalesce(s.cnt, 0) as submission_count
from users u
left join lateral (select count(*) as cnt from follows where following_id = u.id) fr on true
left join lateral (select count(*) as cnt from follows where follower_id = u.id) fg on true
left join lateral (select count(*) as cnt from submissions where user_id = u.id and status = 'published') s on true;

-- ============================================================
-- FUNCTION: get active contest with countdown
-- ============================================================
create or replace function get_active_contest()
returns table (
  id uuid,
  title text,
  status contest_status,
  starts_at timestamptz,
  ends_at timestamptz,
  voting_ends_at timestamptz,
  prize_cash_amount int,
  prize_record_deal boolean,
  days_remaining int,
  hours_remaining int,
  minutes_remaining int,
  seconds_remaining int
) as $$
  select
    c.id, c.title, c.status, c.starts_at, c.ends_at,
    c.voting_ends_at, c.prize_cash_amount, c.prize_record_deal,
    extract(day from c.ends_at - now())::int,
    extract(hour from c.ends_at - now())::int % 24,
    extract(minute from c.ends_at - now())::int % 60,
    extract(second from c.ends_at - now())::int % 60
  from contests c
  where c.status in ('active', 'voting')
  order by c.starts_at desc
  limit 1;
$$ language sql stable;

-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('submissions', 'submissions', true, 524288000, array['video/mp4', 'video/quicktime', 'video/webm']),
  ('thumbnails', 'thumbnails', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('backing-tracks', 'backing-tracks', false, 52428800, array['audio/mpeg', 'audio/mp4', 'audio/wav'])
on conflict (id) do nothing;

-- Storage policies: avatars
create policy "Avatars are publicly accessible"
  on storage.objects for select using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies: submissions
create policy "Submission videos are publicly accessible"
  on storage.objects for select using (bucket_id = 'submissions');

create policy "Users can upload own submission videos"
  on storage.objects for insert
  with check (bucket_id = 'submissions' and (storage.foldername(name))[1] = auth.uid()::text);

-- Storage policies: thumbnails
create policy "Thumbnails are publicly accessible"
  on storage.objects for select using (bucket_id = 'thumbnails');

create policy "Users can upload own thumbnails"
  on storage.objects for insert
  with check (bucket_id = 'thumbnails' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- REALTIME
-- ============================================================
alter publication supabase_realtime add table votes;
alter publication supabase_realtime add table submissions;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table contests;
