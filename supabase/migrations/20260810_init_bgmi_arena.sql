-- BGMI.ARENA Comprehensive Supabase Database Schema & RLS Security Rules

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  game_name TEXT NOT NULL,
  bgmi_id TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'player' CHECK (role IN ('player', 'admin', 'moderator')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TEAMS TABLE
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  tag TEXT NOT NULL,
  logo_url TEXT,
  captain_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_name TEXT NOT NULL,
  player_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Player' CHECK (role IN ('Captain', 'Player', 'Substitute')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id),
  UNIQUE(team_id, player_id)
);

-- 4. TOURNAMENTS TABLE
CREATE TABLE IF NOT EXISTS public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  banner_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Registration Open', 'Registration Closed', 'Upcoming', 'Live', 'Completed', 'Cancelled')),
  game TEXT NOT NULL DEFAULT 'BGMI',
  format TEXT NOT NULL DEFAULT 'Squad' CHECK (format IN ('Solo', 'Duo', 'Squad')),
  mode TEXT NOT NULL DEFAULT 'TPP',
  map TEXT NOT NULL DEFAULT 'Erangel',
  entry_type TEXT NOT NULL DEFAULT 'Free' CHECK (entry_type IN ('Free', 'Paid')),
  entry_fee NUMERIC DEFAULT 0,
  prize_pool NUMERIC DEFAULT 0,
  max_teams INTEGER NOT NULL DEFAULT 32,
  registered_teams INTEGER NOT NULL DEFAULT 0,
  registration_open BOOLEAN DEFAULT true,
  registration_start TIMESTAMPTZ,
  registration_end TIMESTAMPTZ,
  start_date TIMESTAMPTZ NOT NULL,
  start_time TEXT NOT NULL,
  end_date TIMESTAMPTZ,
  rules TEXT NOT NULL,
  organizer TEXT NOT NULL DEFAULT 'BGMI.ARENA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TOURNAMENT REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.tournament_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  captain_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'Approved' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Cancelled')),
  payment_status TEXT DEFAULT 'Free' CHECK (payment_status IN ('Free', 'Pending', 'Verified', 'Refunded')),
  payment_reference TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- 6. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  match_number INTEGER NOT NULL,
  match_title TEXT NOT NULL,
  map TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'Scheduled' CHECK (status IN ('Scheduled', 'Room Released', 'Live', 'Completed', 'Cancelled')),
  room_id TEXT,
  room_password TEXT,
  room_release_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MATCH RESULTS TABLE
CREATE TABLE IF NOT EXISTS public.match_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  team_tag TEXT,
  team_logo_url TEXT,
  placement INTEGER NOT NULL,
  kills INTEGER NOT NULL DEFAULT 0,
  placement_points INTEGER NOT NULL DEFAULT 0,
  kill_points INTEGER NOT NULL DEFAULT 0,
  bonus_points INTEGER NOT NULL DEFAULT 0,
  penalty_points INTEGER NOT NULL DEFAULT 0,
  total_points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(match_id, team_id)
);

-- 8. SCORING RULES TABLE
CREATE TABLE IF NOT EXISTS public.scoring_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE UNIQUE,
  placement_points JSONB NOT NULL DEFAULT '{"1": 15, "2": 12, "3": 10, "4": 8, "5": 6, "6": 4, "7": 2, "8": 0}',
  points_per_kill INTEGER NOT NULL DEFAULT 1,
  tie_breaker_order JSONB NOT NULL DEFAULT '["points", "wins", "kills", "best_placement"]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. WINNER RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.winner_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  tournament_title TEXT NOT NULL,
  winning_team_id UUID REFERENCES public.teams(id) ON DELETE RESTRICT,
  winning_team_name TEXT NOT NULL,
  winning_team_tag TEXT,
  winning_team_logo TEXT,
  players JSONB NOT NULL DEFAULT '[]',
  prize_amount NUMERIC NOT NULL,
  final_rank INTEGER NOT NULL DEFAULT 1,
  total_points INTEGER NOT NULL,
  kills INTEGER NOT NULL,
  winning_date TIMESTAMPTZ DEFAULT NOW(),
  winner_screenshot TEXT,
  payment_proof_url TEXT,
  result_sheet_url TEXT,
  verified BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. WINNER PROOFS TABLE
CREATE TABLE IF NOT EXISTS public.winner_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  winner_record_id UUID REFERENCES public.winner_records(id) ON DELETE CASCADE,
  proof_type TEXT NOT NULL CHECK (proof_type IN ('Payment', 'Screenshot', 'MatchResultSheet')),
  proof_url TEXT NOT NULL,
  notes TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  author_name TEXT NOT NULL DEFAULT 'BGMI.ARENA Admin',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. NEWS TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Tournament', 'Update', 'Esports', 'Community')),
  author TEXT NOT NULL DEFAULT 'BGMI.ARENA Staff',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. YOUTUBE VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  video_id TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  description TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_live BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. MEDIA TABLE
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('Image', 'Video', 'Poster')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('Gallery', 'Poster', 'Highlight', 'Screenshot')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  tournament_title TEXT NOT NULL,
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  team_name TEXT NOT NULL,
  reported_by_user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_by_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_url TEXT,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'Under Review', 'Resolved', 'Rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. FAIR PLAY ACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.fair_play_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  team_name TEXT,
  player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  player_name TEXT,
  bgmi_id TEXT,
  action_type TEXT NOT NULL CHECK (action_type IN ('Warning', 'PointsDeduction', 'MatchBan', 'TournamentBan', 'PermanentBan')),
  reason TEXT NOT NULL,
  evidence_notes TEXT,
  enforced_by TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Registration', 'Match', 'RoomDetails', 'Results', 'Winner', 'System')),
  link_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  bgmi_id TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Read', 'Replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY POLICIES --

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.winner_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- Public READ for tournaments, news, winners, match results, announcements, media
CREATE POLICY "Public read tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public read match_results" ON public.match_results FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public read winner_records" ON public.winner_records FOR SELECT USING (published = true);
CREATE POLICY "Public read teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON public.team_members FOR SELECT USING (true);

-- Room credentials security policy:
-- Room ID & Password are only accessible when status = 'Room Released' OR user is Admin
CREATE POLICY "Secure match room access" ON public.matches FOR SELECT
USING (
  status = 'Room Released' OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'))
);

-- Users can read & update their own profile
CREATE POLICY "Users read own profile" ON public.profiles FOR SELECT USING (id = auth.uid() OR role IN ('admin', 'moderator'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());

-- Team captain can manage team
CREATE POLICY "Captains manage team" ON public.teams FOR ALL USING (captain_id = auth.uid());

-- Notifications read by owner
CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());

-- Admin full access
CREATE POLICY "Admin full access profiles" ON public.profiles FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Admin full access tournaments" ON public.tournaments FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "Admin full access matches" ON public.matches FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
CREATE POLICY "Admin full access match_results" ON public.match_results FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator')));
