import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Sparkles,
  ExternalLink,
  Trophy,
  Users,
  Key,
  MessageSquare,
  Newspaper,
  ArrowRight,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Tournament, Team, Match, NewsArticle, WhatsAppGroup } from '../../types';

interface GroundedSource {
  title: string;
  uri: string;
}

interface GroundedAiResult {
  summary: string;
  sources: GroundedSource[];
  isQuotaExhausted?: boolean;
}

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<GroundedAiResult | null>(null);

  // Local Data Matches State
  const [matchingTournaments, setMatchingTournaments] = useState<Tournament[]>([]);
  const [matchingTeams, setMatchingTeams] = useState<Team[]>([]);
  const [matchingMatches, setMatchingMatches] = useState<Match[]>([]);
  const [matchingNews, setMatchingNews] = useState<NewsArticle[]>([]);
  const [matchingWhatsApp, setMatchingWhatsApp] = useState<WhatsAppGroup[]>([]);

  const categories = ['All', 'Tournaments', 'News & Media', 'Player Profiles', 'Active Match Rooms', 'WhatsApp Groups'];

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setAiResult(null);
    }
  }, [isOpen]);

  // Handle keyboard shortcut (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Perform Search Logic (Local + AI Search Grounding)
  useEffect(() => {
    if (!query.trim()) {
      setMatchingTournaments([]);
      setMatchingTeams([]);
      setMatchingMatches([]);
      setMatchingNews([]);
      setMatchingWhatsApp([]);
      setAiResult(null);
      setIsAiLoading(false);
      return;
    }

    const q = query.toLowerCase().trim();

    // 1. Local Database Filtering
    const allTournaments = dbStore.getTournaments();
    const allTeams = dbStore.getTeams();
    const allMatches = dbStore.getMatches();
    const allNews = dbStore.getNews();
    const allWhatsApp = dbStore.getWhatsAppGroups();

    setMatchingTournaments(
      allTournaments
        .filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.format.toLowerCase().includes(q) ||
            t.mode.toLowerCase().includes(q) ||
            t.map.toLowerCase().includes(q)
        )
        .slice(0, 4)
    );

    setMatchingTeams(
      allTeams
        .filter(
          (team) =>
            team.name.toLowerCase().includes(q) ||
            team.tag.toLowerCase().includes(q) ||
            (team.members &&
              team.members.some(
                (m) =>
                  m.game_name.toLowerCase().includes(q) ||
                  m.player_id.includes(q)
              ))
        )
        .slice(0, 4)
    );

    setMatchingMatches(
      allMatches
        .filter(
          (m) =>
            m.match_title.toLowerCase().includes(q) ||
            m.map.toLowerCase().includes(q) ||
            (m.room_id && m.room_id.includes(q))
        )
        .slice(0, 4)
    );

    setMatchingNews(
      allNews
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.summary.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q)
        )
        .slice(0, 4)
    );

    setMatchingWhatsApp(
      allWhatsApp
        .filter(
          (w) =>
            w.name.toLowerCase().includes(q) ||
            w.description.toLowerCase().includes(q) ||
            w.category.toLowerCase().includes(q)
        )
        .slice(0, 4)
    );

    // 2. Debounced Google Search Grounded AI Call (only if query >= 3 chars)
    if (q.length < 3) {
      setAiResult(null);
      setIsAiLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsAiLoading(true);

      try {
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: q,
            category: selectedCategory,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.aiGroundedResult) {
            setAiResult(data.aiGroundedResult);
          } else {
            setAiResult(null);
          }
        }
      } catch (err: any) {
        console.error('Quick Search Grounding error:', err);
      } finally {
        setIsAiLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  if (!isOpen) return null;

  const totalLocalMatches =
    matchingTournaments.length +
    matchingTeams.length +
    matchingMatches.length +
    matchingNews.length +
    matchingWhatsApp.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-black/80 backdrop-blur-md font-mono">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative z-10 w-full max-w-3xl bg-[#0e1017] border-2 border-[#222222] focus-within:border-[#D4FF33]/50 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Top Search Input Box */}
          <div className="p-4 sm:p-5 border-b border-[#222222] bg-[#121420] flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4FF33]/10 border border-[#D4FF33]/30 text-[#D4FF33] flex items-center justify-center shrink-0">
              {isAiLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin text-[#D4FF33]" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </div>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Quick Search tournaments, player profiles, Room IDs, or BGMI esports news..."
              className="w-full bg-transparent text-white text-sm sm:text-base font-bold placeholder-gray-500 focus:outline-none font-mono"
            />

            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-xl bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1a1d2d] border border-gray-800 text-gray-400 hover:text-white transition-colors text-xs font-bold cursor-pointer flex items-center gap-1 shrink-0"
            >
              <kbd className="text-[10px] bg-black px-1.5 py-0.5 rounded border border-gray-700">ESC</kbd>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="px-4 py-2.5 bg-[#090b10] border-b border-[#222222] flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 mr-1">Filter:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#D4FF33] text-black font-extrabold shadow'
                    : 'bg-[#121420] text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Results Area */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {!query.trim() && (
              <div className="py-12 text-center space-y-3 text-gray-500">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 mx-auto flex items-center justify-center text-gray-400">
                  <Sparkles className="w-6 h-6 text-[#D4FF33]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-300 uppercase">Search Arena Intelligence</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Try searching: <span className="text-[#D4FF33]">"BGIS 2026 Grand Finals"</span>, <span className="text-[#D4FF33]">"GodLike Jonathan"</span>, or <span className="text-[#D4FF33]">"Room ID Erangel"</span>
                  </p>
                </div>
              </div>
            )}

            {query.trim() && (
              <>
                {/* 1. GOOGLE SEARCH GROUNDED AI RESULT */}
                {(isAiLoading || aiResult) && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-[#0b1c15] to-[#0e1f2b] border border-emerald-500/40 space-y-3 relative overflow-hidden shadow-lg shadow-emerald-950/30">
                    <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>Google Search Grounded AI</span>
                        </span>
                        {isAiLoading && (
                          <span className="text-[10px] text-emerald-400 animate-pulse font-mono">
                            Searching live web...
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        Real-time Esports Intelligence
                      </span>
                    </div>

                    {isAiLoading && !aiResult && (
                      <div className="py-4 space-y-2 animate-pulse">
                        <div className="h-3 bg-emerald-500/20 rounded w-3/4" />
                        <div className="h-3 bg-emerald-500/20 rounded w-5/6" />
                        <div className="h-3 bg-emerald-500/20 rounded w-2/3" />
                      </div>
                    )}

                    {aiResult && (
                      <div className="space-y-3 text-xs leading-relaxed text-emerald-100">
                        <div className="whitespace-pre-wrap font-mono text-gray-200">
                          {aiResult.summary}
                        </div>

                        {/* Grounding Sources */}
                        {aiResult.sources && aiResult.sources.length > 0 && (
                          <div className="pt-3 border-t border-emerald-500/20 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase text-emerald-400 block">
                              Verified Google Search Grounding Sources ({aiResult.sources.length})
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {aiResult.sources.map((src, idx) => (
                                <a
                                  key={idx}
                                  href={src.uri}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-2.5 py-1 bg-black/60 hover:bg-black border border-emerald-500/30 hover:border-emerald-500 rounded-lg text-[10px] text-emerald-300 font-mono flex items-center gap-1 transition-all"
                                >
                                  <span className="truncate max-w-[200px]">{src.title}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0 text-emerald-400" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. LOCAL PLATFORM DATABASE MATCHES */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2">
                    <span className="font-bold uppercase tracking-wider text-white">
                      Platform Arena Matches ({totalLocalMatches})
                    </span>
                    <span className="text-[10px]">Filter: {selectedCategory}</span>
                  </div>

                  {totalLocalMatches === 0 && !isAiLoading && !aiResult && (
                    <p className="text-xs text-gray-500 py-4 text-center">
                      No internal platform records match your query. Check the AI Grounded web results above!
                    </p>
                  )}

                  {/* Tournaments Match */}
                  {(selectedCategory === 'All' || selectedCategory === 'Tournaments') &&
                    matchingTournaments.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-[#D4FF33] uppercase tracking-wider flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Tournaments ({matchingTournaments.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingTournaments.map((t) => (
                            <div
                              key={t.id}
                              onClick={() => {
                                navigate(`/tournament/${t.id}`);
                                onClose();
                              }}
                              className="p-3 bg-[#131622] hover:bg-[#181c2d] border border-gray-800 hover:border-[#D4FF33]/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4FF33]/20 text-[#D4FF33] uppercase font-bold">
                                  {t.status}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1">{t.title}</h5>
                                <p className="text-[10px] text-gray-400">₹{t.prize_pool.toLocaleString()} • {t.map}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Player & Squad Matches */}
                  {(selectedCategory === 'All' || selectedCategory === 'Player Profiles') &&
                    matchingTeams.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                          <Users className="w-3 h-3" /> Squads & Players ({matchingTeams.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingTeams.map((team) => (
                            <div
                              key={team.id}
                              onClick={() => {
                                navigate(`/leaderboard`);
                                onClose();
                              }}
                              className="p-3 bg-[#131622] hover:bg-[#181c2d] border border-gray-800 hover:border-sky-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={team.logo_url}
                                  alt={team.name}
                                  className="w-8 h-8 rounded-lg object-cover border border-sky-500/40"
                                />
                                <div>
                                  <h5 className="text-xs font-bold text-white flex items-center gap-1">
                                    [{team.tag}] {team.name}
                                  </h5>
                                  <p className="text-[10px] text-gray-400">
                                    Members: {team.members ? team.members.length : 0}
                                  </p>
                                </div>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Match Rooms */}
                  {(selectedCategory === 'All' || selectedCategory === 'Active Match Rooms') &&
                    matchingMatches.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <Key className="w-3 h-3" /> Custom Rooms ({matchingMatches.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingMatches.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                navigate('/dashboard');
                                onClose();
                              }}
                              className="p-3 bg-[#131622] hover:bg-[#181c2d] border border-amber-500/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase">
                                  {m.map} • {m.status}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1">
                                  ID: {m.room_id || 'PENDING'}
                                </h5>
                                <p className="text-[10px] text-gray-400">{m.match_title}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-amber-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* News & Media */}
                  {(selectedCategory === 'All' || selectedCategory === 'News & Media') &&
                    matchingNews.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                          <Newspaper className="w-3 h-3" /> News & Media ({matchingNews.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingNews.map((news) => (
                            <div
                              key={news.id}
                              onClick={() => {
                                navigate('/news');
                                onClose();
                              }}
                              className="p-3 bg-[#131622] hover:bg-[#181c2d] border border-gray-800 hover:border-purple-500/50 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                                  {news.category}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{news.title}</h5>
                                <p className="text-[10px] text-gray-400">{news.created_at ? news.created_at.split('T')[0] : ''}</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* WhatsApp Groups */}
                  {(selectedCategory === 'All' || selectedCategory === 'WhatsApp Groups') &&
                    matchingWhatsApp.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" /> WhatsApp Groups ({matchingWhatsApp.length})
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingWhatsApp.map((wa) => (
                            <div
                              key={wa.id}
                              onClick={() => {
                                navigate('/whatsapp');
                                onClose();
                              }}
                              className="p-3 bg-[#131622] hover:bg-[#181c2d] border border-emerald-500/30 rounded-2xl cursor-pointer transition-all flex items-center justify-between"
                            >
                              <div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                                  {wa.category}
                                </span>
                                <h5 className="text-xs font-bold text-white mt-1 line-clamp-1">{wa.name}</h5>
                                <p className="text-[10px] text-gray-400">{wa.member_count} Members</p>
                              </div>
                              <ArrowRight className="w-4 h-4 text-emerald-400" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              </>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-3 bg-[#0a0c12] border-t border-[#222222] flex items-center justify-between text-[10px] text-gray-400 font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#D4FF33]" />
              <span>Grounded with Google GenAI API</span>
            </span>
            <span>Press <kbd className="bg-black px-1 py-0.5 rounded border border-gray-700 text-white">ESC</kbd> to exit</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
