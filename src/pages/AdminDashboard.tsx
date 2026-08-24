import React, { useState } from 'react';
import { Shield, Trophy, Key, FileSpreadsheet, Award, Users, AlertTriangle, History, Mail, Grid, MessageSquare, Database } from 'lucide-react';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminTournaments } from '../components/admin/AdminTournaments';
import { AdminMatches } from '../components/admin/AdminMatches';
import { AdminResultsEntry } from '../components/admin/AdminResultsEntry';
import { AdminWinners } from '../components/admin/AdminWinners';
import { AdminTeams } from '../components/admin/AdminTeams';
import { AdminDisputes } from '../components/admin/AdminDisputes';
import { AdminAuditLogs } from '../components/admin/AdminAuditLogs';
import { AdminWhatsAppManager } from '../components/admin/AdminWhatsAppManager';
import { AdminSlotMatrixManager } from '../components/admin/AdminSlotMatrixManager';
import { AdminUserAccountsManager } from '../components/admin/AdminUserAccountsManager';
import { WorkspaceHub } from '../components/workspace/WorkspaceHub';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'accounts', label: 'Accounts DB', icon: Database },
    { id: 'workspace', label: 'Google Workspace', icon: Mail },
    { id: 'whatsapp', label: 'WhatsApp Groups', icon: MessageSquare },
    { id: 'slots', label: '25-Slot Matrix', icon: Grid },
    { id: 'tournaments', label: 'Tournaments', icon: Trophy },
    { id: 'matches', label: 'Matches & Rooms', icon: Key },
    { id: 'results', label: 'Points & CSV', icon: FileSpreadsheet },
    { id: 'winners', label: 'Winners & Proofs', icon: Award },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
    { id: 'reports', label: 'Audit Logs', icon: History },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 gap-1 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-t-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-black/40 text-gray-400 hover:text-white hover:bg-black/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Render Active Section */}
      <div>
        {activeTab === 'overview' && <AdminOverview onNavigateTab={setActiveTab} />}
        {activeTab === 'accounts' && <AdminUserAccountsManager />}
        {activeTab === 'workspace' && <WorkspaceHub />}
        {activeTab === 'whatsapp' && <AdminWhatsAppManager />}
        {activeTab === 'slots' && <AdminSlotMatrixManager />}
        {activeTab === 'tournaments' && <AdminTournaments />}
        {activeTab === 'matches' && <AdminMatches />}
        {activeTab === 'results' && <AdminResultsEntry />}
        {activeTab === 'winners' && <AdminWinners />}
        {activeTab === 'teams' && <AdminTeams />}
        {activeTab === 'disputes' && <AdminDisputes />}
        {activeTab === 'reports' && <AdminAuditLogs />}
      </div>
    </div>
  );
};

