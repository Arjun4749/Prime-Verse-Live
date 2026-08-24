import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Youtube, Instagram, Twitter, MessageSquare, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 bg-[#0A0A0A] border-t border-[#222222] text-zinc-400 pt-16 pb-12 overflow-hidden">
      {/* Top Accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D4FF33]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] border border-[#222222] rounded-[32px] p-8 lg:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center font-bold text-[#D4FF33]">
                <Trophy className="w-5 h-5 text-[#D4FF33]" />
              </div>
              <span className="text-2xl font-bold tracking-tighter text-white font-mono flex items-center gap-0.5">
                BGMI<span className="text-[#D4FF33]">/</span>ARENA
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              India's premier independent community esports tournament platform. Host, compete, climb the bento leaderboard, and win verified prize rewards.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center hover:border-[#D4FF33] hover:text-[#D4FF33] transition-all text-zinc-400"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center hover:border-[#D4FF33] hover:text-[#D4FF33] transition-all text-zinc-400"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center hover:border-[#D4FF33] hover:text-[#D4FF33] transition-all text-zinc-400"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-2xl bg-[#1A1A1A] border border-[#222222] flex items-center justify-center hover:border-[#D4FF33] hover:text-[#D4FF33] transition-all text-zinc-400"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Competition */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4FF33] font-mono mb-4">Competitions</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/tournaments" className="hover:text-[#D4FF33] transition-colors">
                  All Tournaments
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-[#D4FF33] transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/winners" className="hover:text-[#D4FF33] transition-colors">
                  Hall of Winners
                </Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-[#D4FF33] transition-colors">
                  Match Results
                </Link>
              </li>
              <li>
                <Link to="/media" className="hover:text-[#D4FF33] transition-colors">
                  Media & Posters
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4FF33] font-mono mb-4">Information</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/rules" className="hover:text-[#D4FF33] transition-colors">
                  Tournament Rules
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#D4FF33] transition-colors">
                  FAQ & Help
                </Link>
              </li>
              <li>
                <Link to="/youtube" className="hover:text-[#D4FF33] transition-colors">
                  YouTube Streams
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-[#D4FF33] transition-colors">
                  Esports News
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#D4FF33] transition-colors">
                  About Platform
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Legal */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4FF33] font-mono mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/contact" className="hover:text-[#D4FF33] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-[#D4FF33] transition-colors">
                  Fair Play Policy
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-[#D4FF33] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-[#D4FF33] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-zinc-500">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-zinc-400">Disclaimer:</strong> BGMI.ARENA is an independent community esports platform. Battlegrounds Mobile India (BGMI) and Krafton are trademarks or registered trademarks of Krafton, Inc.
          </p>

          <p className="shrink-0 flex items-center gap-1 font-mono text-[10px] text-[#D4FF33]">
            &copy; {new Date().getFullYear()} BGMI.ARENA &bull; STUDIO/DASH v2.4
          </p>
        </div>
      </div>
    </footer>
  );
};
