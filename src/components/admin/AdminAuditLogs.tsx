import React from 'react';
import { ShieldCheck, History } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';

export const AdminAuditLogs: React.FC = () => {
  const logs = dbStore.getAuditLogs();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-white">System Security Audit Logs</h2>
        <p className="text-xs text-gray-400">Track all administrative modifications, score changes, room updates, and winner approvals.</p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-black/60 text-gray-400 uppercase border-b border-gray-800">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Type</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5">
                  <td className="py-3 px-4 text-gray-400">
                    {new Date(log.created_at).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 font-bold text-orange-400">{log.admin_name}</td>
                  <td className="py-3 px-4 font-bold text-white">{log.action}</td>
                  <td className="py-3 px-4 text-gray-300">{log.target_type}</td>
                  <td className="py-3 px-4 text-gray-400">{log.new_value || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
