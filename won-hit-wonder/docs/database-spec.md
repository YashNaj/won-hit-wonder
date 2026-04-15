# Won Hit Wonder - Database Spec

**Backend:** Supabase (PostgreSQL)
**Project Ref:** `cyrnqoojtippcvdhgkou`
**Region:** West US (Oregon)

---

## Architecture

```
auth.users (Supabase-managed)
    │
    ├── trigger: on_auth_user_created ──► public.users (auto-insert)
    └── trigger: on_auth_user_updated ──► public.users (sync email)

public.users ─────┬── profile_qas
                   ├── follows (follower_id, following_id)
                   ├── submissions ──── votes
                   ├── notifications
                   └── reports

public.contests ──── submissions ──── votes
public.songs ──────── submissions
```

---

## Tables

### users

Clone of `auth.users`. Auto-created on signup, never queried from `auth` schema directly.

| Column              | Type        | Constraints                           |
| ------------------- | ----------- | ------------------------------------- |
| id                  | uuid        | PK, FK → auth.users ON DELETE CASCADE |
| email               | text        | NOT NULL, synced from auth            |
| username            | text        | UNIQUE, nullable until onboarding     |
| display_name        | text        | nullable until onboarding             |
| avatar_url          | text        |                                       |
| bio                 | text        |                                       |
| location            | text        | e.g. "Franklin, TN"                   |
| is_verified         | boolean     | default false                         |
| is_onboarded        | boolean     | default false                         |
| notification_daily  | boolean     | default true                          |
| notification_in_app | boolean     | default true                          |
| created_at          | timestamptz | default now()                         |
| updated_at          | timestamptz | auto-updated via trigger              |

**RLS:** Public read. Users can update/insert own row.

**Indexes:** trigram on `username`, `display_name` (fuzzy search).

---

### profile_qas

Expandable Q&A cards displayed on user profiles.

| Column       | Type        | Constraints           |
| ------------ | ----------- | --------------------- |
| id           | uuid        | PK, gen_random_uuid() |
| user_id      | uuid        | FK → users, NOT NULL  |
| question     | text        | NOT NULL              |
| answer       | text        |                       |
| emoji        | text        | default '🎵'          |
| accent_color | text        | default '#1867ff'     |
| sort_order   | int         | default 0             |
| created_at   | timestamptz |                       |
| updated_at   | timestamptz | auto-updated          |

**RLS:** Public read. Owner CRUD.

---

### follows

| Column       | Type        | Constraints          |
| ------------ | ----------- | -------------------- |
| follower_id  | uuid        | FK → users, NOT NULL |
| following_id | uuid        | FK → users, NOT NULL |
| created_at   | timestamptz |                      |

**PK:** (follower_id, following_id). **Check:** follower_id != following_id.

**RLS:** Public read. Users can insert/delete own follows.

---

### contests

90-day recurring contest cycles.

| Column            | Type           | Constraints           |
| ----------------- | -------------- | --------------------- |
| id                | uuid           | PK                    |
| title             | text           | NOT NULL              |
| description       | text           |                       |
| status            | contest_status | default 'upcoming'    |
| starts_at         | timestamptz    | NOT NULL              |
| ends_at           | timestamptz    | NOT NULL, > starts_at |
| voting_ends_at    | timestamptz    | NOT NULL, >= ends_at  |
| prize_cash_amount | int            | default 10000         |
| prize_record_deal | boolean        | default true          |
| winner_id         | uuid           | FK → users, nullable  |
| created_at        | timestamptz    |                       |
| updated_at        | timestamptz    | auto-updated          |

**Enum `contest_status`:** `upcoming`, `active`, `voting`, `completed`, `cancelled`

**RLS:** Public read. Admin-only write (via service role).

---

### songs

Karaoke song library.

| Column            | Type        | Constraints           |
| ----------------- | ----------- | --------------------- |
| id                | uuid        | PK                    |
| title             | text        | NOT NULL              |
| artist            | text        | NOT NULL              |
| duration_ms       | int         | NOT NULL              |
| backing_track_url | text        | NOT NULL              |
| cover_image_url   | text        |                       |
| lyrics_json       | jsonb       | `[{ time_ms, line }]` |
| is_active         | boolean     | default true          |
| created_at        | timestamptz |                       |

**RLS:** Public read (active only). Admin-only write.

**Indexes:** trigram on `title`, `artist`.

---

### submissions

One entry per user per contest.

| Column        | Type              | Constraints                        |
| ------------- | ----------------- | ---------------------------------- |
| id            | uuid              | PK                                 |
| contest_id    | uuid              | FK → contests, NOT NULL            |
| user_id       | uuid              | FK → users, NOT NULL               |
| song_id       | uuid              | FK → songs, NOT NULL               |
| video_url     | text              | NOT NULL                           |
| thumbnail_url | text              |                                    |
| duration_ms   | int               |                                    |
| status        | submission_status | default 'processing'               |
| vote_count    | int               | default 0, auto-synced via trigger |
| created_at    | timestamptz       |                                    |
| updated_at    | timestamptz       | auto-updated                       |

**Unique:** (contest_id, user_id) — enforces one submission per user per contest.

**Enum `submission_status`:** `processing`, `published`, `rejected`, `flagged`

**RLS:** Published submissions public. Owner can see all own submissions. Owner can insert/update.

**Indexes:** (contest_id, vote_count DESC) for leaderboard, (user_id, created_at DESC) for profile grid.

---

### votes

One vote per user per contest.

| Column        | Type        | Constraints                |
| ------------- | ----------- | -------------------------- |
| id            | uuid        | PK                         |
| submission_id | uuid        | FK → submissions, NOT NULL |
| voter_id      | uuid        | FK → users, NOT NULL       |
| contest_id    | uuid        | FK → contests, NOT NULL    |
| created_at    | timestamptz |                            |

**Unique:** (voter_id, contest_id) — one vote per contest.

**Trigger:** INSERT increments `submissions.vote_count`, DELETE decrements.

**RLS:** Public read. Authenticated insert (own voter_id). Owner delete.

---

### notifications

| Column     | Type              | Constraints          |
| ---------- | ----------------- | -------------------- |
| id         | uuid              | PK                   |
| user_id    | uuid              | FK → users, NOT NULL |
| type       | notification_type | NOT NULL             |
| title      | text              | NOT NULL             |
| body       | text              |                      |
| data       | jsonb             | default '{}'         |
| is_read    | boolean           | default false        |
| created_at | timestamptz       |                      |

**Enum `notification_type`:** `vote_received`, `new_follower`, `contest_started`, `contest_ending_soon`, `contest_ended`, `submission_approved`, `submission_rejected`, `winner_announced`, `system`

**RLS:** Owner read/update only.

**Index:** (user_id, created_at DESC) WHERE is_read = false.

---

### reports

| Column        | Type          | Constraints                |
| ------------- | ------------- | -------------------------- |
| id            | uuid          | PK                         |
| reporter_id   | uuid          | FK → users, NOT NULL       |
| submission_id | uuid          | FK → submissions, NOT NULL |
| reason        | report_reason | NOT NULL                   |
| details       | text          |                            |
| resolved      | boolean       | default false              |
| created_at    | timestamptz   |                            |

**Enum `report_reason`:** `inappropriate`, `copyright`, `spam`, `other`

**RLS:** Authenticated insert only (own reporter_id). Admin read via service role.

---

## Views

### user_stats

Computed follower, following, and submission counts per user.

```sql
select id, follower_count, following_count, submission_count from user_stats;
```

---

## Functions

### get_active_contest()

Returns the current active/voting contest with countdown breakdown.

```sql
select * from get_active_contest();
-- Returns: id, title, status, starts_at, ends_at, voting_ends_at,
--          prize_cash_amount, prize_record_deal,
--          days_remaining, hours_remaining, minutes_remaining, seconds_remaining
```

---

## Triggers

| Trigger                | Table       | Event               | Action                      |
| ---------------------- | ----------- | ------------------- | --------------------------- |
| on_auth_user_created   | auth.users  | AFTER INSERT        | Creates public.users row    |
| on_auth_user_updated   | auth.users  | AFTER UPDATE(email) | Syncs email to public.users |
| users_updated_at       | users       | BEFORE UPDATE       | Sets updated_at = now()     |
| profile_qas_updated_at | profile_qas | BEFORE UPDATE       | Sets updated_at = now()     |
| contests_updated_at    | contests    | BEFORE UPDATE       | Sets updated_at = now()     |
| submissions_updated_at | submissions | BEFORE UPDATE       | Sets updated_at = now()     |
| votes_update_count     | votes       | AFTER INSERT/DELETE | +/- submissions.vote_count  |

---

## Storage Buckets

| Bucket           | Public | Max Size | Allowed Types                          |
| ---------------- | ------ | -------- | -------------------------------------- |
| `avatars`        | yes    | 5 MB     | image/jpeg, image/png, image/webp      |
| `submissions`    | yes    | 500 MB   | video/mp4, video/quicktime, video/webm |
| `thumbnails`     | yes    | 5 MB     | image/jpeg, image/png, image/webp      |
| `backing-tracks` | no     | 50 MB    | audio/mpeg, audio/mp4, audio/wav       |

**Path convention:** `{bucket}/{user_id}/{filename}` — RLS enforces users can only upload to their own folder.

---

## Realtime

Enabled on: `votes`, `submissions`, `notifications`, `contests`

Use cases:

- Live vote count updates on the stream screen
- Submission status changes (processing → published)
- Push notification delivery
- Contest status transitions (active → voting → completed)
