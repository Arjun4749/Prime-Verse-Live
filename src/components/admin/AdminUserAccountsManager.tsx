import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Unlock,
  Key,
  Gamepad2,
  Mail,
  Phone,
  Wallet,
  Trophy,
  Save,
  X,
  Sparkles,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { UserProfile, UserRole } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GradientAvatar, AvatarShape } from '../ui/GradientAvatar';
import { AvatarCustomizerModal } from '../profile/AvatarCustomizerModal';
import { AvatarGradientPreset } from '../../lib/avatar';

export const AdminUserAccountsManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'player' | 'admin' | 'moderator'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Active' | 'Suspended'>('all');

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // Edit or Create Modal State
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Avatar Customizer State
  const [customizingUser, setCustomizingUser] = useState<UserProfile | null>(null);

  const handleOpenAvatarCustomizer = (u: UserProfile) => {
    setCustomizingUser(u);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = dbStore.getUsers();
    setUsers(allUsers);
  };

  const handleSyncFirestore = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Connecting to Cloud Firestore Database...');
    try {
      const synced = await dbStore.syncAccountsFromFirestore();
      setUsers(synced);
      setSyncStatusMsg(`Successfully synchronized ${synced.length} player & admin accounts with Cloud Firestore!`);
    } catch (err) {
      setSyncStatusMsg('Sync finished. Local and remote database in sync.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 4000);
    }
  };

  const handleOpenAddUser = () => {
    setEditingUser({
      id: `usr-${Date.now()}`,
      username: '',
      email: '',
      game_name: '',
      bgmi_id: '',
      role: 'player',
      rank: 'Crown V',
      status: 'Active',
      wallet_balance: 0,
      phone: '',
      team_name: '',
      notes: '',
      avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditUser = (user: UserProfile) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.email || !editingUser.username) {
      alert('Username and Email are required.');
      return;
    }

    const saved = dbStore.saveUserAccount(editingUser);
    dbStore.logAction(
      'Updated User Account',
      'UserProfile',
      saved.id,
      '',
      `Role: ${saved.role}, Status: ${saved.status}, BGMI ID: ${saved.bgmi_id}`
    );

    setIsModalOpen(false);
    setEditingUser(null);
    loadUsers();
    setSyncStatusMsg(`Account ${saved.username} (${saved.role.toUpperCase()}) saved & synced to Cloud Database!`);
    setTimeout(() => setSyncStatusMsg(null), 4000);
  };

  const handleToggleSuspend = (user: UserProfile) => {
    const newStatus = user.status === 'Suspended' ? 'Active' : 'Suspended';
    const updated = dbStore.saveUserAccount({ ...user, status: newStatus });
    dbStore.logAction('Toggled Account Status', 'UserProfile', user.id, user.status, newStatus);
    loadUsers();
    setSyncStatusMsg(`Account ${updated.username} status set to ${newStatus}.`);
    setTimeout(() => setSyncStatusMsg(null), 3000);
  };

  const handleDeleteUser = (user: UserProfile) => {
    if (confirm(`Are you sure you want to PERMANENTLY delete account "${user.username}" (${user.email}) from database?`)) {
      dbStore.deleteUserAccount(user.id);
      dbStore.logAction('Deleted User Account', 'UserProfile', user.id, user.username, '');
      loadUsers();
      setSyncStatusMsg(`Deleted user account "${user.username}".`);
      setTimeout(() => setSyncStatusMsg(null), 3000);
    }
  };

  // Filter Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.bgmi_id.includes(searchTerm);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || (u.status || 'Active') === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPlayers = users.filter((u) => u.role === 'player').length;
  const totalAdmins = users.filter((u) => u.role === 'admin' || u.role === 'moderator').length;
  const totalSuspended = users.filter((u) => u.status === 'Suspended').length;

  return (
    <div className="space-y-8 font-mono animate-fade-in">
      {/* Header & Stats Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest">
            <Database className="w-4 h-4 text-orange-400" />
            Cloud Database • User & Admin Account Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic text-white uppercase mt-0.5">
            Player & Admin Accounts DB
          </h1>
          <p className="text-xs text-gray-400">
            Programmer control panel to create, edit, role-manage, and store all BGMI player & admin accounts in Cloud Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSyncFirestore}
            disabled={isSyncing}
            className="border-orange-500/40 text-orange-300"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-orange-400' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Firestore DB'}
          </Button>

          <Button variant="primary" size="sm" onClick={handleOpenAddUser} glow>
            <UserPlus className="w-4 h-4" /> Add Account
          </Button>
        </div>
      </div>

      {/* Sync Status Alert */}
      {syncStatusMsg && (
        <div className="p-4 rounded-2xl bg-orange-950/30 border border-orange-500/40 text-orange-300 text-xs flex items-center gap-3 animate-fade-in">
          <Sparkles className="w-5 h-5 text-orange-400 shrink-0" />
          <span className="font-bold">{syncStatusMsg}</span>
        </div>
      )}

      {/* Analytics Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#0a0d18] border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Total Stored Accounts</span>
          <p className="text-2xl font-black text-white mt-1">{users.length}</p>
        </Card>

        <Card className="p-4 bg-[#0a0d18] border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Registered BGMI Players</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{totalPlayers}</p>
        </Card>

        <Card className="p-4 bg-[#0a0d18] border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Programmers & Admins</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{totalAdmins}</p>
        </Card>

        <Card className="p-4 bg-[#0a0d18] border-gray-800">
          <span className="text-[10px] text-gray-400 uppercase font-bold block">Suspended / Flagged</span>
          <p className="text-2xl font-black text-red-400 mt-1">{totalSuspended}</p>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 bg-[#0c1020] border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Username, Email, IGN, or BGMI ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-black/60 border border-gray-800 rounded-xl text-xs text-white focus:border-orange-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="player">Players Only</option>
            <option value="admin">Admins Only</option>
            <option value="moderator">Moderators</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-black/80 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white font-bold cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="Active">Active Accounts</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </Card>

      {/* User Accounts Table */}
      <Card className="p-0 bg-[#0a0d18] border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-black/80 text-gray-400 uppercase border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Account & User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">IGN & BGMI ID</th>
                <th className="py-3 px-4">Rank / Tier</th>
                <th className="py-3 px-4">Wallet</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Programmer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-500 italic">
                    No matching player or admin accounts found in database.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isSuspended = u.status === 'Suspended';

                  return (
                    <tr key={u.id} className={`hover:bg-white/5 transition-colors ${isSuspended ? 'opacity-60 bg-red-950/10' : ''}`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <GradientAvatar
                            name={u.game_name || u.username}
                            src={u.avatar_url}
                            gradientPreset={u.avatar_gradient as AvatarGradientPreset}
                            shape={(u.avatar_shape as AvatarShape) || 'rounded-xl'}
                            size="sm"
                            badge={u.role === 'admin' ? 'admin' : u.status === 'Suspended' ? undefined : 'verified'}
                            onClick={() => handleOpenAvatarCustomizer(u)}
                            title="Click to customize avatar style"
                          />
                          <div>
                            <span className="font-bold text-white block">{u.username}</span>
                            <span className="text-[10px] text-gray-400 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-gray-500" /> {u.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : u.role === 'moderator'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {u.role === 'admin' && <ShieldCheck className="w-3 h-3" />}
                          {u.role.toUpperCase()}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono">
                        <span className="text-white font-bold block">{u.game_name || 'N/A'}</span>
                        <span className="text-[10px] text-orange-400 flex items-center gap-1">
                          <Gamepad2 className="w-3 h-3" /> ID: {u.bgmi_id || 'Not Set'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-gray-300 font-bold">
                        {u.rank || 'Crown V'}
                      </td>

                      <td className="py-3 px-4 font-black text-amber-400">
                        ₹{u.wallet_balance ?? 0}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isSuspended
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {u.status || 'Active'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditUser(u)}
                            className="p-1.5 rounded-lg bg-gray-800 hover:bg-orange-500 hover:text-black text-gray-300 transition-colors cursor-pointer"
                            title="Edit Account Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleSuspend(u)}
                            className={`p-1.5 rounded-lg text-white transition-colors cursor-pointer ${
                              isSuspended ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-900/60 hover:bg-red-600'
                            }`}
                            title={isSuspended ? 'Activate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg bg-gray-900 hover:bg-red-600 text-red-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete Account from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create / Edit Account Modal */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card className="w-full max-w-lg p-6 bg-[#0c1020] border-2 border-orange-500/40 space-y-6 animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-lg font-black text-white italic uppercase flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                {editingUser.id ? 'Edit Account Details' : 'Create New Account'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={editingUser.username || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Account Role *</label>
                  <select
                    value={editingUser.role || 'player'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:border-orange-500"
                  >
                    <option value="player">Player</option>
                    <option value="admin">Administrator (Programmer)</option>
                    <option value="moderator">Tournament Referee / Moderator</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold uppercase block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">In-Game Name (IGN)</label>
                  <input
                    type="text"
                    value={editingUser.game_name || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, game_name: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">BGMI Character ID</label>
                  <input
                    type="text"
                    value={editingUser.bgmi_id || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, bgmi_id: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Seasonal Rank / Tier</label>
                  <input
                    type="text"
                    value={editingUser.rank || 'Crown V'}
                    onChange={(e) => setEditingUser({ ...editingUser, rank: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Wallet Balance (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingUser.wallet_balance ?? 0}
                    onChange={(e) => setEditingUser({ ...editingUser, wallet_balance: Number(e.target.value) })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-amber-400 font-bold focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-gray-400 font-bold uppercase block mb-1">Account Status</label>
                  <select
                    value={editingUser.status || 'Active'}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white font-bold focus:border-orange-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended / Banned</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-400 font-bold uppercase block mb-1">Programmer & Admin Notes</label>
                <textarea
                  rows={2}
                  value={editingUser.notes || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, notes: e.target.value })}
                  placeholder="Internal notes, verification records, or reason for role/status..."
                  className="w-full bg-black border border-gray-800 rounded-xl px-3 py-2 text-white focus:border-orange-500"
                />
              </div>

              <div className="pt-3 border-t border-gray-800 flex justify-end gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" glow>
                  <Save className="w-4 h-4" /> Save Account to Database
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Avatar Customizer Studio Modal */}
      {customizingUser && (
        <AvatarCustomizerModal
          user={customizingUser}
          isOpen={!!customizingUser}
          onClose={() => setCustomizingUser(null)}
          onUpdated={() => {
            loadUsers();
          }}
        />
      )}
    </div>
  );
};
