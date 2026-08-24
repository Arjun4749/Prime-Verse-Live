import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Dispute } from '../../types';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const AdminDisputes: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>(dbStore.getDisputes());

  const handleUpdateStatus = (id: string, newStatus: Dispute['status']) => {
    const list = dbStore.getDisputes();
    const target = list.find((d) => d.id === id);
    if (target) {
      target.status = newStatus;
      target.updated_at = new Date().toISOString();
      dbStore.logAction('Resolved Dispute', 'Dispute', id, 'Open', newStatus);
      setDisputes([...list]);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-xl font-black text-white">Dispute & Fair Play Operations</h2>
        <p className="text-xs text-gray-400">Review reported placement disputes and evidence screenshots.</p>
      </div>

      {disputes.length === 0 ? (
        <Card className="p-8 text-center text-xs text-gray-400 space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="font-bold text-white uppercase">No Active Result Disputes</p>
          <p>All tournament match results are currently verified without pending claims.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((d) => (
            <Card key={d.id} className="space-y-3">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div>
                  <span className="text-[10px] font-mono text-orange-400 uppercase">{d.tournament_title}</span>
                  <h3 className="text-base font-bold text-white">{d.reason}</h3>
                </div>
                <Badge variant={d.status === 'Open' ? 'red' : 'green'}>{d.status}</Badge>
              </div>

              <p className="text-xs text-gray-300">{d.description}</p>

              {d.evidence_url && (
                <div className="pt-2">
                  <a href={d.evidence_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline">
                    View Evidence Screenshot
                  </a>
                </div>
              )}

              {d.status === 'Open' && (
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
                  <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(d.id, 'Rejected')}>
                    <XCircle className="w-3.5 h-3.5" /> Reject Claim
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => handleUpdateStatus(d.id, 'Resolved')}>
                    <CheckCircle2 className="w-3.5 h-3.5" /> Resolve & Adjust
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
