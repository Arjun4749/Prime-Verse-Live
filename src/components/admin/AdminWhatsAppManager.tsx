import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Users,
  Send,
  Copy,
  AlertCircle,
  QrCode,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { WhatsAppGroup, WhatsAppCategory } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const AdminWhatsAppManager: React.FC = () => {
  const [groups, setGroups] = useState<WhatsAppGroup[]>(dbStore.getWhatsAppGroups());
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // New Group Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [name, setName] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [category, setCategory] = useState<WhatsAppCategory>('Scrims');
  const [description, setDescription] = useState('');
  const [memberCount, setMemberCount] = useState(1);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editInviteUrl, setEditInviteUrl] = useState('');
  const [editCategory, setEditCategory] = useState<WhatsAppCategory>('Scrims');
  const [editDescription, setEditDescription] = useState('');

  // Room ID Broadcast Generator
  const [broadcastRoomId, setBroadcastRoomId] = useState('8492019');
  const [broadcastPass, setBroadcastPass] = useState('9988');
  const [broadcastMap, setBroadcastMap] = useState('Erangel (Match #1)');
  const [broadcastTime, setBroadcastTime] = useState('08:00 PM IST');
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !inviteUrl) return;

    dbStore.addWhatsAppGroup({
      name,
      invite_url: inviteUrl,
      category,
      description: description || 'Official BGMI Arena WhatsApp Group.',
      member_count: Number(memberCount) || 1,
      is_official: true,
    });

    setGroups(dbStore.getWhatsAppGroups());
    setIsAddingNew(false);
    setName('');
    setInviteUrl('');
    setDescription('');
    setSuccessMsg('Successfully created new official WhatsApp Group!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleStartEdit = (g: WhatsAppGroup) => {
    setEditingId(g.id);
    setEditName(g.name);
    setEditInviteUrl(g.invite_url);
    setEditCategory(g.category);
    setEditDescription(g.description);
  };

  const handleSaveEdit = (groupId: string) => {
    dbStore.updateWhatsAppGroup(groupId, {
      name: editName,
      invite_url: editInviteUrl,
      category: editCategory,
      description: editDescription,
    });
    setGroups(dbStore.getWhatsAppGroups());
    setEditingId(null);
    setSuccessMsg('WhatsApp Group details updated successfully!');
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (window.confirm('Are you sure you want to delete this WhatsApp group?')) {
      dbStore.deleteWhatsAppGroup(groupId);
      setGroups(dbStore.getWhatsAppGroups());
      setSuccessMsg('WhatsApp Group deleted.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  const formattedBroadcastMsg = `🚨 *BGMI ARENA CUSTOM ROOM ID RELEASED* 🚨\n\n🗺️ *Map:* ${broadcastMap}\n⏰ *Time:* ${broadcastTime}\n\n🔑 *ROOM ID:* \`${broadcastRoomId}\`\n🔐 *PASSWORD:* \`${broadcastPass}\`\n\n📌 *Slot Rules:* Enter within 10 mins. No teaming or hack abuse.\n👉 *Join Live Dashboard:* ${window.location.origin}/dashboard`;

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(formattedBroadcastMsg);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2000);
  };

  const handleShareBroadcastWhatsApp = () => {
    const encoded = encodeURIComponent(formattedBroadcastMsg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-6 font-mono animate-fade-in">
      {/* Admin WhatsApp Banner */}
      <Card glow="green" className="p-6 bg-[#0b140e] border-emerald-500/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center p-2.5">
              <MessageSquare className="w-6 h-6 fill-emerald-400/20" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white italic uppercase font-mono">
                WhatsApp Official Groups Manager
              </h2>
              <p className="text-xs text-emerald-200">
                Manage tournament WhatsApp channels, Room ID broadcast groups & instant invite links.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingNew(!isAddingNew)}
            className="py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAddingNew ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{isAddingNew ? 'Cancel Form' : 'Add WhatsApp Group'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Add New Group Form */}
        {isAddingNew && (
          <form onSubmit={handleAddGroup} className="p-4 bg-black/60 rounded-2xl border border-emerald-500/30 space-y-3">
            <h4 className="text-sm font-extrabold text-emerald-400 uppercase">
              Create New Official WhatsApp Group
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🔥 Official Scrims #2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
                  WhatsApp Invite Link
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://chat.whatsapp.com/..."
                  value={inviteUrl}
                  onChange={(e) => setInviteUrl(e.target.value)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
                  Group Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WhatsAppCategory)}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                >
                  <option value="Scrims">Scrims & Daily Rooms</option>
                  <option value="RoomID">Room ID Broadcasts</option>
                  <option value="Captains">Captains & Leaders Only</option>
                  <option value="General">General Community</option>
                  <option value="Support">Admin Support</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
                  Initial Member Count
                </label>
                <input
                  type="number"
                  value={memberCount}
                  onChange={(e) => setMemberCount(Number(e.target.value))}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 text-[10px] uppercase font-bold mb-1">
                Description / Guidelines
              </label>
              <textarea
                rows={2}
                placeholder="Details on custom room times, rules, and announcements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-black border border-gray-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <Button variant="primary" size="sm" type="submit" className="w-full bg-emerald-500 text-black font-black">
              SAVE WHATSAPP GROUP LINK
            </Button>
          </form>
        )}
      </Card>

      {/* Broadcast Room ID Generator Box */}
      <Card className="p-5 bg-[#0e1611] border-emerald-500/30 space-y-4">
        <div className="flex items-center gap-2.5">
          <Send className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-black uppercase text-white">
            Instant Room ID & Password WhatsApp Broadcaster
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Room ID</label>
            <input
              type="text"
              value={broadcastRoomId}
              onChange={(e) => setBroadcastRoomId(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Password</label>
            <input
              type="text"
              value={broadcastPass}
              onChange={(e) => setBroadcastPass(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Map & Match</label>
            <input
              type="text"
              value={broadcastMap}
              onChange={(e) => setBroadcastMap(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase font-bold mb-1">Scheduled Time</label>
            <input
              type="text"
              value={broadcastTime}
              onChange={(e) => setBroadcastTime(e.target.value)}
              className="w-full bg-black border border-gray-800 rounded-lg px-2.5 py-1.5 text-white font-mono"
            />
          </div>
        </div>

        <div className="p-3 bg-black/60 rounded-xl border border-gray-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-400 uppercase font-bold">Formatted WhatsApp Text Preview</span>
            <button
              onClick={handleCopyBroadcast}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedBroadcast ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedBroadcast ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <pre className="text-[11px] text-emerald-300 whitespace-pre-wrap font-mono leading-relaxed bg-black/80 p-2.5 rounded-lg border border-emerald-500/20">
            {formattedBroadcastMsg}
          </pre>
        </div>

        <button
          onClick={handleShareBroadcastWhatsApp}
          className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4 fill-black" />
          <span>Broadcast Directly to WhatsApp Groups</span>
        </button>
      </Card>

      {/* List of Existing Groups */}
      <div className="space-y-3">
        <h3 className="text-sm font-extrabold uppercase text-gray-300">
          Configured WhatsApp Channels ({groups.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {groups.map((g) => (
            <Card key={g.id} className="p-4 bg-black/50 border-gray-800 space-y-3">
              {editingId === g.id ? (
                <div className="space-y-2.5 text-xs">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-black border border-emerald-500/50 rounded-lg p-2 text-white"
                  />
                  <input
                    type="text"
                    value={editInviteUrl}
                    onChange={(e) => setEditInviteUrl(e.target.value)}
                    className="w-full bg-black border border-emerald-500/50 rounded-lg p-2 text-emerald-300"
                  />
                  <textarea
                    rows={2}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-black border border-emerald-500/50 rounded-lg p-2 text-gray-300"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(g.id)}
                      className="py-1 px-3 bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="py-1 px-3 bg-gray-800 text-gray-300 font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                        {g.category}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{g.name}</h4>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(g)}
                        className="p-1.5 rounded-lg bg-gray-900 text-gray-300 hover:text-white border border-gray-800 cursor-pointer"
                        title="Edit Group"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteGroup(g.id)}
                        className="p-1.5 rounded-lg bg-red-950/50 text-red-400 hover:text-red-300 border border-red-500/30 cursor-pointer"
                        title="Delete Group"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">{g.description}</p>

                  <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-500">
                    <a
                      href={g.invite_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 font-bold truncate max-w-[200px] hover:underline flex items-center gap-1"
                    >
                      <span>{g.invite_url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <span>{g.member_count} Members</span>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
