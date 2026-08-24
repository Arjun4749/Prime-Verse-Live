import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Trophy,
  Swords,
  Key,
  ShieldAlert,
  X,
  ExternalLink,
  Check,
  Megaphone,
  Sparkles,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { NotificationItem } from '../../types';
import { Badge } from '../ui/Badge';

export const NotificationOverlay: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'registration' | 'room' | 'system'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [bannerAlert, setBannerAlert] = useState<NotificationItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Load notifications from dbStore and check for active alerts
  const refreshNotifications = () => {
    const list = dbStore.getNotifications();
    setNotifications(list);

    // Pick top unread registration or room notification for top banner if not dismissed
    const unreadPriority = list.find((n) => !n.read && (n.type === 'Registration' || n.type === 'RoomDetails'));
    if (unreadPriority && !bannerAlert) {
      setBannerAlert(unreadPriority);
    }
  };

  useEffect(() => {
    refreshNotifications();
    // Periodically sync in case admin updates registrations or match rooms
    const interval = setInterval(refreshNotifications, 8000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = dbStore.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllRead = () => {
    const updated = dbStore.markAllNotificationsAsRead();
    setNotifications(updated);
  };

  const handleNotificationClick = (item: NotificationItem) => {
    handleMarkAsRead(item.id);
    setIsOpen(false);
    if (item.link_url) {
      navigate(item.link_url);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === 'registration') return item.type === 'Registration';
    if (activeTab === 'room') return item.type === 'RoomDetails';
    if (activeTab === 'system') return item.type === 'System' || item.type === 'Winner';
    return true;
  });

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'Registration':
        return <Trophy className="w-4 h-4 text-[#D4FF33]" />;
      case 'RoomDetails':
        return <Key className="w-4 h-4 text-orange-400" />;
      case 'Match':
        return <Swords className="w-4 h-4 text-blue-400" />;
      case 'Winner':
        return <Sparkles className="w-4 h-4 text-amber-300" />;
      default:
        return <Megaphone className="w-4 h-4 text-purple-400" />;
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const diffSecs = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
      if (diffSecs < 60) return 'Just now';
      if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
      if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
      return `${Math.floor(diffSecs / 86400)}d ago`;
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Header Notification Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-center ${
          isOpen
            ? 'bg-[#1D1E2C] border-orange-500 text-white shadow-lg shadow-orange-500/20'
            : 'bg-[#111111] border-[#222222] text-zinc-300 hover:text-white hover:border-zinc-700'
        }`}
        title="Notifications & Match Alerts"
        aria-label="Toggle Arena Notifications"
      >
        <Bell className="w-4 h-4 text-orange-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-[10px] rounded-full flex items-center justify-center border-2 border-[#0A0A0A] shadow-md animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Top Header Floating Banner Overlay (For High Priority Alert e.g., Team Registered or New Registration Open) */}
      {bannerAlert && !isOpen && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-lg w-[92%] bg-[#11131F] border border-orange-500/50 rounded-2xl p-3.5 shadow-2xl shadow-orange-500/20 flex items-center justify-between gap-3 animate-slide-down backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest font-mono">
                  {bannerAlert.type === 'Registration' ? 'MATCH REGISTRATION ALERT' : 'ARENA NOTICE'}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              </div>
              <p className="text-xs font-bold text-white line-clamp-1">{bannerAlert.title}</p>
              <p className="text-[11px] text-gray-300 line-clamp-1">{bannerAlert.message}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                handleNotificationClick(bannerAlert);
                setBannerAlert(null);
              }}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all flex items-center gap-1 shadow-md cursor-pointer"
            >
              View <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setBannerAlert(null)}
              className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Dismiss Alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dropdown Notification Overlay Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#12131C] border border-[#2A2D3E] rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-2xl">
          {/* Header Bar */}
          <div className="p-3.5 bg-[#181A26] border-b border-[#252839] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-wider font-mono">
                  Arena Match Alerts
                </h3>
                <p className="text-[10px] text-gray-400">
                  {unreadCount > 0 ? `${unreadCount} unread match updates` : 'All team notifications read'}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[10px] text-orange-400 hover:text-orange-300 font-bold uppercase tracking-wider flex items-center gap-1 bg-orange-500/10 hover:bg-orange-500/20 px-2.5 py-1 rounded-lg border border-orange-500/20 transition-all cursor-pointer"
              >
                <Check className="w-3 h-3" /> Mark All Read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center border-b border-[#222535] bg-[#101119] px-2 py-1.5 gap-1 text-[10px] font-bold uppercase tracking-wider overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'all'
                  ? 'bg-orange-500 text-white font-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'registration'
                  ? 'bg-orange-500 text-white font-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Registrations
            </button>
            <button
              onClick={() => setActiveTab('room')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                activeTab === 'room'
                  ? 'bg-orange-500 text-white font-black shadow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Lobby Keys
            </button>
          </div>

          {/* Notifications List Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-[#1D2030] scrollbar-thin scrollbar-thumb-orange-500/20">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center space-y-2 px-4">
                <CheckCircle2 className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs font-bold text-gray-400">No match notifications in this section.</p>
                <p className="text-[10px] text-gray-500">You will be alerted when new registrations open or squad matches begin.</p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-all cursor-pointer hover:bg-[#1A1D2D] relative group flex items-start gap-3 ${
                    !item.read ? 'bg-orange-950/15 border-l-2 border-orange-500' : 'bg-[#12131C]'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-black/60 border border-white/10 shrink-0 mt-0.5">
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className={`text-xs font-extrabold ${!item.read ? 'text-white' : 'text-gray-300'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[9px] text-gray-500 font-mono shrink-0">
                        {formatTime(item.created_at)}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{item.message}</p>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      {item.link_url && (
                        <span className="text-orange-400 font-bold group-hover:underline flex items-center gap-0.5">
                          Open Details <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}

                      {!item.read && (
                        <button
                          onClick={(e) => handleMarkAsRead(item.id, e)}
                          className="text-gray-500 hover:text-orange-400 text-[10px] ml-auto transition-colors"
                          title="Mark as Read"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-2.5 bg-[#0F1018] border-t border-[#222535] text-center flex items-center justify-between px-4">
            <span className="text-[10px] text-gray-500 font-mono">PRIME ARENA NOTIFICATIONS</span>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/dashboard');
              }}
              className="text-[10px] text-orange-400 hover:underline font-bold uppercase tracking-wider"
            >
              View Player Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
