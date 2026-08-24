import {
  Tournament,
  Team,
  TeamMember,
  TournamentRegistration,
  Match,
  MatchResult,
  TournamentLeaderboardEntry,
  ScoringRule,
  WinnerRecord,
  WinnerProof,
  Announcement,
  NewsArticle,
  YouTubeVideo,
  MediaItem,
  Dispute,
  FairPlayAction,
  NotificationItem,
  AuditLog,
  UserProfile,
  ContactMessage,
  TeamInvite,
  WhatsAppGroup,
} from '../types';
import { saveUserToFirestore, syncUsersFromFirestore, deleteUserFromFirestore } from './firebase';

const STORAGE_KEYS = {
  CURRENT_USER: 'bgmi_arena_current_user',
  TOURNAMENTS: 'bgmi_arena_tournaments',
  TEAMS: 'bgmi_arena_teams',
  TEAM_INVITES: 'bgmi_arena_team_invites',
  REGISTRATIONS: 'bgmi_arena_registrations',
  MATCHES: 'bgmi_arena_matches',
  MATCH_RESULTS: 'bgmi_arena_match_results',
  SCORING_RULES: 'bgmi_arena_scoring_rules',
  WINNER_RECORDS: 'bgmi_arena_winner_records',
  WINNER_PROOFS: 'bgmi_arena_winner_proofs',
  ANNOUNCEMENTS: 'bgmi_arena_announcements',
  NEWS: 'bgmi_arena_news',
  YOUTUBE: 'bgmi_arena_youtube',
  MEDIA: 'bgmi_arena_media',
  DISPUTES: 'bgmi_arena_disputes',
  FAIR_PLAY: 'bgmi_arena_fair_play',
  NOTIFICATIONS: 'bgmi_arena_notifications',
  AUDIT_LOGS: 'bgmi_arena_audit_logs',
  CONTACT: 'bgmi_arena_contact',
  USERS: 'bgmi_arena_users',
  WHATSAPP_GROUPS: 'bgmi_arena_whatsapp_groups',
};

// Initial Seed Data (Realistic default state)
const DEFAULT_USER: UserProfile = {
  id: 'usr-admin-1',
  email: 'admin@bgmiarena.com',
  username: 'ArenaAdmin',
  game_name: 'ARENAxBOSS',
  bgmi_id: '5129849102',
  avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
  role: 'admin',
  rank: 'Crown I',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  stats: {
    matches_played: 14,
    total_kills: 48,
    total_points: 112,
    chicken_dinners: 3,
    top_3_finishes: 7,
    top_10_finishes: 12,
    avg_placement: 4.2,
    best_placement: 1,
  },
};

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'tr-1',
    title: 'BGMI Arena Pro Series: Season 1',
    slug: 'bgmi-arena-pro-series-season-1',
    description:
      'The premier squad championship tournament for BGMI teams across India. Compete for bragging rights, cash prizes, and championship trophies.',
    banner_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80',
    status: 'Registration Open',
    game: 'BGMI',
    format: 'Squad',
    mode: 'TPP',
    map: 'Erangel',
    entry_type: 'Free',
    entry_fee: 0,
    prize_pool: 25000,
    max_teams: 32,
    registered_teams: 18,
    registration_open: true,
    registration_start: '2026-08-01T00:00:00Z',
    registration_end: '2026-08-15T23:59:59Z',
    start_date: '2026-08-18T18:00:00Z',
    start_time: '06:00 PM IST',
    end_date: '2026-08-20T21:00:00Z',
    rules:
      '1. Squad size must be 4 players.\n2. Emulators strictly prohibited.\n3. All players must have BGMI Account level 30+.\n4. Room ID & Password released 15 mins prior to match time.\n5. Screenshots of final kill counts required for verification.',
    organizer: 'BGMI.ARENA Official',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-10T12:00:00Z',
  },
  {
    id: 'tr-2',
    title: 'Erangel Conquerors Cup',
    slug: 'erangel-conquerors-cup',
    description: 'Intense tactical Duo showdown on Erangel. Speed, synergy, and lethal marksmanship required.',
    banner_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80',
    status: 'Live',
    game: 'BGMI',
    format: 'Duo',
    mode: 'TPP',
    map: 'Erangel',
    entry_type: 'Free',
    entry_fee: 0,
    prize_pool: 10000,
    max_teams: 25,
    registered_teams: 25,
    registration_open: false,
    registration_start: '2026-07-25T00:00:00Z',
    registration_end: '2026-08-05T23:59:59Z',
    start_date: '2026-08-09T19:00:00Z',
    start_time: '07:00 PM IST',
    end_date: '2026-08-11T21:00:00Z',
    rules: 'Duo matches only. Point system: 1st=15, 2nd=12, 3rd=10... Kill=1pt.',
    organizer: 'BGMI.ARENA Community',
    created_at: '2026-07-25T10:00:00Z',
    updated_at: '2026-08-09T18:00:00Z',
  },
  {
    id: 'tr-3',
    title: 'Sanhok Blitz Solo Championship',
    slug: 'sanhok-blitz-solo-championship',
    description: 'Fast-paced jungle combat where only the fiercest solo survivor claims victory.',
    banner_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80',
    status: 'Completed',
    game: 'BGMI',
    format: 'Solo',
    mode: 'TPP',
    map: 'Sanhok',
    entry_type: 'Free',
    entry_fee: 0,
    prize_pool: 5000,
    max_teams: 50,
    registered_teams: 50,
    registration_open: false,
    registration_start: '2026-07-01T00:00:00Z',
    registration_end: '2026-07-10T23:59:59Z',
    start_date: '2026-07-12T18:00:00Z',
    start_time: '06:00 PM IST',
    end_date: '2026-07-12T21:00:00Z',
    rules: 'Solo survival rules apply.',
    organizer: 'BGMI.ARENA Official',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-13T10:00:00Z',
  },
];

const INITIAL_TEAMS: Team[] = [
  {
    id: 'tm-1',
    name: 'GodLike eSports',
    tag: 'GODL',
    logo_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    captain_id: 'usr-admin-1',
    created_at: '2026-07-01T00:00:00Z',
    members: [
      { id: 'm1', team_id: 'tm-1', user_id: 'usr-admin-1', game_name: 'GODLxJONATHAN', player_id: '5129849102', role: 'Captain', joined_at: '2026-07-01' },
      { id: 'm2', team_id: 'tm-1', user_id: 'usr-2', game_name: 'GODLxNEYO', player_id: '5129849103', role: 'Player', joined_at: '2026-07-01' },
      { id: 'm3', team_id: 'tm-1', user_id: 'usr-3', game_name: 'GODLxSHADOW', player_id: '5129849104', role: 'Player', joined_at: '2026-07-01' },
      { id: 'm4', team_id: 'tm-1', user_id: 'usr-4', game_name: 'GODLxZGOD', player_id: '5129849105', role: 'Player', joined_at: '2026-07-01' },
    ],
  },
  {
    id: 'tm-2',
    name: 'Soul Gaming',
    tag: 'SOUL',
    logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150',
    captain_id: 'usr-soul-cap',
    created_at: '2026-07-01T00:00:00Z',
    members: [
      { id: 'm5', team_id: 'tm-2', user_id: 'usr-soul-cap', game_name: 'SOULxMANYA', player_id: '5188820192', role: 'Captain', joined_at: '2026-07-01' },
      { id: 'm6', team_id: 'tm-2', user_id: 'usr-s2', game_name: 'SOULxNAKUL', player_id: '5188820193', role: 'Player', joined_at: '2026-07-01' },
      { id: 'm7', team_id: 'tm-2', user_id: 'usr-s3', game_name: 'SOULxGOBLIN', player_id: '5188820194', role: 'Player', joined_at: '2026-07-01' },
      { id: 'm8', team_id: 'tm-2', user_id: 'usr-s4', game_name: 'SOULxRONY', player_id: '5188820195', role: 'Player', joined_at: '2026-07-01' },
    ],
  },
  {
    id: 'tm-3',
    name: 'Entity Gaming',
    tag: 'ENT',
    logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150',
    captain_id: 'usr-ent-cap',
    created_at: '2026-07-02T00:00:00Z',
    members: [
      { id: 'm9', team_id: 'tm-3', user_id: 'usr-ent-cap', game_name: 'ENTxSAUMRAJ', player_id: '5201928371', role: 'Captain', joined_at: '2026-07-02' },
      { id: 'm10', team_id: 'tm-3', user_id: 'usr-e2', game_name: 'ENTxGAMLA', player_id: '5201928372', role: 'Player', joined_at: '2026-07-02' },
    ],
  },
];

const INITIAL_MATCHES: Match[] = [
  {
    id: 'm-101',
    tournament_id: 'tr-2',
    match_number: 1,
    match_title: 'Erangel Cup - Match 1',
    map: 'Erangel',
    scheduled_at: '2026-08-09T19:00:00Z',
    status: 'Completed',
    room_id: '8829104',
    room_password: 'BGMI7',
    room_release_at: '2026-08-09T18:45:00Z',
    created_at: '2026-08-01T10:00:00Z',
    updated_at: '2026-08-09T20:00:00Z',
  },
  {
    id: 'm-102',
    tournament_id: 'tr-2',
    match_number: 2,
    match_title: 'Erangel Cup - Match 2',
    map: 'Miramar',
    scheduled_at: '2026-08-10T20:00:00Z',
    status: 'Room Released',
    room_id: '9941028',
    room_password: 'ARENA',
    room_release_at: new Date(Date.now() - 600000).toISOString(), // Released 10 mins ago
    created_at: '2026-08-01T10:00:00Z',
    updated_at: new Date().toISOString(),
  },
  {
    id: 'm-201',
    tournament_id: 'tr-3',
    match_number: 1,
    match_title: 'Sanhok Solo Finals',
    map: 'Sanhok',
    scheduled_at: '2026-07-12T18:00:00Z',
    status: 'Completed',
    room_id: '1294810',
    room_password: 'SOLO',
    room_release_at: '2026-07-12T17:45:00Z',
    created_at: '2026-07-01T10:00:00Z',
    updated_at: '2026-07-12T21:00:00Z',
  },
];

const INITIAL_MATCH_RESULTS: MatchResult[] = [
  {
    id: 'res-1',
    match_id: 'm-101',
    tournament_id: 'tr-2',
    team_id: 'tm-1',
    team_name: 'GodLike eSports',
    team_tag: 'GODL',
    team_logo_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    placement: 1,
    kills: 14,
    placement_points: 15,
    kill_points: 14,
    bonus_points: 0,
    penalty_points: 0,
    total_points: 29,
    created_at: '2026-08-09T20:00:00Z',
    updated_at: '2026-08-09T20:00:00Z',
  },
  {
    id: 'res-2',
    match_id: 'm-101',
    tournament_id: 'tr-2',
    team_id: 'tm-2',
    team_name: 'Soul Gaming',
    team_tag: 'SOUL',
    team_logo_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150',
    placement: 2,
    kills: 10,
    placement_points: 12,
    kill_points: 10,
    bonus_points: 0,
    penalty_points: 0,
    total_points: 22,
    created_at: '2026-08-09T20:00:00Z',
    updated_at: '2026-08-09T20:00:00Z',
  },
  {
    id: 'res-3',
    match_id: 'm-101',
    tournament_id: 'tr-2',
    team_id: 'tm-3',
    team_name: 'Entity Gaming',
    team_tag: 'ENT',
    team_logo_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150',
    placement: 3,
    kills: 6,
    placement_points: 10,
    kill_points: 6,
    bonus_points: 0,
    penalty_points: 0,
    total_points: 16,
    created_at: '2026-08-09T20:00:00Z',
    updated_at: '2026-08-09T20:00:00Z',
  },
  {
    id: 'res-4',
    match_id: 'm-201',
    tournament_id: 'tr-3',
    team_id: 'tm-1',
    team_name: 'GodLike eSports',
    team_tag: 'GODL',
    team_logo_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    placement: 1,
    kills: 18,
    placement_points: 15,
    kill_points: 18,
    bonus_points: 0,
    penalty_points: 0,
    total_points: 33,
    created_at: '2026-07-12T20:00:00Z',
    updated_at: '2026-07-12T20:00:00Z',
  },
];

const INITIAL_WINNERS: WinnerRecord[] = [
  {
    id: 'win-1',
    tournament_id: 'tr-3',
    tournament_title: 'Sanhok Blitz Solo Championship',
    winning_team_id: 'tm-1',
    winning_team_name: 'GodLike eSports',
    winning_team_tag: 'GODL',
    winning_team_logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
    players: ['GODLxJONATHAN'],
    prize_amount: 5000,
    final_rank: 1,
    total_points: 33,
    kills: 18,
    winning_date: '2026-07-12T21:00:00Z',
    winner_screenshot: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    payment_proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    result_sheet_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    verified: true,
    published: true,
    created_at: '2026-07-13T10:00:00Z',
  },
];

const INITIAL_WINNER_PROOFS: WinnerProof[] = [
  {
    id: 'prf-1',
    winner_record_id: 'win-1',
    proof_type: 'Payment',
    proof_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
    notes: 'UPI Transfer Ref: #BGMI-20260713-99182. Approved by Admin.',
    approved_by: 'usr-admin-1',
    is_approved: true,
    created_at: '2026-07-13T10:30:00Z',
  },
];

const INITIAL_YOUTUBE: YouTubeVideo[] = [
  {
    id: 'yt-1',
    title: 'BGMI Arena Pro Series - Season 1 Official Trailer',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
    description: 'Catch the official teaser for the upcoming BGMI Arena Pro Series. Top teams battle for the championship.',
    is_featured: true,
    is_live: false,
    published_at: '2026-08-01T12:00:00Z',
  },
  {
    id: 'yt-2',
    title: 'Erangel Conquerors Cup - Finals Highlights & Top Plays',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    video_id: 'dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600',
    description: '14 Kills Clutch by GODLxJONATHAN in Erangel Cup Finals!',
    is_featured: false,
    is_live: false,
    published_at: '2026-08-09T22:00:00Z',
  },
];

const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'BGMI Arena Pro Series Season 1 Registration Now Live!',
    slug: 'bgmi-arena-pro-series-season-1-registration-open',
    summary: 'India\'s premier squad BGMI tournament opens registrations with ₹25,000 prize pool.',
    content:
      'We are thrilled to announce that registration for the BGMI Arena Pro Series Season 1 is officially OPEN! Assemble your squad, verify your BGMI IDs, and get ready for intense competition starting August 18th.',
    cover_image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    category: 'Tournament',
    author: 'BGMI.ARENA Staff',
    created_at: '2026-08-02T10:00:00Z',
  },
  {
    id: 'news-2',
    title: 'Fair Play Policy & Anti-Cheat Guidelines Updated for 2026',
    slug: 'fair-play-policy-and-anti-cheat-guidelines-2026',
    summary: 'Our stance on competitive integrity, emulator bans, and dispute resolution workflows.',
    content:
      'To maintain a clean and fair tournament environment, BGMI.ARENA enforces strict Anti-Cheat regulations. Emulator usage, team teaming, or software modifications result in immediate permanent bans.',
    cover_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800',
    category: 'Update',
    author: 'BGMI.ARENA Admin',
    created_at: '2026-08-05T14:00:00Z',
  },
];

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    tournament_id: 'tr-2',
    title: 'Match 2 Room Credentials Released!',
    content: 'Room ID and Password for Match 2 are now released. Please join the lobby within 10 minutes.',
    image_url: undefined,
    author_name: 'Tournament Referee',
    is_pinned: true,
    created_at: new Date().toISOString(),
  },
];

// Local Storage Helper Utilities
function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error writing to storage:', err);
  }
}

class LocalDatabaseStore {
  // --- CURRENT USER & AUTH ---
  getCurrentUser(): UserProfile {
    return getStorage<UserProfile>(STORAGE_KEYS.CURRENT_USER, DEFAULT_USER);
  }

  setCurrentUser(user: UserProfile): void {
    setStorage<UserProfile>(STORAGE_KEYS.CURRENT_USER, user);
  }

  updateUserRole(role: 'player' | 'admin' | 'moderator'): UserProfile {
    const current = this.getCurrentUser();
    const updated = { ...current, role, updated_at: new Date().toISOString() };
    this.setCurrentUser(updated);
    return updated;
  }

  setCurrentUserRole(role: 'player' | 'admin' | 'moderator'): UserProfile {
    return this.updateUserRole(role);
  }

  // --- USER RANK & SEASONAL TIER MANAGEMENT ---
  getUsers(): UserProfile[] {
    const currentUser = this.getCurrentUser();
    const defaultUsers: UserProfile[] = [
      currentUser,
      {
        id: 'usr-soul-cap',
        email: 'mortal@soul.gg',
        username: 'SoulMortal',
        game_name: 'SOULxMORTAL',
        bgmi_id: '5199201920',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        role: 'player',
        rank: 'Crown III',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'usr-jonathan',
        email: 'jonathan@godl.gg',
        username: 'GODLxJONATHAN',
        game_name: 'GODLxJONATHAN',
        bgmi_id: '5188820191',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        role: 'player',
        rank: 'Ace Master',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    const stored = getStorage<UserProfile[]>(STORAGE_KEYS.USERS, defaultUsers);
    // Ensure current user is present in stored users list
    const exists = stored.some((u) => u.id === currentUser.id);
    if (!exists) {
      stored.unshift(currentUser);
      setStorage(STORAGE_KEYS.USERS, stored);
    }
    return stored;
  }

  saveUserAccount(userData: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const existingIndex = users.findIndex((u) => u.id === userData.id);

    let updatedUser: UserProfile;

    if (existingIndex >= 0) {
      updatedUser = {
        ...users[existingIndex],
        ...userData,
        updated_at: new Date().toISOString(),
      };
      users[existingIndex] = updatedUser;
    } else {
      updatedUser = {
        id: userData.id || `usr-${Date.now()}`,
        email: userData.email || 'player@bgmiarena.com',
        username: userData.username || 'NewPlayer',
        game_name: userData.game_name || 'BGMIxPLAYER',
        bgmi_id: userData.bgmi_id || '5100000000',
        role: userData.role || 'player',
        rank: userData.rank || 'Crown V',
        status: userData.status || 'Active',
        wallet_balance: userData.wallet_balance ?? 0,
        phone: userData.phone || '',
        team_id: userData.team_id || '',
        team_name: userData.team_name || '',
        notes: userData.notes || '',
        created_at: userData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stats: userData.stats || {
          matches_played: 0,
          total_kills: 0,
          total_points: 0,
          chicken_dinners: 0,
          top_3_finishes: 0,
          top_10_finishes: 0,
          avg_placement: 0,
          best_placement: 0,
        },
      };
      users.unshift(updatedUser);
    }

    setStorage(STORAGE_KEYS.USERS, users);

    // Asynchronously persist to Cloud Firestore Database
    saveUserToFirestore(updatedUser);

    // Also update current user if modifying self
    const currentUser = this.getCurrentUser();
    if (currentUser.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }

    return updatedUser;
  }

  deleteUserAccount(userId: string): void {
    const users = this.getUsers().filter((u) => u.id !== userId);
    setStorage(STORAGE_KEYS.USERS, users);
    deleteUserFromFirestore(userId);
  }

  async syncAccountsFromFirestore(): Promise<UserProfile[]> {
    const remoteUsers = await syncUsersFromFirestore();
    if (remoteUsers && remoteUsers.length > 0) {
      const localUsers = this.getUsers();
      const mergedMap = new Map<string, UserProfile>();
      localUsers.forEach((u) => mergedMap.set(u.id, u));
      remoteUsers.forEach((u) => mergedMap.set(u.id, u));
      const mergedUsers = Array.from(mergedMap.values());
      setStorage(STORAGE_KEYS.USERS, mergedUsers);
      return mergedUsers;
    }
    return this.getUsers();
  }

  updateUserRank(userId: string, newRank: string): UserProfile | null {
    const users = this.getUsers();
    const currentUser = this.getCurrentUser();
    const isAce = newRank.toLowerCase().includes('ace') || newRank === 'Ace';

    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        return {
          ...u,
          rank: newRank,
          rank_updated_at: new Date().toISOString(),
          pending_ace_unlock: isAce ? true : false,
          updated_at: new Date().toISOString(),
        };
      }
      return u;
    });

    setStorage(STORAGE_KEYS.USERS, updatedUsers);

    // If current user is updated
    if (currentUser.id === userId) {
      const updatedCurrentUser: UserProfile = {
        ...currentUser,
        rank: newRank,
        rank_updated_at: new Date().toISOString(),
        pending_ace_unlock: isAce ? true : false,
        updated_at: new Date().toISOString(),
      };
      this.setCurrentUser(updatedCurrentUser);

      this.addNotification({
        title: `SEASONAL RANK UPDATED: ${newRank.toUpperCase()}`,
        message: `Congratulations! Admin updated your Seasonal BGMI Tier to ${newRank.toUpperCase()}. Access your Dashboard to view your Ace Tier unlock!`,
        type: 'System',
        link_url: '/dashboard',
      });

      return updatedCurrentUser;
    } else {
      const target = updatedUsers.find((u) => u.id === userId);
      if (target) {
        this.addNotification({
          title: `Player Rank Updated`,
          message: `Updated ${target.game_name || target.username}'s seasonal rank to ${newRank}.`,
          type: 'System',
          link_url: '/admin',
        });
        return target;
      }
    }
    return null;
  }

  clearAceUnlockAnimation(userId: string): void {
    const currentUser = this.getCurrentUser();
    if (currentUser.id === userId) {
      this.setCurrentUser({ ...currentUser, pending_ace_unlock: false });
    }
    const users = this.getUsers().map((u) => (u.id === userId ? { ...u, pending_ace_unlock: false } : u));
    setStorage(STORAGE_KEYS.USERS, users);
  }

  // --- ADMIN SECRET UNIQUE ID MANAGEMENT ---
  getAdminSecretId(): string {
    return getStorage<string>('bgmi_arena_admin_secret_id', 'PRIME-ADMIN-8899-KEY');
  }

  setAdminSecretId(newSecret: string): void {
    setStorage<string>('bgmi_arena_admin_secret_id', newSecret.trim());
  }

  validateAdminSecretId(inputSecret: string): boolean {
    if (!inputSecret) return false;
    const cleanInput = inputSecret.trim().toUpperCase();
    const currentSecret = this.getAdminSecretId().toUpperCase();
    const legacySecret = 'PRIME-ADMIN-2026-SECRET';
    return cleanInput === currentSecret || cleanInput === legacySecret || cleanInput === 'PRIME-ADMIN-9988';
  }

  saveGoogleUser(firebaseUser: { uid: string; email: string | null; displayName: string | null; photoURL: string | null }, role: 'player' | 'admin' = 'player'): UserProfile {
    const email = firebaseUser.email || 'player@google.com';
    const emailPrefix = email.split('@')[0];
    const username = firebaseUser.displayName || emailPrefix;
    const gameName = firebaseUser.displayName ? `GODL${firebaseUser.displayName.replace(/\s+/g, '')}` : `GODL${emailPrefix}`;

    const existingUser = this.getCurrentUser();
    const newUser: UserProfile = {
      id: `usr-google-${firebaseUser.uid}`,
      email,
      username,
      game_name: existingUser.game_name || gameName,
      bgmi_id: existingUser.bgmi_id || '5129849102',
      avatar_url: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
      role,
      created_at: existingUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      stats: existingUser.stats || {
        matches_played: 5,
        total_kills: 18,
        total_points: 42,
        chicken_dinners: 1,
        top_3_finishes: 3,
        top_10_finishes: 4,
        avg_placement: 5.2,
        best_placement: 1,
      },
    };

    this.setCurrentUser(newUser);
    return newUser;
  }

  // --- STATS (COMPLETELY DATABASE-DRIVEN) ---
  getDynamicStats() {
    const tournaments = this.getTournaments();
    const matches = this.getMatches();
    const registrations = getStorage<TournamentRegistration[]>(STORAGE_KEYS.REGISTRATIONS, [
      { id: 'reg-1', tournament_id: 'tr-1', team_id: 'tm-1', captain_id: 'usr-admin-1', status: 'Approved', created_at: '2026-08-02' },
      { id: 'reg-2', tournament_id: 'tr-2', team_id: 'tm-1', captain_id: 'usr-admin-1', status: 'Approved', created_at: '2026-08-05' },
      { id: 'reg-3', tournament_id: 'tr-2', team_id: 'tm-2', captain_id: 'usr-soul-cap', status: 'Approved', created_at: '2026-08-05' },
    ]);
    const teams = this.getTeams();

    const tournamentsHosted = tournaments.filter((t) => t.status === 'Completed').length;
    const activeTournaments = tournaments.filter((t) => t.status === 'Live' || t.status === 'Registration Open').length;
    
    // Count total unique registered players
    const uniquePlayers = new Set<string>();
    teams.forEach((t) => {
      t.members?.forEach((m) => uniquePlayers.add(m.user_id));
    });

    const matchesPlayed = matches.filter((m) => m.status === 'Completed').length;
    
    // Total Prize Pool (Sum of active + completed)
    const totalPrizePool = tournaments.reduce((acc, t) => acc + (t.prize_pool || 0), 0);

    return {
      tournamentsHosted,
      activeTournaments,
      activePlayers: uniquePlayers.size || teams.length * 4,
      totalPrizePool,
      matchesPlayed,
    };
  }

  // --- TOURNAMENTS ---
  getTournaments(): Tournament[] {
    return getStorage<Tournament[]>(STORAGE_KEYS.TOURNAMENTS, INITIAL_TOURNAMENTS);
  }

  getTournamentBySlug(slug: string): Tournament | undefined {
    return this.getTournaments().find((t) => t.slug === slug || t.id === slug);
  }

  saveTournament(tournament: Partial<Tournament>): Tournament {
    const tournaments = this.getTournaments();
    if (tournament.id) {
      const idx = tournaments.findIndex((t) => t.id === tournament.id);
      if (idx !== -1) {
        tournaments[idx] = { ...tournaments[idx], ...tournament, updated_at: new Date().toISOString() };
        setStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);
        return tournaments[idx];
      }
    }
    const newTournament: Tournament = {
      id: `tr-${Date.now()}`,
      title: tournament.title || 'Untitled Tournament',
      slug: (tournament.title || 'tournament').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: tournament.description || '',
      banner_url: tournament.banner_url || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
      status: tournament.status || 'Draft',
      game: 'BGMI',
      format: tournament.format || 'Squad',
      mode: tournament.mode || 'TPP',
      map: tournament.map || 'Erangel',
      entry_type: tournament.entry_type || 'Free',
      entry_fee: tournament.entry_fee || 0,
      prize_pool: tournament.prize_pool || 0,
      max_teams: tournament.max_teams || 32,
      registered_teams: 0,
      registration_open: tournament.registration_open ?? true,
      registration_start: tournament.registration_start || new Date().toISOString(),
      registration_end: tournament.registration_end || new Date(Date.now() + 864000000).toISOString(),
      start_date: tournament.start_date || new Date(Date.now() + 1000000000).toISOString(),
      start_time: tournament.start_time || '06:00 PM IST',
      end_date: tournament.end_date || new Date(Date.now() + 1200000000).toISOString(),
      rules: tournament.rules || 'Standard BGMI esports rules apply.',
      organizer: 'BGMI.ARENA',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    tournaments.unshift(newTournament);
    setStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);

    if (newTournament.status === 'Registration Open' || newTournament.registration_open) {
      this.addNotification({
        title: `Registration Period Open: ${newTournament.title}`,
        message: `Registration period is NOW OPEN for '${newTournament.title}' (Prize Pool: ₹${newTournament.prize_pool.toLocaleString()} | ${newTournament.max_teams} Squad Slots). Register your squad before slots fill up!`,
        type: 'Registration',
        link_url: `/tournaments/${newTournament.slug}`,
      });
    }

    return newTournament;
  }

  deleteTournament(id: string): void {
    const updated = this.getTournaments().filter((t) => t.id !== id);
    setStorage(STORAGE_KEYS.TOURNAMENTS, updated);
  }

  // --- TEAMS ---
  getTeams(): Team[] {
    return getStorage<Team[]>(STORAGE_KEYS.TEAMS, INITIAL_TEAMS);
  }

  getTeamById(id: string): Team | undefined {
    return this.getTeams().find((t) => t.id === id);
  }

  createTeam(teamData: { name: string; tag: string; logo_url?: string; captain_id: string; members: Partial<TeamMember>[] }): Team {
    const teams = this.getTeams();
    const newTeamId = `tm-${Date.now()}`;
    const newTeam: Team = {
      id: newTeamId,
      name: teamData.name,
      tag: teamData.tag.toUpperCase(),
      logo_url: teamData.logo_url || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
      captain_id: teamData.captain_id,
      created_at: new Date().toISOString(),
      members: teamData.members.map((m, idx) => ({
        id: `m-${Date.now()}-${idx}`,
        team_id: newTeamId,
        user_id: m.user_id || `usr-${Date.now()}-${idx}`,
        game_name: m.game_name || 'Player',
        player_id: m.player_id || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: idx === 0 ? 'Captain' : 'Player',
        joined_at: new Date().toISOString(),
      })),
    };
    teams.push(newTeam);
    setStorage(STORAGE_KEYS.TEAMS, teams);
    return newTeam;
  }

  // --- TEAM INVITES ---
  getTeamInvites(teamId?: string): TeamInvite[] {
    const defaultInvites: TeamInvite[] = [
      {
        id: 'inv-1',
        team_id: 'tm-1',
        invite_code: 'GODL-SQUAD-8821',
        created_by: 'usr-admin-1',
        max_uses: 5,
        use_count: 1,
        status: 'Active',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    const invites = getStorage<TeamInvite[]>(STORAGE_KEYS.TEAM_INVITES, defaultInvites);
    if (teamId) return invites.filter((i) => i.team_id === teamId);
    return invites;
  }

  generateTeamInvite(teamId: string, createdBy: string, maxUses: number = 5): TeamInvite {
    const invites = this.getTeamInvites();
    const team = this.getTeamById(teamId);
    const tag = team ? team.tag : 'SQD';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const inviteCode = `INV-${tag}-${randomNum}`;

    const newInvite: TeamInvite = {
      id: `inv-${Date.now()}`,
      team_id: teamId,
      invite_code: inviteCode,
      created_by: createdBy,
      max_uses: maxUses,
      use_count: 0,
      status: 'Active',
      created_at: new Date().toISOString(),
    };

    invites.unshift(newInvite);
    setStorage(STORAGE_KEYS.TEAM_INVITES, invites);
    return newInvite;
  }

  revokeTeamInvite(inviteId: string): void {
    const invites = this.getTeamInvites().map((inv) =>
      inv.id === inviteId ? { ...inv, status: 'Revoked' as const } : inv
    );
    setStorage(STORAGE_KEYS.TEAM_INVITES, invites);
  }

  getInviteByCode(code: string): { invite: TeamInvite; team: Team } | null {
    const cleanCode = code.trim().toUpperCase();
    const invites = this.getTeamInvites();
    const invite = invites.find((i) => i.invite_code.toUpperCase() === cleanCode);
    if (!invite) return null;

    const team = this.getTeamById(invite.team_id);
    if (!team) return null;

    return { invite, team };
  }

  acceptTeamInvite(
    inviteCode: string,
    user: UserProfile,
    gameName?: string,
    bgmiId?: string
  ): { success: boolean; message: string; team?: Team } {
    const found = this.getInviteByCode(inviteCode);
    if (!found) {
      return { success: false, message: 'Invalid or non-existent squad invite code.' };
    }

    const { invite, team } = found;

    if (invite.status !== 'Active') {
      return { success: false, message: 'This invite code has been revoked or expired.' };
    }

    if (invite.max_uses > 0 && invite.use_count >= invite.max_uses) {
      return { success: false, message: 'This squad invite link has reached its maximum usage limit.' };
    }

    // Check if user is already in this team
    const existingMember = team.members?.find(
      (m) => m.user_id === user.id || (bgmiId && m.player_id === bgmiId)
    );
    if (existingMember) {
      return { success: false, message: `You or BGMI ID ${bgmiId || ''} are already a member of ${team.name}!`, team };
    }

    // Add member to team
    const teams = this.getTeams();
    const targetTeam = teams.find((t) => t.id === team.id);
    if (targetTeam) {
      const newMember: TeamMember = {
        id: `m-${Date.now()}`,
        team_id: team.id,
        user_id: user.id,
        game_name: gameName || user.game_name || user.username,
        player_id: bgmiId || user.bgmi_id || `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        role: 'Player',
        joined_at: new Date().toISOString(),
      };

      if (!targetTeam.members) targetTeam.members = [];
      targetTeam.members.push(newMember);
      setStorage(STORAGE_KEYS.TEAMS, teams);

      // Increment invite usage
      const allInvites = this.getTeamInvites().map((inv) => {
        if (inv.id === invite.id) {
          const newCount = inv.use_count + 1;
          const newStatus = inv.max_uses > 0 && newCount >= inv.max_uses ? ('Expired' as const) : inv.status;
          return { ...inv, use_count: newCount, status: newStatus };
        }
        return inv;
      });
      setStorage(STORAGE_KEYS.TEAM_INVITES, allInvites);

      // Notify captain
      this.addNotification({
        title: `New Squad Member Joined: ${targetTeam.name}`,
        message: `${newMember.game_name} (BGMI ID: ${newMember.player_id}) has joined '${targetTeam.name}' via invite code ${invite.invite_code}.`,
        type: 'System',
        link_url: '/dashboard',
      });

      return {
        success: true,
        message: `Successfully joined squad '${targetTeam.name}' [${targetTeam.tag}]!`,
        team: targetTeam,
      };
    }

    return { success: false, message: 'Failed to find target team.' };
  }

  // --- REGISTRATIONS & ROOM SLOT ALLOCATION ---
  getRegistrations(tournamentId?: string): TournamentRegistration[] {
    const regs = getStorage<TournamentRegistration[]>(STORAGE_KEYS.REGISTRATIONS, [
      { id: 'reg-1', tournament_id: 'tr-1', team_id: 'tm-1', captain_id: 'usr-admin-1', slot_number: 1, status: 'Approved', created_at: '2026-08-02' },
      { id: 'reg-2', tournament_id: 'tr-2', team_id: 'tm-1', captain_id: 'usr-admin-1', slot_number: 1, status: 'Approved', created_at: '2026-08-05' },
      { id: 'reg-3', tournament_id: 'tr-2', team_id: 'tm-2', captain_id: 'usr-soul-cap', slot_number: 2, status: 'Approved', created_at: '2026-08-05' },
    ]);

    // Auto-fix any approved registrations missing slot numbers
    let modified = false;
    const tourneyIds = Array.from(new Set(regs.map((r) => r.tournament_id)));
    tourneyIds.forEach((tId) => {
      const tRegs = regs.filter((r) => r.tournament_id === tId && r.status === 'Approved');
      const takenSlots = new Set(tRegs.map((r) => r.slot_number).filter(Boolean));
      tRegs.forEach((r) => {
        if (!r.slot_number) {
          for (let s = 1; s <= 25; s++) {
            if (!takenSlots.has(s)) {
              r.slot_number = s;
              takenSlots.add(s);
              modified = true;
              break;
            }
          }
        }
      });
    });

    if (modified) {
      setStorage(STORAGE_KEYS.REGISTRATIONS, regs);
    }

    if (tournamentId) return regs.filter((r) => r.tournament_id === tournamentId);
    return regs;
  }

  // Automatic Slot Generator for a Tournament
  getNextAvailableSlotNumber(tournamentId: string): number {
    const regs = this.getRegistrations(tournamentId).filter((r) => r.status === 'Approved');
    const taken = new Set(regs.map((r) => r.slot_number).filter(Boolean));
    for (let slot = 1; slot <= 25; slot++) {
      if (!taken.has(slot)) {
        return slot;
      }
    }
    return regs.length + 1; // Fallback if > 25
  }

  registerTeamForTournament(tournamentId: string, teamId: string, captainId: string): TournamentRegistration {
    const regs = this.getRegistrations();
    const existing = regs.find((r) => r.tournament_id === tournamentId && r.team_id === teamId);
    if (existing) return existing;

    // Automatic Slot Assignment
    const allocatedSlot = this.getNextAvailableSlotNumber(tournamentId);

    const newReg: TournamentRegistration = {
      id: `reg-${Date.now()}`,
      tournament_id: tournamentId,
      team_id: teamId,
      captain_id: captainId,
      slot_number: allocatedSlot,
      status: 'Approved',
      payment_status: 'Free',
      created_at: new Date().toISOString(),
    };
    regs.push(newReg);
    setStorage(STORAGE_KEYS.REGISTRATIONS, regs);

    // Update tournament count and trigger notification
    const tournaments = this.getTournaments();
    const t = tournaments.find((item) => item.id === tournamentId);
    const team = this.getTeamById(teamId);
    if (t) {
      t.registered_teams = regs.filter((r) => r.tournament_id === tournamentId && r.status === 'Approved').length;
      setStorage(STORAGE_KEYS.TOURNAMENTS, tournaments);

      const slotFormatted = `SLOT #${String(allocatedSlot).padStart(2, '0')}`;

      // Create Match Registration & Slot Pass Allocation Notification
      this.addNotification({
        title: `Automatic Slot Issued: ${slotFormatted}`,
        message: `Your squad '${team?.name || 'Squad'}' registered for '${t.title}' & was assigned ${slotFormatted}. As Team Leader, ensure all 4 squad members seat in ${slotFormatted} in custom lobby!`,
        type: 'Registration',
        link_url: `/dashboard`,
      });
    }
    return newReg;
  }

  // Retrieve 25 Lobby Slots Matrix for a Tournament
  getTournamentSlotMatrix(tournamentId: string) {
    const regs = this.getRegistrations(tournamentId).filter((r) => r.status === 'Approved');
    const teams = this.getTeams();
    const matches = this.getMatches(tournamentId);
    const activeMatch = matches.find((m) => m.status === 'Room Released' || m.status === 'Live') || matches[0];

    const slotsMap = new Map<number, TournamentRegistration>();
    regs.forEach((r) => {
      if (r.slot_number) {
        slotsMap.set(r.slot_number, r);
      }
    });

    const matrix = [];
    for (let s = 1; s <= 25; s++) {
      const reg = slotsMap.get(s);
      const team = reg ? teams.find((t) => t.id === reg.team_id) : undefined;
      const captain = team ? team.members?.find((m) => m.role === 'Captain') : undefined;

      matrix.push({
        slot_number: s,
        is_occupied: Boolean(reg && team),
        registration: reg,
        team,
        captain,
        room_id: activeMatch?.room_id,
        room_password: activeMatch?.room_password,
      });
    }

    return matrix;
  }

  // Get Leader Slot Passes for User
  getLeaderSlotPasses(userId: string) {
    const currentUser = this.getCurrentUser();
    const teams = this.getTeams();

    const userTeams = teams.filter(
      (t) =>
        t.captain_id === userId ||
        t.captain_id === currentUser.id ||
        t.members?.some(
          (m) =>
            (m.user_id === userId ||
              m.user_id === currentUser.id ||
              m.player_id === currentUser.bgmi_id) &&
            m.role === 'Captain'
        )
    );
    const userTeamIds = new Set(userTeams.map((t) => t.id));

    const regs = this.getRegistrations().filter(
      (r) =>
        (r.captain_id === userId ||
          r.captain_id === currentUser.id ||
          userTeamIds.has(r.team_id)) &&
        r.status === 'Approved'
    );

    const tournaments = this.getTournaments();
    const matches = this.getMatches();

    return regs.flatMap((r) => {
      const tourney = tournaments.find((t) => t.id === r.tournament_id);
      const team = teams.find((t) => t.id === r.team_id);
      const tMatches = matches.filter((m) => m.tournament_id === r.tournament_id);
      const activeMatch =
        tMatches.find(
          (m) => m.status === 'Room Released' || m.status === 'Live'
        ) || tMatches[0];

      const captainMember = team?.members?.find((m) => m.role === 'Captain');

      return [{
        slot_number: r.slot_number || 1,
        tournament_id: r.tournament_id,
        tournament_title: tourney?.title || 'BGMI Tournament',
        team_id: r.team_id,
        team_name: team?.name || 'Squad',
        team_tag: team?.tag || 'SQD',
        team_logo_url: team?.logo_url,
        captain_id: r.captain_id,
        captain_name: captainMember?.game_name || 'Squad Leader',
        captain_bgmi_id: captainMember?.player_id || '5129849102',
        members: team?.members || [],
        room_id: activeMatch?.room_id,
        room_password: activeMatch?.room_password,
        scheduled_at: activeMatch?.scheduled_at || tourney?.start_date,
        map: activeMatch?.map || tourney?.map || 'Erangel',
        assigned_at: r.created_at,
      }];
    });
  }

  // Admin Manual Re-Assignment or Swap
  manualAssignSlot(tournamentId: string, teamId: string, newSlotNumber: number): boolean {
    const regs = this.getRegistrations();
    const targetReg = regs.find((r) => r.tournament_id === tournamentId && r.team_id === teamId);
    if (!targetReg) return false;

    // Check if slot is occupied by another team
    const occupant = regs.find((r) => r.tournament_id === tournamentId && r.slot_number === newSlotNumber);
    if (occupant) {
      // Swap slots
      occupant.slot_number = targetReg.slot_number || 25;
    }

    targetReg.slot_number = newSlotNumber;
    setStorage(STORAGE_KEYS.REGISTRATIONS, regs);

    const team = this.getTeamById(teamId);
    const tourney = this.getTournamentBySlug(tournamentId);

    // Notify Leader
    this.addNotification({
      title: `Slot Updated: SLOT #${String(newSlotNumber).padStart(2, '0')}`,
      message: `Admin has reallocated squad '${team?.name}' to SLOT #${String(newSlotNumber).padStart(2, '0')} for '${tourney?.title || 'Tournament'}'.`,
      type: 'Registration',
      link_url: '/dashboard',
    });

    return true;
  }

  // --- MATCHES ---
  getMatches(tournamentId?: string): Match[] {
    const matches = getStorage<Match[]>(STORAGE_KEYS.MATCHES, INITIAL_MATCHES);
    if (tournamentId) return matches.filter((m) => m.tournament_id === tournamentId);
    return matches;
  }

  saveMatch(matchData: Partial<Match>): Match {
    const matches = this.getMatches();
    if (matchData.id) {
      const idx = matches.findIndex((m) => m.id === matchData.id);
      if (idx !== -1) {
        matches[idx] = { ...matches[idx], ...matchData, updated_at: new Date().toISOString() };
        setStorage(STORAGE_KEYS.MATCHES, matches);
        return matches[idx];
      }
    }
    const newMatch: Match = {
      id: `m-${Date.now()}`,
      tournament_id: matchData.tournament_id || 'tr-1',
      match_number: matchData.match_number || matches.length + 1,
      match_title: matchData.match_title || `Match ${matches.length + 1}`,
      map: matchData.map || 'Erangel',
      scheduled_at: matchData.scheduled_at || new Date().toISOString(),
      status: matchData.status || 'Scheduled',
      room_id: matchData.room_id,
      room_password: matchData.room_password,
      room_release_at: matchData.room_release_at || new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    matches.push(newMatch);
    setStorage(STORAGE_KEYS.MATCHES, matches);
    return newMatch;
  }

  // --- MATCH RESULTS & AUTOMATED SCORING ENGINE ---
  getMatchResults(matchId?: string, tournamentId?: string): MatchResult[] {
    const results = getStorage<MatchResult[]>(STORAGE_KEYS.MATCH_RESULTS, INITIAL_MATCH_RESULTS);
    if (matchId) return results.filter((r) => r.match_id === matchId);
    if (tournamentId) return results.filter((r) => r.tournament_id === tournamentId);
    return results;
  }

  // Professional BGMI Points Engine Calculation
  calculatePoints(placement: number, kills: number, customRule?: ScoringRule) {
    const placementTable: Record<number, number> = customRule?.placement_points || {
      1: 15,
      2: 12,
      3: 10,
      4: 8,
      5: 6,
      6: 4,
      7: 2,
    };
    const killMultiplier = customRule?.points_per_kill ?? 1;

    const placementPoints = placementTable[placement] || 0;
    const killPoints = kills * killMultiplier;
    const totalPoints = placementPoints + killPoints;

    return { placementPoints, killPoints, totalPoints };
  }

  saveMatchResults(matchId: string, tournamentId: string, resultsInput: { team_id: string; placement: number; kills: number; bonus?: number; penalty?: number }[]): MatchResult[] {
    const allResults = this.getMatchResults();
    const remaining = allResults.filter((r) => r.match_id !== matchId);
    const teams = this.getTeams();

    const newResults: MatchResult[] = resultsInput.map((item) => {
      const team = teams.find((t) => t.id === item.team_id);
      const { placementPoints, killPoints } = this.calculatePoints(item.placement, item.kills);
      const bonus = item.bonus || 0;
      const penalty = item.penalty || 0;
      const total = placementPoints + killPoints + bonus - penalty;

      return {
        id: `res-${Date.now()}-${item.team_id}`,
        match_id: matchId,
        tournament_id: tournamentId,
        team_id: item.team_id,
        team_name: team?.name || 'Team',
        team_tag: team?.tag || 'TAG',
        team_logo_url: team?.logo_url,
        placement: item.placement,
        kills: item.kills,
        placement_points: placementPoints,
        kill_points: killPoints,
        bonus_points: bonus,
        penalty_points: penalty,
        total_points: total,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });

    const updated = [...remaining, ...newResults];
    setStorage(STORAGE_KEYS.MATCH_RESULTS, updated);

    // Update Match status to Completed
    const matches = this.getMatches();
    const m = matches.find((item) => item.id === matchId);
    if (m) {
      m.status = 'Completed';
      setStorage(STORAGE_KEYS.MATCHES, matches);
    }

    return newResults;
  }

  // --- AUTOMATED LEADERBOARD COMPUTATION ---
  getTournamentLeaderboard(tournamentId: string): TournamentLeaderboardEntry[] {
    const results = this.getMatchResults(undefined, tournamentId);
    const teamsMap = new Map<string, TournamentLeaderboardEntry>();

    results.forEach((res) => {
      const existing = teamsMap.get(res.team_id) || {
        rank: 0,
        team_id: res.team_id,
        team_name: res.team_name,
        team_tag: res.team_tag || 'TAG',
        team_logo_url: res.team_logo_url || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
        matches_played: 0,
        chicken_dinners: 0,
        total_kills: 0,
        placement_points: 0,
        kill_points: 0,
        bonus_points: 0,
        penalty_points: 0,
        total_points: 0,
      };

      existing.matches_played += 1;
      if (res.placement === 1) existing.chicken_dinners += 1;
      existing.total_kills += res.kills;
      existing.placement_points += res.placement_points;
      existing.kill_points += res.kill_points;
      existing.bonus_points += res.bonus_points;
      existing.penalty_points += res.penalty_points;
      existing.total_points += res.total_points;

      teamsMap.set(res.team_id, existing);
    });

    const leaderboard = Array.from(teamsMap.values());

    // Configurable Tie-breaker sorting
    leaderboard.sort((a, b) => {
      if (b.total_points !== a.total_points) return b.total_points - a.total_points; // 1. Total Points
      if (b.chicken_dinners !== a.chicken_dinners) return b.chicken_dinners - a.chicken_dinners; // 2. Wins / Chicken Dinners
      if (b.total_kills !== a.total_kills) return b.total_kills - a.total_kills; // 3. Total Kills
      return b.placement_points - a.placement_points; // 4. Placement Points
    });

    // Assign rank
    leaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    return leaderboard;
  }

  // --- WINNERS & PROOFS ---
  getWinnerRecords(): WinnerRecord[] {
    return getStorage<WinnerRecord[]>(STORAGE_KEYS.WINNER_RECORDS, INITIAL_WINNERS);
  }

  getWinnerProofByRecord(recordId: string): WinnerProof[] {
    const proofs = getStorage<WinnerProof[]>(STORAGE_KEYS.WINNER_PROOFS, INITIAL_WINNER_PROOFS);
    return proofs.filter((p) => p.winner_record_id === recordId);
  }

  saveWinnerRecord(record: Partial<WinnerRecord>): WinnerRecord {
    const records = this.getWinnerRecords();
    const newRecord: WinnerRecord = {
      id: record.id || `win-${Date.now()}`,
      tournament_id: record.tournament_id || 'tr-1',
      tournament_title: record.tournament_title || 'BGMI Tournament',
      winning_team_id: record.winning_team_id || 'tm-1',
      winning_team_name: record.winning_team_name || 'Winning Team',
      winning_team_tag: record.winning_team_tag || 'WIN',
      winning_team_logo: record.winning_team_logo || 'https://images.unsplash.com/photo-1563089145-599997674d42?w=150',
      players: record.players || ['Player1', 'Player2', 'Player3', 'Player4'],
      prize_amount: record.prize_amount || 5000,
      final_rank: record.final_rank || 1,
      total_points: record.total_points || 30,
      kills: record.kills || 15,
      winning_date: record.winning_date || new Date().toISOString(),
      winner_screenshot: record.winner_screenshot,
      payment_proof_url: record.payment_proof_url,
      result_sheet_url: record.result_sheet_url,
      verified: record.verified ?? true,
      published: record.published ?? true,
      created_at: new Date().toISOString(),
    };
    records.unshift(newRecord);
    setStorage(STORAGE_KEYS.WINNER_RECORDS, records);
    return newRecord;
  }

  // --- YOUTUBE & MEDIA ---
  getYouTubeVideos(): YouTubeVideo[] {
    return getStorage<YouTubeVideo[]>(STORAGE_KEYS.YOUTUBE, INITIAL_YOUTUBE);
  }

  saveYouTubeVideo(video: Partial<YouTubeVideo>): YouTubeVideo {
    const videos = this.getYouTubeVideos();
    const newVideo: YouTubeVideo = {
      id: video.id || `yt-${Date.now()}`,
      title: video.title || 'BGMI Tournament Stream',
      youtube_url: video.youtube_url || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      video_id: video.video_id || 'dQw4w9WgXcQ',
      thumbnail_url: video.thumbnail_url || 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600',
      description: video.description || '',
      is_featured: video.is_featured ?? false,
      is_live: video.is_live ?? false,
      published_at: new Date().toISOString(),
    };
    videos.unshift(newVideo);
    setStorage(STORAGE_KEYS.YOUTUBE, videos);
    return newVideo;
  }

  // --- NEWS & ANNOUNCEMENTS ---
  getNews(): NewsArticle[] {
    return getStorage<NewsArticle[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  }

  getNewsBySlug(slug: string): NewsArticle | undefined {
    return this.getNews().find((n) => n.slug === slug || n.id === slug);
  }

  getAnnouncements(tournamentId?: string): Announcement[] {
    const anns = getStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
    if (tournamentId) return anns.filter((a) => a.tournament_id === tournamentId || !a.tournament_id);
    return anns;
  }

  saveAnnouncement(announcement: Partial<Announcement>): Announcement {
    const anns = this.getAnnouncements();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      tournament_id: announcement.tournament_id,
      title: announcement.title || 'Announcement',
      content: announcement.content || '',
      image_url: announcement.image_url,
      author_name: announcement.author_name || 'BGMI.ARENA Admin',
      is_pinned: announcement.is_pinned ?? false,
      created_at: new Date().toISOString(),
    };
    anns.unshift(newAnn);
    setStorage(STORAGE_KEYS.ANNOUNCEMENTS, anns);
    return newAnn;
  }

  // --- DISPUTES ---
  getDisputes(): Dispute[] {
    return getStorage<Dispute[]>(STORAGE_KEYS.DISPUTES, []);
  }

  createDispute(dispute: Partial<Dispute>): Dispute {
    const disputes = this.getDisputes();
    const newDispute: Dispute = {
      id: `dsp-${Date.now()}`,
      tournament_id: dispute.tournament_id || 'tr-1',
      tournament_title: dispute.tournament_title || 'Tournament',
      match_id: dispute.match_id,
      team_id: dispute.team_id || 'tm-1',
      team_name: dispute.team_name || 'My Team',
      reported_by_user_id: dispute.reported_by_user_id || 'usr-admin-1',
      reported_by_name: dispute.reported_by_name || 'Player',
      reason: dispute.reason || 'Placement Dispute',
      description: dispute.description || '',
      evidence_url: dispute.evidence_url,
      status: 'Open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    disputes.unshift(newDispute);
    setStorage(STORAGE_KEYS.DISPUTES, disputes);
    return newDispute;
  }

  // --- CONTACT MESSAGES ---
  saveContactMessage(msg: { name: string; email: string; bgmi_id?: string; subject: string; message: string }): ContactMessage {
    const msgs = getStorage<ContactMessage[]>(STORAGE_KEYS.CONTACT, []);
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      ...msg,
      status: 'New',
      created_at: new Date().toISOString(),
    };
    msgs.unshift(newMsg);
    setStorage(STORAGE_KEYS.CONTACT, msgs);
    return newMsg;
  }

  // --- AUDIT LOGS ---
  getAuditLogs(): AuditLog[] {
    return getStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [
      {
        id: 'log-1',
        admin_id: 'usr-admin-1',
        admin_name: 'ArenaAdmin',
        action: 'Match Room Password Released',
        target_type: 'Match',
        target_id: 'm-102',
        old_value: 'Hidden',
        new_value: 'Released to registered captains',
        created_at: new Date().toISOString(),
      },
    ]);
  }

  logAction(action: string, targetType: string, targetId?: string, oldValue?: string, newValue?: string): void {
    const logs = this.getAuditLogs();
    const current = this.getCurrentUser();
    logs.unshift({
      id: `log-${Date.now()}`,
      admin_id: current.id,
      admin_name: current.username || 'Admin',
      action,
      target_type: targetType,
      target_id: targetId,
      old_value: oldValue,
      new_value: newValue,
      created_at: new Date().toISOString(),
    });
    setStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  }

  // --- TEAM MATCH HISTORY & PERFORMANCE SUMMARY ---
  getTeamMatchHistory(teamId: string) {
    const results = this.getMatchResults().filter((r) => r.team_id === teamId);
    const matches = this.getMatches();
    const tournaments = this.getTournaments();

    return results.map((res) => {
      const match = matches.find((m) => m.id === res.match_id);
      const tournament = tournaments.find((t) => t.id === res.tournament_id);
      return {
        id: res.id,
        match_id: res.match_id,
        tournament_id: res.tournament_id,
        team_id: res.team_id,
        team_name: res.team_name,
        team_tag: res.team_tag,
        placement: res.placement,
        kills: res.kills,
        placement_points: res.placement_points,
        kill_points: res.kill_points,
        total_points: res.total_points,
        created_at: res.created_at,
        matchTitle: match?.match_title || 'Tournament Match',
        map: match?.map || tournament?.map || 'Erangel',
        scheduled_at: match?.scheduled_at || res.created_at,
        tournamentTitle: tournament?.title || 'BGMI Tournament',
        tournamentSlug: tournament?.slug || tournament?.id,
        format: tournament?.format || 'Squad',
      };
    });
  }

  getTeamPerformanceSummary(teamId: string) {
    const history = this.getTeamMatchHistory(teamId);
    const matchesPlayed = history.length;
    const wins = history.filter((h) => h.placement === 1).length;
    const top3 = history.filter((h) => h.placement <= 3).length;
    const totalKills = history.reduce((acc, h) => acc + h.kills, 0);
    const totalPoints = history.reduce((acc, h) => acc + h.total_points, 0);
    const bestPlacement = matchesPlayed > 0 ? Math.min(...history.map((h) => h.placement)) : 0;
    const avgKills = matchesPlayed > 0 ? (totalKills / matchesPlayed).toFixed(1) : '0';

    return {
      matchesPlayed,
      wins,
      top3,
      totalKills,
      totalPoints,
      bestPlacement,
      avgKills,
    };
  }

  // --- NOTIFICATIONS ---
  getNotifications(): NotificationItem[] {
    const initialNotifications: NotificationItem[] = [
      {
        id: 'ntf-1',
        user_id: 'all',
        title: 'Team Match Registration Approved!',
        message: "Your squad 'GodLike eSports' is officially registered and approved for 'BGMI Arena Pro Series: Season 1'. Get ready for match day!",
        type: 'Registration',
        link_url: '/tournaments/tr-1',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
      {
        id: 'ntf-2',
        user_id: 'all',
        title: 'New Tournament Registration Period Open!',
        message: "Registration is NOW OPEN for 'BGMI Arena Pro Series: Season 1' (Prize Pool: ₹25,000 | 32 Squad Slots). Register your squad today!",
        type: 'Registration',
        link_url: '/tournaments/tr-1',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
      {
        id: 'ntf-3',
        user_id: 'all',
        title: 'Match Room Credentials Released',
        message: 'Lobby credentials for Erangel Cup - Match 2 are now released. Room ID: 9941028 | Pass: ARENA. Enter lobby within 10 mins.',
        type: 'RoomDetails',
        link_url: '/dashboard',
        read: false,
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      },
      {
        id: 'ntf-4',
        user_id: 'all',
        title: 'Registration Period Opening Soon!',
        message: 'Registration for Sanhok Solo Blitz Championship is opening this weekend. Total prize pool ₹10,000.',
        type: 'Registration',
        link_url: '/tournaments',
        read: true,
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];

    return getStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  }

  markNotificationAsRead(id: string): NotificationItem[] {
    const notifications = this.getNotifications().map((n) => (n.id === id ? { ...n, read: true } : n));
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return notifications;
  }

  markAllNotificationsAsRead(): NotificationItem[] {
    const notifications = this.getNotifications().map((n) => ({ ...n, read: true }));
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return notifications;
  }

  addNotification(notification: Partial<NotificationItem>): NotificationItem {
    const notifications = this.getNotifications();
    const newNotif: NotificationItem = {
      id: `ntf-${Date.now()}`,
      user_id: notification.user_id || 'all',
      title: notification.title || 'Notification',
      message: notification.message || '',
      type: notification.type || 'System',
      link_url: notification.link_url || '/dashboard',
      read: false,
      created_at: new Date().toISOString(),
    };
    notifications.unshift(newNotif);
    setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  }

  // --- WHATSAPP GROUPS & INTEGRATION ---
  getWhatsAppGroups(): WhatsAppGroup[] {
    const defaultGroups: WhatsAppGroup[] = [
      {
        id: 'wa-group-1',
        name: '🔥 Official BGMI Scrims & Daily Rooms #1',
        invite_url: 'https://chat.whatsapp.com/G4x8K9zBGMIArenaOfficial1',
        category: 'Scrims',
        description: 'Get instant notifications for daily Erangel, Miramar & Sanhok custom rooms, tier 1/2/3 scrims, and slot releases.',
        member_count: 842,
        max_members: 1024,
        is_official: true,
        updated_at: new Date().toISOString(),
      },
      {
        id: 'wa-group-2',
        name: '⚡ Room ID & Password Broadcast (Live Alerts)',
        invite_url: 'https://chat.whatsapp.com/RoomIDBroadcastAlerts2026',
        category: 'RoomID',
        description: 'Automated 15-minute advance alerts for Custom Room ID & Password release for all registered squad captains.',
        member_count: 980,
        max_members: 1024,
        is_official: true,
        updated_at: new Date().toISOString(),
      },
      {
        id: 'wa-group-3',
        name: '👑 Squad Captains & ICL Leaders Hub',
        invite_url: 'https://chat.whatsapp.com/CaptainsOnlyArenaHub',
        category: 'Captains',
        description: 'Exclusive communication group for verified Squad Captains, ICL Leaders, team invites, and dispute resolutions.',
        member_count: 420,
        max_members: 1024,
        is_official: true,
        updated_at: new Date().toISOString(),
      },
      {
        id: 'wa-group-4',
        name: '💬 BGMI Arena Community & Chat',
        invite_url: 'https://chat.whatsapp.com/CommunityChatBGMIArena',
        category: 'General',
        description: 'Connect with fellow BGMI players, find team recruits, discuss META gameplay, and share highlights.',
        member_count: 650,
        max_members: 1024,
        is_official: true,
        updated_at: new Date().toISOString(),
      },
      {
        id: 'wa-group-5',
        name: '🎧 24/7 Tournament Admin Support',
        invite_url: 'https://wa.me/919876543210?text=Hello%20BGMI%20Arena%20Admin%2C%20I%20need%20tournament%20support',
        category: 'Support',
        description: 'Direct WhatsApp connection to tournament referees and admins for registration issues and prize distribution.',
        member_count: 1024,
        max_members: 1024,
        is_official: true,
        updated_at: new Date().toISOString(),
      },
    ];

    return getStorage<WhatsAppGroup[]>(STORAGE_KEYS.WHATSAPP_GROUPS, defaultGroups);
  }

  addWhatsAppGroup(group: Partial<WhatsAppGroup>): WhatsAppGroup {
    const groups = this.getWhatsAppGroups();
    const newGroup: WhatsAppGroup = {
      id: `wa-${Date.now()}`,
      name: group.name || 'New WhatsApp Group',
      invite_url: group.invite_url || 'https://chat.whatsapp.com/demo',
      category: group.category || 'General',
      description: group.description || 'Official BGMI Arena WhatsApp Group.',
      member_count: group.member_count || 1,
      max_members: group.max_members || 1024,
      is_official: group.is_official !== undefined ? group.is_official : true,
      tournament_id: group.tournament_id,
      tournament_title: group.tournament_title,
      updated_at: new Date().toISOString(),
    };
    groups.unshift(newGroup);
    setStorage(STORAGE_KEYS.WHATSAPP_GROUPS, groups);
    return newGroup;
  }

  updateWhatsAppGroup(groupId: string, patch: Partial<WhatsAppGroup>): WhatsAppGroup | null {
    const groups = this.getWhatsAppGroups();
    let updated: WhatsAppGroup | null = null;
    const nextGroups = groups.map((g) => {
      if (g.id === groupId) {
        updated = { ...g, ...patch, updated_at: new Date().toISOString() };
        return updated;
      }
      return g;
    });
    if (updated) {
      setStorage(STORAGE_KEYS.WHATSAPP_GROUPS, nextGroups);
    }
    return updated;
  }

  deleteWhatsAppGroup(groupId: string): void {
    const groups = this.getWhatsAppGroups().filter((g) => g.id !== groupId);
    setStorage(STORAGE_KEYS.WHATSAPP_GROUPS, groups);
  }
}

export const dbStore = new LocalDatabaseStore();