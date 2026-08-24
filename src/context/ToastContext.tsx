import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbStore } from '../services/dbStore';

export type ToastType = 'match_starting' | 'room_id' | 'info' | 'success' | 'warning';

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  tournamentName?: string;
  map?: string;
  roomId?: string;
  roomPassword?: string;
  linkUrl?: string;
  createdAt: number;
  duration?: number; // ms, default 8000
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
  triggerSimulatedToast: (type: 'match_starting' | 'room_id') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [shownNoticeIds, setShownNoticeIds] = useState<Set<string>>(new Set());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toastData: Omit<ToastItem, 'id' | 'createdAt'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast: ToastItem = {
      ...toastData,
      id,
      createdAt: Date.now(),
      duration: toastData.duration || 8000,
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 4)]); // max 5 visible toasts

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const triggerSimulatedToast = useCallback((type: 'match_starting' | 'room_id') => {
    if (type === 'match_starting') {
      addToast({
        type: 'match_starting',
        title: '🔥 Match Starting Soon!',
        message: 'BGIS 2026 Grand Finals Match #3 (Erangel) is about to launch in 5 minutes! Get ready in your slot.',
        tournamentName: 'BGMI Arena Pro Series: Season 1',
        map: 'Erangel',
        linkUrl: '/dashboard',
        duration: 9000,
      });
    } else {
      addToast({
        type: 'room_id',
        title: '🔑 Custom Room ID Posted!',
        message: 'Admin has posted the Room ID & Password for Match #2 (Miramar). Join game client immediately.',
        tournamentName: 'Erangel Conquerors Cup',
        map: 'Miramar',
        roomId: 'BGMI-884920',
        roomPassword: '1234',
        linkUrl: '/dashboard',
        duration: 12000,
      });
    }
  }, [addToast]);

  // Check for newly posted room IDs or match notices periodically from dbStore
  useEffect(() => {
    const checkStoreUpdates = () => {
      const notifs = dbStore.getNotifications();
      const newNotifs = notifs.filter((n) => !n.read && !shownNoticeIds.has(n.id));

      if (newNotifs.length > 0) {
        newNotifs.forEach((n) => {
          shownNoticeIds.add(n.id);
          if (n.type === 'RoomDetails') {
            addToast({
              type: 'room_id',
              title: n.title,
              message: n.message,
              roomId: n.room_id,
              roomPassword: n.room_password,
              linkUrl: n.link_url || '/dashboard',
              duration: 10000,
            });
          } else if (n.type === 'Registration' || n.type === 'Match') {
            addToast({
              type: 'match_starting',
              title: n.title,
              message: n.message,
              linkUrl: n.link_url || '/dashboard',
              duration: 8000,
            });
          }
        });
        setShownNoticeIds(new Set(shownNoticeIds));
      }
    };

    // Initial check + set interval
    checkStoreUpdates();
    const interval = setInterval(checkStoreUpdates, 6000);
    return () => clearInterval(interval);
  }, [addToast, shownNoticeIds]);

  // Show a welcome toast on first mount to inform user about alerts
  useEffect(() => {
    const welcomeKey = 'bgmi_arena_toast_welcomed';
    if (!sessionStorage.getItem(welcomeKey)) {
      sessionStorage.setItem(welcomeKey, 'true');
      setTimeout(() => {
        addToast({
          type: 'room_id',
          title: '🔑 Room ID Alert System Active',
          message: 'Match start reminders and admin Room ID releases will pop up here in real-time.',
          roomId: '884920',
          roomPassword: '1234',
          linkUrl: '/dashboard',
          duration: 9000,
        });
      }, 1500);
    }
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, triggerSimulatedToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
