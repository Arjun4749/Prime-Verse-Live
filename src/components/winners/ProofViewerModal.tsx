import React from 'react';
import { ShieldCheck, Download, ExternalLink, Award } from 'lucide-react';
import { WinnerRecord, WinnerProof } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ProofViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: WinnerRecord;
  proofs: WinnerProof[];
}

export const ProofViewerModal: React.FC<ProofViewerModalProps> = ({ isOpen, onClose, winner, proofs }) => {
  if (!winner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Championship Proof & Verification" maxWidth="xl">
      <div className="space-y-6">
        {/* Championship Header */}
        <div className="p-4 bg-black/60 rounded-xl border border-amber-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={winner.winning_team_logo}
              alt={winner.winning_team_name}
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/50"
            />
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">Champion</span>
              <h4 className="text-base font-bold text-white">{winner.winning_team_name}</h4>
              <span className="text-xs text-gray-400">{winner.tournament_title}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-mono text-gray-400 block">Prize Reward</span>
            <span className="text-lg font-black text-amber-400">₹{winner.prize_amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Verification Status */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 p-3 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            <strong>Official Verified Winner:</strong> Results and prize transfer proof have been audited and verified by BGMI.ARENA administrators.
          </span>
        </div>

        {/* Proof Images Gallery */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Public Proof Documents</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {winner.payment_proof_url && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wide block">
                  Prize Payment Proof
                </span>
                <div className="rounded-xl border border-gray-800 overflow-hidden bg-black/80 h-48 group relative">
                  <img
                    src={winner.payment_proof_url}
                    alt="Payment Proof"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <a
                    href={winner.payment_proof_url}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" /> View Full Image
                  </a>
                </div>
              </div>
            )}

            {winner.winner_screenshot && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wide block">
                  Victory Screenshot
                </span>
                <div className="rounded-xl border border-gray-800 overflow-hidden bg-black/80 h-48 group relative">
                  <img
                    src={winner.winner_screenshot}
                    alt="Winner Screenshot"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <a
                    href={winner.winner_screenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" /> View Full Image
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Notes */}
        {proofs.length > 0 && (
          <div className="p-3 bg-gray-900/60 rounded-xl border border-gray-800 text-xs text-gray-300 space-y-1">
            <span className="font-bold text-white uppercase block">Audit Notes:</span>
            {proofs.map((p) => (
              <p key={p.id} className="text-gray-400">&bull; {p.notes}</p>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
