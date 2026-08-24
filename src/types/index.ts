export type UserRole = 'player' | 'admin' | 'moderator';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  game_name: string;
  bgmi_id: string;
  avatar_url?: string;
  role: UserRole;
  rank?: string;
  rank_updated_at?: string;
  pending_ace_unlock?: boolean;
  wallet_balance?: number;
  status?: 'Active' | 'Suspended' | 'Pending';
  phone?: string;
  team_id?: string;
  team_name?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  stats?: PlayerStats;
}

export interface PlayerStats {
  matches_played: number;
  total_kills: number;
  total_points: number;
  chicken_dinners: number;
  top_3_finishes: number;
  top_10_finishes: number;
  avg_placement: number;
  best_placement: number;
}

export type TournamentStatus =
  | 'Draft'
  | 'Registration Open'
  | 'Registration Closed'
  | 'Upcoming'
  | 'Live'
  | 'Completed'
  | 'Cancelled';

export type TournamentFormat = 'Solo' | 'Duo' | 'Squad';

export interface Tournament {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner_url: string;
  status: TournamentStatus;
  game: string;
  format: TournamentFormat;
  mode: string; // TPP / FPP
  map: string; // Erangel, Miramar, Sanhok, Vikendi, Custom
  entry_type: 'Free' | 'Paid';
  entry_fee: number;
  prize_pool: number;
  max_teams: number;
  registered_teams: number;
  registration_open: boolean;
  registration_start: string;
  registration_end: string;
  start_date: string;
  start_time: string;
  end_date: string;
  rules: string;
  organizer: string;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  game_name: string;
  player_id: string;
  role: 'Captain' | 'Player' | 'Substitute';
  joined_at: string;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  logo_url: string;
  captain_id: string;
  created_at: string;
  members?: TeamMember[];
}

export interface TeamInvite {
  id: string;
  team_id: string;
  invite_code: string;
  created_by: string;
  max_uses: number;
  use_count: number;
  status: 'Active' | 'Expired' | 'Revoked';
  expires_at?: string;
  created_at: string;
}

export interface TournamentRegistration {
  id: string;
  tournament_id: string;
  team_id: string;
  captain_id: string;
  slot_number?: number; // Automatic BGMI Room Slot (1 - 25)
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  payment_status?: 'Free' | 'Pending' | 'Verified' | 'Refunded';
  payment_reference?: string;
  created_at: string;
  team?: Team;
}

export interface RoomSlotPass {
  slot_number: number;
  tournament_id: string;
  tournament_title: string;
  team_id: string;
  team_name: string;
  team_tag: string;
  team_logo_url?: string;
  captain_id: string;
  captain_name: string;
  captain_bgmi_id?: string;
  members: { game_name: string; player_id: string; role?: string }[];
  room_id?: string;
  room_password?: string;
  scheduled_at?: string;
  map?: string;
  assigned_at: string;
}

export type MatchStatus = 'Scheduled' | 'Room Released' | 'Live' | 'Completed' | 'Cancelled';

export interface Match {
  id: string;
  tournament_id: string;
  match_number: number;
  match_title: string;
  map: string;
  scheduled_at: string;
  status: MatchStatus;
  room_id?: string;
  room_password?: string;
  room_release_at: string;
  created_at: string;
  updated_at: string;
}

export interface MatchResult {
  id: string;
  match_id: string;
  tournament_id: string;
  team_id: string;
  team_name: string;
  team_tag?: string;
  team_logo_url?: string;
  placement: number;
  kills: number;
  placement_points: number;
  kill_points: number;
  bonus_points: number;
  penalty_points: number;
  total_points: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentLeaderboardEntry {
  rank: number;
  team_id: string;
  team_name: string;
  team_tag: string;
  team_logo_url: string;
  matches_played: number;
  chicken_dinners: number; // Wins
  total_kills: number;
  placement_points: number;
  kill_points: number;
  bonus_points: number;
  penalty_points: number;
  total_points: number;
  rank_change?: number; // positive = up, negative = down, 0 = same
}

export interface ScoringRule {
  id: string;
  tournament_id?: string;
  placement_points: Record<number, number>; // e.g. {1: 15, 2: 12, ...}
  points_per_kill: number;
  tie_breaker_order: ('points' | 'wins' | 'kills' | 'best_placement' | 'avg_placement')[];
}

export interface WinnerRecord {
  id: string;
  tournament_id: string;
  tournament_title: string;
  winning_team_id: string;
  winning_team_name: string;
  winning_team_tag: string;
  winning_team_logo: string;
  players: string[]; // Player names or BGMI IDs
  prize_amount: number;
  final_rank: number;
  total_points: number;
  kills: number;
  winning_date: string;
  winner_screenshot?: string;
  payment_proof_url?: string;
  result_sheet_url?: string;
  verified: boolean;
  published: boolean;
  created_at: string;
}

export interface WinnerProof {
  id: string;
  winner_record_id: string;
  proof_type: 'Payment' | 'Screenshot' | 'MatchResultSheet';
  proof_url: string;
  notes?: string;
  approved_by?: string;
  is_approved: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  tournament_id?: string;
  title: string;
  content: string;
  image_url?: string;
  author_name: string;
  is_pinned: boolean;
  created_at: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  category: 'Tournament' | 'Update' | 'Esports' | 'Community';
  author: string;
  created_at: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  youtube_url: string;
  video_id: string;
  thumbnail_url: string;
  description: string;
  is_featured: boolean;
  is_live: boolean;
  published_at: string;
}

export interface MediaItem {
  id: string;
  title: string;
  media_type: 'Image' | 'Video' | 'Poster';
  url: string;
  thumbnail_url?: string;
  tournament_id?: string;
  category: 'Gallery' | 'Poster' | 'Highlight' | 'Screenshot';
  created_at: string;
}

export interface Dispute {
  id: string;
  tournament_id: string;
  tournament_title: string;
  match_id?: string;
  team_id: string;
  team_name: string;
  reported_by_user_id: string;
  reported_by_name: string;
  reason: string;
  description: string;
  evidence_url?: string;
  status: 'Open' | 'Under Review' | 'Resolved' | 'Rejected';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FairPlayAction {
  id: string;
  team_id?: string;
  team_name?: string;
  player_id?: string;
  player_name?: string;
  bgmi_id?: string;
  action_type: 'Warning' | 'PointsDeduction' | 'MatchBan' | 'TournamentBan' | 'PermanentBan';
  reason: string;
  evidence_notes?: string;
  enforced_by: string;
  created_at: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'Registration' | 'Match' | 'RoomDetails' | 'Results' | 'Winner' | 'System';
  link_url?: string;
  room_id?: string;
  room_password?: string;
  read: boolean;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  action: string;
  target_type: string;
  target_id?: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  bgmi_id?: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Replied';
  created_at: string;
}

export type WhatsAppCategory = 'General' | 'Scrims' | 'RoomID' | 'Captains' | 'Support';

export interface WhatsAppGroup {
  id: string;
  name: string;
  invite_url: string;
  category: WhatsAppCategory;
  description: string;
  member_count: number;
  max_members?: number;
  is_official: boolean;
  tournament_id?: string;
  tournament_title?: string;
  qr_code_url?: string;
  updated_at: string;
}
