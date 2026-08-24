import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  Users,
  ShieldCheck,
  Zap,
  ExternalLink,
  Share2,
  Copy,
  Check,
  QrCode,
  Bell,
  Sparkles,
  Search,
  Plus,
  Send,
  HelpCircle,
  X,
  PhoneCall,
  Crown,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { WhatsAppGroup, WhatsAppCategory } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface WhatsAppCommunityHubProps {
  className?: string;
  tournamentId?: string;
}

export const WhatsAppCommunityHub: React.FC<WhatsAppCommunityHubProps> = ({
  className = '',
  tournamentId,
}) => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>(dbStore.getWhatsAppGroups());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeQrGroup, setActiveQrGroup] = useState<WhatsAppGroup | null>(null);
  
  // Custom Share Generator state
  const [shareText, setShareText] = useState(
    '🔥 Join BGMI Esports Arena for Daily Cash Scrims, Erangel Tournaments, and Instant Custom Room ID Releases! Register your Squad now:'
  );
  const [shareUrl, setShareUrl] = useState(window.location.origin);
  const [squadInviteTag, setSquadInviteTag] = useState('SOUL');

  const categories = ['All', 'Scrims', 'RoomID', 'Captains', 'General', 'Support'];

  const filteredGroups = groups.filter((group) => {
    const matchesCategory =
      selectedCategory === 'All' || group.category === selectedCategory;
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTournament = !tournamentId || group.tournament_id === tournamentId;
    return matchesCategory && matchesSearch && matchesTournament;
  });

  const handleCopyLink = (group: WhatsAppGroup) => {
    navigator.clipboard.writeText(group.invite_url);
    setCopiedId(group.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareToWhatsApp = (textToShare: string) => {
    const encoded = encodeURIComponent(textToShare);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-[#0d1c15] to-[#102a1c] border border-emerald-500/40 p-6 sm:p-8 space-y-4 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center p-3 shadow-lg shadow-emerald-500/20 shrink-0">
              <MessageSquare className="w-8 h-8 fill-emerald-400/20 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Official WhatsApp Community
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic text-white uppercase font-mono tracking-tight mt-1">
                WhatsApp Group Integration
              </h2>
              <p className="text-xs text-emerald-200 font-mono mt-0.5">
                Instant Room ID & Password releases, Scrim slots, Captain discussions & 24/7 Admin Support.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <a
              href="https://wa.me/919876543210?text=Hello%20BGMI%20Arena%20Admin"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 fill-black" />
              <span>Contact Admin WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Quick Highlights bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-emerald-500/20 font-mono text-xs">
          <div className="p-3 bg-black/40 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-gray-400 block uppercase">Official Groups</span>
            <span className="text-sm font-bold text-emerald-400">{groups.length} Verified Channels</span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-gray-400 block uppercase">Active Players</span>
            <span className="text-sm font-bold text-white">3,892 Members</span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-gray-400 block uppercase">Room ID Speed</span>
            <span className="text-sm font-bold text-amber-400">15-Min Advance Alert</span>
          </div>
          <div className="p-3 bg-black/40 rounded-2xl border border-emerald-500/20">
            <span className="text-[10px] text-gray-400 block uppercase">Support SLA</span>
            <span className="text-sm font-bold text-emerald-300">&lt; 2 Min Response</span>
          </div>
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-black'
                  : 'bg-black/60 text-gray-400 border border-gray-800 hover:text-white hover:border-emerald-500/40'
              }`}
            >
              {cat === 'All' ? 'All Channels' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search WhatsApp groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-gray-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
          />
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <Card
            key={group.id}
            glow="green"
            className="p-5 bg-[#0d1410] border-emerald-500/30 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 flex items-center justify-center p-2 shrink-0">
                    <MessageSquare className="w-5 h-5 fill-emerald-400/20" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                      {group.category}
                    </span>
                    {group.is_official && (
                      <span className="ml-1 text-[10px] font-mono text-amber-400 font-bold">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setActiveQrGroup(group)}
                  className="p-1.5 rounded-lg bg-black/50 border border-emerald-500/20 hover:border-emerald-500/50 text-emerald-400 hover:text-white transition-all cursor-pointer"
                  title="View Group QR Code"
                >
                  <QrCode className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-white font-mono leading-snug">
                  {group.name}
                </h3>
                <p className="text-xs text-gray-300 font-mono mt-1 leading-relaxed">
                  {group.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-3 pt-3 border-t border-emerald-500/20">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-gray-400 text-[11px] flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-white font-bold">{group.member_count}</span> / {group.max_members || 1024} Players
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded">
                  🟢 Slots Available
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <button
                  onClick={() => handleCopyLink(group)}
                  className="py-2 px-3 bg-black/60 hover:bg-black border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedId === group.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <a
                  href={group.invite_url}
                  target="_blank"
                  rel="noreferrer"
                  className="py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Join Group</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* WhatsApp Share Generator Card */}
      <Card className="bg-[#0b130e] border-emerald-500/40 p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center p-2">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white italic uppercase font-mono">
              Share Squad Invite or Room Alerts to WhatsApp
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Instantly share formatted BGMI tournament updates directly with your squad members on WhatsApp.
            </p>
          </div>
        </div>

        <div className="space-y-3 font-mono">
          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
              Custom WhatsApp Message Text
            </label>
            <textarea
              rows={3}
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-full bg-black/70 border border-gray-800 rounded-xl p-3 text-xs text-emerald-300 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-gray-400">
              Includes direct portal link: <code className="text-emerald-400 font-bold">{shareUrl}</code>
            </span>

            <button
              onClick={() => handleShareToWhatsApp(`${shareText}\n\n👉 Join Arena: ${shareUrl}`)}
              className="w-full sm:w-auto py-2.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-black" />
              <span>Share Message via WhatsApp</span>
            </button>
          </div>
        </div>
      </Card>

      {/* QR Code Overlay Modal */}
      <AnimatePresence>
        {activeQrGroup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-[#0b140f] border-2 border-emerald-500/50 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 relative shadow-[0_0_60px_rgba(16,185,129,0.3)] font-mono"
            >
              <button
                onClick={() => setActiveQrGroup(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full bg-black/40 border border-gray-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center p-3 border border-emerald-500/40">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white uppercase italic">
                  {activeQrGroup.name}
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Scan QR code with your smartphone camera to join WhatsApp Group
                </p>
              </div>

              {/* Simulated QR Code Canvas */}
              <div className="p-4 bg-white rounded-2xl w-48 h-48 mx-auto flex items-center justify-center border-4 border-emerald-500 shadow-inner">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    activeQrGroup.invite_url
                  )}`}
                  alt="WhatsApp QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <a
                href={activeQrGroup.invite_url}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/30"
              >
                <span>Direct Open WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
