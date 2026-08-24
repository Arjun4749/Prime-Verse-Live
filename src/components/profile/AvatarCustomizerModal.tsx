import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Check,
  Palette,
  Image as ImageIcon,
  RotateCcw,
  Save,
  Trophy,
  User,
  Trash2,
  Sliders,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { GradientAvatar, AvatarShape } from '../ui/GradientAvatar';
import { AVATAR_GRADIENTS, AvatarGradientPreset } from '../../lib/avatar';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { dbStore } from '../../services/dbStore';

interface AvatarCustomizerModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: (updatedUser: UserProfile) => void;
}

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const [selectedGradient, setSelectedGradient] = useState<AvatarGradientPreset>(
    (user.avatar_gradient as AvatarGradientPreset) || 'cyber-orange'
  );
  const [selectedShape, setSelectedShape] = useState<AvatarShape>(
    (user.avatar_shape as AvatarShape) || 'rounded-xl'
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>(user.avatar_url || '');
  const [usePhoto, setUsePhoto] = useState<boolean>(!!user.avatar_url);
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPhoto = usePhoto && customPhotoUrl.trim() ? customPhotoUrl.trim() : '';

    const updated = dbStore.saveUserAccount({
      ...user,
      avatar_url: finalPhoto,
      avatar_gradient: selectedGradient,
      avatar_shape: selectedShape,
    });

    setSavedMessage('Avatar preferences updated and synced to database!');
    if (onUpdated) {
      onUpdated(updated);
    }

    setTimeout(() => {
      setSavedMessage(null);
      onClose();
    }, 1200);
  };

  const handleClearPhoto = () => {
    setCustomPhotoUrl('');
    setUsePhoto(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-mono">
      <Card className="w-full max-w-xl p-6 bg-[#0c1020] border-2 border-orange-500/40 space-y-6 shadow-2xl animate-scale-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-orange-400" />
            <h3 className="text-lg font-black text-white italic uppercase">
              Custom Avatar & Gradient Studio
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedMessage && (
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{savedMessage}</span>
          </div>
        )}

        {/* Live Preview Card */}
        <div className="p-4 rounded-2xl bg-[#070912] border border-gray-800 space-y-3">
          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">
            Live Leaderboard & Profile Preview
          </span>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-gray-800">
            <div className="flex items-center gap-3">
              <GradientAvatar
                name={user.game_name || user.username}
                src={usePhoto ? customPhotoUrl : undefined}
                gradientPreset={selectedGradient}
                shape={selectedShape}
                size="lg"
                showGlow
                badge={user.role === 'admin' ? 'admin' : user.rank?.includes('Ace') ? 'ace' : 'verified'}
              />
              <div>
                <span className="font-bold text-white text-sm block">
                  {user.game_name || user.username}
                </span>
                <span className="text-[10px] text-orange-400 font-semibold block">
                  ID: {user.bgmi_id || '5100000000'} • {user.rank || 'Crown V'}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                #1 Leaderboard
              </span>
            </div>
          </div>
        </div>

        {/* Customization Options */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Avatar Mode Selection */}
          <div className="space-y-2">
            <label className="text-gray-400 font-bold uppercase block">Avatar Source</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUsePhoto(false)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                  !usePhoto
                    ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                    : 'bg-black/60 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-orange-400" />
                <div>
                  <span className="block text-xs font-black">Unique Initials Gradient</span>
                  <span className="text-[10px] text-gray-400 block font-normal">
                    Esports stylized signature avatar
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUsePhoto(true)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 cursor-pointer transition-all ${
                  usePhoto
                    ? 'bg-orange-500/20 border-orange-500 text-white font-bold'
                    : 'bg-black/60 border-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="block text-xs font-black">Custom Photo URL</span>
                  <span className="text-[10px] text-gray-400 block font-normal">
                    Upload image or link custom logo
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Photo URL Input (if Custom Photo mode enabled) */}
          {usePhoto && (
            <div className="space-y-2 animate-fade-in">
              <label className="text-gray-400 font-bold uppercase block">Photo Image Link (URL)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  className="flex-1 bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                />
                {customPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleClearPhoto}
                    className="p-2 bg-red-900/40 hover:bg-red-600 text-red-300 hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="Clear Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Shape Selector */}
          <div className="space-y-2">
            <label className="text-gray-400 font-bold uppercase block">Avatar Corner Geometry</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'circle', label: 'Circle' },
                { id: 'rounded-2xl', label: 'Curved' },
                { id: 'rounded-xl', label: 'Rounded' },
                { id: 'square', label: 'Sharp' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedShape(s.id as AvatarShape)}
                  className={`p-2 text-center rounded-xl border text-[11px] font-bold cursor-pointer transition-all ${
                    selectedShape === s.id
                      ? 'bg-orange-500 text-black border-orange-400'
                      : 'bg-black/60 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gradient Palette Selection Grid */}
          <div className="space-y-2">
            <label className="text-gray-400 font-bold uppercase block">
              Signature Gradient Palettes
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {Object.entries(AVATAR_GRADIENTS).map(([key, config]) => {
                const isSelected = selectedGradient === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedGradient(key as AvatarGradientPreset)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white/10 border-orange-500 ring-1 ring-orange-500/50'
                        : 'bg-black/60 border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <GradientAvatar
                      name={user.game_name || user.username}
                      gradientPreset={key as AvatarGradientPreset}
                      shape={selectedShape}
                      size="xs"
                    />
                    <span className="text-[11px] font-bold text-gray-200 truncate">
                      {config.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-800 flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" glow>
              <Save className="w-4 h-4" /> Save Avatar Style
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
