# Won Hit Wonder - Project Spec

## Overview

Won Hit Wonder is a mobile singing contest app where anyone can compete for a grand prize every 90 days. Contestants record and submit karaoke-style video performances, viewers vote on their favorites, and winners receive cash prizes and record deals.

**Figma Source:** [HiFi Designs](https://www.figma.com/design/aLK5dJt9LUPhItvAQMiYcj/Won-Hit-Wonder-App_HiFi-Designs?node-id=0-1)

---

## App Concept

- 90-day recurring contest cycles
- Users record karaoke performances over backing tracks
- Community votes determine the winner
- Grand prizes: **$10,000 cash** + **Single Track Record Deal**
- One submission per user per contest

---

## Design System

### Color Palette

| Token           | Hex       | Usage                            |
| --------------- | --------- | -------------------------------- |
| `background`    | `#010101` | Primary background               |
| `backgroundAlt` | `#0b0a17` | Profile/alt background           |
| `purple`        | `#742fe5` | Accent, decorative circles       |
| `purpleAlt`     | `#7240ff` | Accent variant                   |
| `magenta`       | `#cd04cf` | Accent, decorative circles       |
| `hotPink`       | `#ff1879` | Notification badge, stop button  |
| `red`           | `#fb0d41` | Alerts, live indicator           |
| `deepPink`      | `#d50066` | Q&A card accent                  |
| `deepPinkAlt`   | `#d50080` | Q&A card accent variant          |
| `blue`          | `#125efe` | Pause button, primary CTA        |
| `blueAlt`       | `#1867ff` | Link/accent blue                 |
| `gold`          | `#fea713` | Winner highlight                 |
| `goldAlt`       | `#d59900` | Q&A card accent                  |
| `white`         | `#ffffff` | Text, icons, controls            |
| `gray`          | `#d9d9d9` | Placeholders, subtle backgrounds |

### Typography

| Font         | Weight  | Sizes   | Usage                        |
| ------------ | ------- | ------- | ---------------------------- |
| Avenir Next  | 700-800 | 20-44px | Headlines, prize amounts     |
| Avenir Next  | 600     | 12-24px | Subheadlines, buttons, names |
| Avenir Next  | 500     | 10px    | Countdown labels (DD/HH/MM)  |
| Avenir       | 800     | 24px    | Welcome/section headers      |
| TT Norms Pro | 700     | 20px    | User name, follower counts   |
| TT Norms Pro | 400     | 10-14px | Body text, labels, song info |
| TT Norms Pro | 500     | 10px    | Control labels (Stop/Pause)  |
| Montserrat   | 500     | 24px    | Karaoke lyrics               |
| Montserrat   | 800     | 32-38px | Emoji decorations on Q&A     |

### Visual Patterns

- **Dark theme** throughout (black backgrounds, white text)
- **Decorative circles**: overlapping purple (`#742fe5`) + magenta (`#cd04cf`) ellipses behind content
- **Glassmorphic overlays**: semi-transparent gradient rectangles over images
- **Rounded avatars**: circular profile images (42-143pt diameter)
- **Card style**: dark cards with subtle gradient top borders
- **Notification badge**: small pink (`#ff1879`) circle on hamburger menu icon

### Layout

- Target device: iPhone (375x812pt)
- Status bar: iOS-style with time, cellular, wifi, battery
- Home indicator bar at bottom (126x4pt, white, centered)
- Content inset: ~25pt horizontal padding

---

## Screens & User Flows

### 1. Onboarding Flow

#### 1a. Welcome Screen

- Background concert image with dark gradient overlay
- Purple + magenta decorative circles
- App name: "Won Hit Wonder"
- Headline: "Welcome"
- Body: "Welcome to Won Hit Wonder, a singing contest that gives anyone the opportunity to win our grand prize every 90 days!"
- "Enter our contest for a chance to win our Grand Prize"
- Prize card (dark, rounded) with two sections:
  - **$10K** icon + "Win $10,000 and make your dream a reality!..."
  - **Single Track Record Deal** icon + "Secure a single track record deal..."
- "Continue" button (311x56pt)

#### 1b. Onboarding - Grand Prize Details

- Step-through slides showing prizes:
  - 10K cash prize details
  - Single Record Deal details with professional studio time
- Progress indicator dots
- "Next" button

#### 1c. Onboarding - Gestures Tutorial

- Swipe gesture illustrations (scroll up/down, swipe left/right)
- Instructional text
- Checkbox for acknowledgment

#### 1d. Onboarding - Location Permissions

- Location access prompt
- Background image placeholder

#### 1e. Onboarding - All Access Pass

- Premium subscription offering
- Feature list
- Skip/Continue options

### 2. Authentication

#### 2a. Create Account

- Header with back navigation
- Form fields: First Name, Last Name, Email, Password, Confirm Password
- "Create Account" button
- Multiple states (empty, filled, validation errors)

#### 2b. Login

- Header with back navigation
- Email + Password fields
- "Sign In" button
- Social sign-in options with "or" divider
- "Already have an account? Sign In" / "Create Account" link

#### 2c. Forgot Password

- Email input
- Submit button
- On-screen keyboard

#### 2d. Verify Account

- Code entry (OTP-style)
- Resend code option
- Success overlay confirmation

### 3. Home Feed (HomeV2)

- Full-screen video feed (TikTok-style vertical scroll)
- Each video card shows:
  - Full-bleed background video
  - Overlay at bottom: artist info, progress bar, song details
  - Main controller: large play/pause button (89x89pt)
  - Side action bar: vote, comment, share
- **HomeV2-AlreadyVoted** state: visual indicator that user has already voted
- Filters panel (slide-in): content filters, "Give It Your Best Shot" toggle

### 4. Stream (Live Viewing)

- Full-screen contestant performance
- Top: status bar + hamburger menu (with pink notification badge) + add button
- Contestant avatar (42pt circle) + name ("Charlie Day")
- "CONTEST COUNTDOWN" label
- Countdown timer: `DD : HH : MM : SS` (Avenir Next 700, 14px)
- Song title: "Achy Breaky Heart" (TT Norms Pro 400, 14px)
- Progress bar: white track (311x2pt) with filled portion
- Time: "01:28 / 03:21" (TT Norms Pro 400, 10px)
- Side action column (3 circular buttons):
  - Add/follow (plus icon, white bg)
  - Heart/like (filled circle)
  - Share (outlined circle)
- Small playback indicator circle (28pt)

### 5. Streamer Screen (Recording/Performing)

- Lyrics display (Montserrat 500, 24px, white text on dark bg):
  - Scrolling karaoke-style lyrics with verse markers
- Artist name + song title at top
- Progress bar with time indicator
- Bottom control panel (dark, rounded top):
  - Drag handle (49x4pt white bar)
  - Three circular controls (66pt each):
    - **Stop** (pink `#ff1879` label)
    - **Pause** (blue `#125efe` label)
    - **Record** (white label)

### 6. In-App Video Recording

- Camera viewfinder (full screen)
- Top: status bar + avatar + name
- Video timer overlay
- Progress bar (356x2pt)
- Camera flip button (video_camera_front)
- After recording:
  - Trim interface with timeline scrubber
  - "Submit" / "Re-record" buttons

### 7. Contest Details / Song Selection

- List of available songs with thumbnails (348x141pt cards)
- Song selection state
- Contest rules: "Each contest runs for 90 days. All applicants can submit one entry per contest."

### 8. Share Entry (Submission Confirmation)

- Checkmark success icon (80x80pt)
- "Now's your chance to win the grand prize. Share your video and start getting those votes!"
- Video preview thumbnail
- Share button
- "Please remember, you can only submit one entry per contest."

### 9. Profile

- **Header area**:
  - Background: decorative purple/pink/red circles
  - Profile photo (143x142pt, rounded, with gradient overlay)
  - Verified badge (checkmark icon)
  - Name: "Charlie Day" (Avenir Next 600, 24px)
  - Location: "Franklin, TN" with pin icon + Edit button
  - Stats: Followers (115) | Following (132) — vertical divider

- **Live Session Indicator**:
  - "LIVE SESSION!" label (Avenir Next 700, 12px)
  - Audio waveform visualization bars
  - Song title: "Achy Breaky Heart"
  - Play controls (4 circular buttons with play icons + waveforms)

- **Q&A Section** (expandable cards):
  - Each card: gradient top border, emoji icon (37pt circle), question text
  - Cards:
    - "Who are your biggest musical influences?" (blue `#1867ff`, music note emoji)
    - "What was the first song that broke your heart?" (deep pink `#d50066`, broken heart emoji)
    - "What do you hope to achieve through participating?" (gold `#d59900`, star emoji)
    - "If you could collaborate with any artist?" (deep pink `#d50080`, microphone emoji) — expanded with answer text
  - Expand/collapse chevron

- **Contest Submissions** grid:
  - Section header: "Contest Submissions" (Avenir Next 700, 18px)
  - 2-column thumbnail grid (162x158pt each)
  - Video thumbnails with dark gradient overlay at bottom
  - Song titles: "Dusty Road Dreams", "Back Porch Memories", "Whiskey and Wildflowers", "Honky Tonk Heartache"

### 10. Won (Winner Screen)

- Background concert image with dark gradient
- Purple + magenta decorative circles
- Trophy graphic with vinyl record, mic, music notes
- "Congratulations!" (Avenir Next 700, 14px)
- "You Won" (Avenir Next 700, 36px)
- Prize card (same as welcome but in context)
- "What Comes Next?" section:
  - "Our team will reach out soon to coordinate your prize and discuss next steps."
- "Continue" button

### 11. Notifications

- Header: "Notifications" with back arrow + settings gear icon
- Filter tabs (e.g., All, Mentions, Votes)
- Notification list items
- Sort options
- Alert overlays for permissions (Notifications, Location)

### 12. Settings

- "Notification Settings" header with back arrow
- Toggle: "Daily Notifications"
  - Subtitle: "Receive notifications about contest alerts and artist subscriptions"
- Section: "In-App"

### 13. Subscribers / Following

- Header: "Subscribers" with back arrow
- Search field
- Follower list with avatars
- "You will be notified about artists you follow."
- Tabs for subscriber views

### 14. Vote History

- Header: "Vote Up History" with back arrow
- Sort by dropdown
- Vote record list (329x174pt)

### 15. Legal

- Terms & Conditions screen
- Privacy Policy screen
- Both with back navigation, section headers, body text

---

## Prize Structure

| Prize                        | Details                                                         |
| ---------------------------- | --------------------------------------------------------------- |
| **$10,000 Cash**             | Unrestricted cash prize to support the winner's music career    |
| **Single Track Record Deal** | Professional studio time + production by top industry producers |

---

## Contest Rules

- Each contest runs for **90 days**
- One submission per user per contest
- Community voting determines the winner
- Countdown timer visible on stream screens (DD:HH:MM:SS)

---

## Admin (Desktop)

The Admin section contains desktop wireframes (mid-fidelity) for contest management. Key admin features include:

- Contest lifecycle management (create, start, end)
- Submission review and moderation
- User management
- Prize fulfillment tracking
- Analytics and reporting

---

## Technical Notes

- **Platform**: React Native with Expo (managed workflow)
- **Backend**: Supabase (auth, database, storage, realtime)
- **Video**: Recording + playback + trimming
- **Audio**: Karaoke backing track playback with mic recording
- **Realtime**: Live session streaming, vote counts, countdown sync
- **Push Notifications**: Contest alerts, artist subscriptions, voting reminders
- **Deep Linking**: `wonhitwonder://` scheme (configured in app.json)
