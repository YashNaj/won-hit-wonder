-- Won Hit Wonder - Seed Data (public schema only)
-- Auth users created via Admin API; this seeds profiles + content

-- ============================================================
-- USER IDS (from Auth Admin API)
-- ============================================================
-- Charlie Day:     7189634d-4d7c-4c1a-8e69-8284054c8832
-- Sarah Mitchell:  c87ef224-1b7b-4cab-9655-cb67190f8018
-- Marcus Rivera:   9f7cb5f9-d9e7-4492-a7b7-5af2484717f9
-- Emma Chen:       4f33e563-4c07-495e-a53a-35e95597d5b1
-- Jake Thompson:   f5e853a4-8804-4647-9e7c-b14e3afb8995
-- Mia Johnson:     3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b

-- ============================================================
-- UPDATE PROFILES
-- ============================================================
UPDATE public.users SET
  display_name = 'Charlie Day', username = 'charlieday',
  avatar_url = 'https://i.pravatar.cc/300?u=charlie',
  bio = 'Singer-songwriter from Nashville. Country soul with a modern twist.',
  location = 'Franklin, TN', is_verified = true, is_onboarded = true
WHERE id = '7189634d-4d7c-4c1a-8e69-8284054c8832';

UPDATE public.users SET
  display_name = 'Sarah Mitchell', username = 'sarahmitchell',
  avatar_url = 'https://i.pravatar.cc/300?u=sarah',
  bio = 'Pop vocalist chasing dreams one note at a time.',
  location = 'Los Angeles, CA', is_onboarded = true
WHERE id = 'c87ef224-1b7b-4cab-9655-cb67190f8018';

UPDATE public.users SET
  display_name = 'Marcus Rivera', username = 'marcusrivera',
  avatar_url = 'https://i.pravatar.cc/300?u=marcus',
  bio = 'R&B artist blending old school vibes with new school beats.',
  location = 'Atlanta, GA', is_verified = true, is_onboarded = true
WHERE id = '9f7cb5f9-d9e7-4492-a7b7-5af2484717f9';

UPDATE public.users SET
  display_name = 'Emma Chen', username = 'emmachen',
  avatar_url = 'https://i.pravatar.cc/300?u=emma',
  bio = 'Indie folk singer with a love for storytelling.',
  location = 'Portland, OR', is_onboarded = true
WHERE id = '4f33e563-4c07-495e-a53a-35e95597d5b1';

UPDATE public.users SET
  display_name = 'Jake Thompson', username = 'jakethompson',
  avatar_url = 'https://i.pravatar.cc/300?u=jake',
  bio = 'Rock vocalist. If it has a guitar solo, I am in.',
  location = 'Austin, TX', is_onboarded = true
WHERE id = 'f5e853a4-8804-4647-9e7c-b14e3afb8995';

UPDATE public.users SET
  display_name = 'Mia Johnson', username = 'miajohnson',
  avatar_url = 'https://i.pravatar.cc/300?u=mia',
  bio = 'Jazz and soul. Born to perform.',
  location = 'Chicago, IL', is_onboarded = true
WHERE id = '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b';

-- ============================================================
-- CONTEST
-- ============================================================
INSERT INTO contests (id, title, description, status, starts_at, ends_at, voting_ends_at, prize_cash_amount, prize_record_deal)
VALUES (
  'c1000000-0000-0000-0000-000000000001',
  'Won Hit Wonder Season 1',
  'The inaugural season! Show us what you got for a chance to win $10,000 and a single track record deal.',
  'active',
  now() - interval '45 days',
  now() + interval '45 days',
  now() + interval '48 days',
  10000, true
) ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SONGS
-- ============================================================
INSERT INTO songs (id, title, artist, duration_ms, backing_track_url, cover_image_url, is_active) VALUES
  ('a0000001-0000-0000-0000-000000000001', 'Achy Breaky Heart', 'Billy Ray Cyrus', 201000, 'https://example.com/tracks/achy.mp3', 'https://picsum.photos/seed/achy/400/400', true),
  ('a0000001-0000-0000-0000-000000000002', 'Bohemian Rhapsody', 'Queen', 354000, 'https://example.com/tracks/bohemian.mp3', 'https://picsum.photos/seed/bohemian/400/400', true),
  ('a0000001-0000-0000-0000-000000000003', 'Hallelujah', 'Leonard Cohen', 282000, 'https://example.com/tracks/hallelujah.mp3', 'https://picsum.photos/seed/hallelujah/400/400', true),
  ('a0000001-0000-0000-0000-000000000004', 'Rolling in the Deep', 'Adele', 228000, 'https://example.com/tracks/rolling.mp3', 'https://picsum.photos/seed/rolling/400/400', true),
  ('a0000001-0000-0000-0000-000000000005', 'Somebody to Love', 'Queen', 296000, 'https://example.com/tracks/somebody.mp3', 'https://picsum.photos/seed/somebody/400/400', true),
  ('a0000001-0000-0000-0000-000000000006', 'Take Me Home, Country Roads', 'John Denver', 197000, 'https://example.com/tracks/country.mp3', 'https://picsum.photos/seed/country/400/400', true),
  ('a0000001-0000-0000-0000-000000000007', 'I Will Always Love You', 'Whitney Houston', 273000, 'https://example.com/tracks/always.mp3', 'https://picsum.photos/seed/always/400/400', true),
  ('a0000001-0000-0000-0000-000000000008', 'Sweet Caroline', 'Neil Diamond', 202000, 'https://example.com/tracks/caroline.mp3', 'https://picsum.photos/seed/caroline/400/400', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- SUBMISSIONS
-- ============================================================
INSERT INTO submissions (id, contest_id, user_id, song_id, video_url, thumbnail_url, duration_ms, status, vote_count) VALUES
  ('b0000001-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', '7189634d-4d7c-4c1a-8e69-8284054c8832', 'a0000001-0000-0000-0000-000000000001', 'https://example.com/v/charlie1.mp4', 'https://picsum.photos/seed/charlie1/400/700', 180000, 'published', 247),
  ('b0000001-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'c87ef224-1b7b-4cab-9655-cb67190f8018', 'a0000001-0000-0000-0000-000000000004', 'https://example.com/v/sarah1.mp4', 'https://picsum.photos/seed/sarah1/400/700', 195000, 'published', 189),
  ('b0000001-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', '9f7cb5f9-d9e7-4492-a7b7-5af2484717f9', 'a0000001-0000-0000-0000-000000000002', 'https://example.com/v/marcus1.mp4', 'https://picsum.photos/seed/marcus1/400/700', 210000, 'published', 312),
  ('b0000001-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', '4f33e563-4c07-495e-a53a-35e95597d5b1', 'a0000001-0000-0000-0000-000000000003', 'https://example.com/v/emma1.mp4', 'https://picsum.photos/seed/emma1/400/700', 175000, 'published', 156),
  ('b0000001-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'f5e853a4-8804-4647-9e7c-b14e3afb8995', 'a0000001-0000-0000-0000-000000000005', 'https://example.com/v/jake1.mp4', 'https://picsum.photos/seed/jake1/400/700', 200000, 'published', 98),
  ('b0000001-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b', 'a0000001-0000-0000-0000-000000000007', 'https://example.com/v/mia1.mp4', 'https://picsum.photos/seed/mia1/400/700', 185000, 'published', 203)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PROFILE Q&As
-- ============================================================
INSERT INTO profile_qas (user_id, question, answer, emoji, accent_color, sort_order) VALUES
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'Who are your biggest musical influences?', 'Johnny Cash, Chris Stapleton, and a little bit of Fleetwood Mac. I love music that tells a story.', '🎵', '#1867ff', 0),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'What was the first song that broke your heart?', 'Hurt by Johnny Cash. The way he delivers those lyrics still gives me chills every single time.', '💔', '#d50066', 1),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'What do you hope to achieve through this competition?', 'I want to share my music with the world and prove that dreams are worth chasing, no matter where you come from.', '🌟', '#d59900', 2),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'If you could collaborate with any artist, who would it be?', 'Freddie Mercury. His incredible vocal range and magnetic stage presence would elevate any performance.', '🎤', '#d50080', 3),
  ('9f7cb5f9-d9e7-4492-a7b7-5af2484717f9', 'Who are your biggest musical influences?', 'Frank Ocean, D''Angelo, and Stevie Wonder. Soul music runs in my veins.', '🎵', '#1867ff', 0),
  ('9f7cb5f9-d9e7-4492-a7b7-5af2484717f9', 'What was the first song that broke your heart?', 'Thinkin Bout You by Frank Ocean. That falsetto hit different when you are 16.', '💔', '#d50066', 1),
  ('3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b', 'Who are your biggest musical influences?', 'Ella Fitzgerald, Amy Winehouse, and Erykah Badu. Strong women with incredible voices.', '🎵', '#1867ff', 0),
  ('3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b', 'What do you hope to achieve through this competition?', 'To finally be heard. Chicago has so much talent and I want to put us on the map.', '🌟', '#d59900', 1);

-- ============================================================
-- FOLLOWS
-- ============================================================
INSERT INTO follows (follower_id, following_id) VALUES
  ('c87ef224-1b7b-4cab-9655-cb67190f8018', '7189634d-4d7c-4c1a-8e69-8284054c8832'),
  ('9f7cb5f9-d9e7-4492-a7b7-5af2484717f9', '7189634d-4d7c-4c1a-8e69-8284054c8832'),
  ('4f33e563-4c07-495e-a53a-35e95597d5b1', '7189634d-4d7c-4c1a-8e69-8284054c8832'),
  ('f5e853a4-8804-4647-9e7c-b14e3afb8995', '7189634d-4d7c-4c1a-8e69-8284054c8832'),
  ('3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b', '7189634d-4d7c-4c1a-8e69-8284054c8832'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', '9f7cb5f9-d9e7-4492-a7b7-5af2484717f9'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b'),
  ('c87ef224-1b7b-4cab-9655-cb67190f8018', '9f7cb5f9-d9e7-4492-a7b7-5af2484717f9'),
  ('9f7cb5f9-d9e7-4492-a7b7-5af2484717f9', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b'),
  ('4f33e563-4c07-495e-a53a-35e95597d5b1', 'c87ef224-1b7b-4cab-9655-cb67190f8018'),
  ('f5e853a4-8804-4647-9e7c-b14e3afb8995', '9f7cb5f9-d9e7-4492-a7b7-5af2484717f9'),
  ('3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b', 'c87ef224-1b7b-4cab-9655-cb67190f8018'),
  ('4f33e563-4c07-495e-a53a-35e95597d5b1', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b'),
  ('f5e853a4-8804-4647-9e7c-b14e3afb8995', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b'),
  ('c87ef224-1b7b-4cab-9655-cb67190f8018', '3b44baf1-73b8-41a8-a9b9-7ed1f9d3089b')
ON CONFLICT DO NOTHING;

-- ============================================================
-- NOTIFICATIONS (for demo user Charlie)
-- ============================================================
INSERT INTO notifications (user_id, type, title, body) VALUES
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'vote_received', 'New vote!', 'Sarah Mitchell voted for your performance of Achy Breaky Heart'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'new_follower', 'New follower', 'Mia Johnson started following you'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'contest_started', 'Contest is live!', 'Won Hit Wonder Season 1 has officially started. Submit your entry now!'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'vote_received', 'New vote!', 'Marcus Rivera voted for your performance'),
  ('7189634d-4d7c-4c1a-8e69-8284054c8832', 'contest_ending_soon', 'Contest ending soon', 'Only 45 days left to submit your entry for Season 1!');
