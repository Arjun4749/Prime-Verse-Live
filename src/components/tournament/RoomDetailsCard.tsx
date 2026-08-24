import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Key, ShieldAlert } from 'lucide-react';
import { Match } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface RoomDetailsCardProps {
  match: Match;
  isRegisteredUserOrAdmin: boolean;
}

export const RoomDetailsCard: React.FC<RoomDetailsCardProps> = ({ match, isRegisteredUserOrAdmin }) => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const isReleased =
    match.status === 'Room Released' ||
    match.status === 'Live' ||
    (match.room_release_at && new Date(match.room_release_at).getTime() <= Date.now());

  const handleCopy = (text: string, type: 'id' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  return (
    <Card glow={isReleased ? 'orange' : 'none'} className="border border-gray-800">
      <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
        <div>
          <span className="text-[10px] font-mono text-orange-400 uppercase tracking-widest block">
            Match #{match.match_number} &bull; {match.map}
          </span>
          <h4 className="text-base font-bold text-white">{match.match_title}</h4>
        </div>
        <Badge variant={isReleased ? 'green' : 'gray'}>
          {isReleased ? 'Room Active' : 'Locked'}
        </Badge>
      </div>

      {!isReleased ? (
        <div className="p-4 bg-black/60 rounded-xl border border-dashed border-gray-800 flex flex-col items-center justify-center text-center gap-2 py-6">
          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-orange-400">
            <Lock className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
            ROOM DETAILS WILL BE AVAILABLE BEFORE THE MATCH
          </span>
          <span className="text-[11px] text-gray-400">
            Release Scheduled: {new Date(match.room_release_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ) : !isRegisteredUserOrAdmin ? (
        <div className="p-4 bg-black/60 rounded-xl border border-gray-800 text-center space-y-2">
          <ShieldAlert className="w-6 h-6 text-amber-400 mx-auto" />
          <p className="text-xs text-gray-300 font-semibold">
            Room credentials are restricted to registered participants and captains.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Room ID Box */}
          <div className="flex items-center justify-between p-3 bg-black/80 rounded-xl border border-orange-500/30">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Room ID</span>
              <span className="font-mono text-lg font-black tracking-widest text-white">{match.room_id || 'N/A'}</span>
            </div>
            {isRegisteredUserOrAdmin && isReleased && match.room_id && (
              <button
                onClick={() => handleCopy(match.room_id!, 'id')}
                className="p-2 bg-orange-500/20 hover:bg-orange-500/40 text-orange-400 border border-orange-500/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedId ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>

          {/* Password Box */}
          <div className="flex items-center justify-between p-3 bg-black/80 rounded-xl border border-blue-500/30">
            <div>
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Password</span>
              <span className="font-mono text-lg font-black tracking-widest text-blue-400">{match.room_password || 'N/A'}</span>
            </div>
            {isRegisteredUserOrAdmin && isReleased && match.room_password && (
              <button
                onClick={() => handleCopy(match.room_password!, 'pass')}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 border border-blue-500/40 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                {copiedPass ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copiedPass ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
