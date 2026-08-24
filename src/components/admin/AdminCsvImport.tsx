import React, { useState } from 'react';
import { Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, Download } from 'lucide-react';
import { dbStore } from '../../services/dbStore';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface AdminCsvImportProps {
  tournamentId: string;
  matchId: string;
}

interface ParsedRow {
  teamName: string;
  placement: number;
  kills: number;
  teamId?: string;
  isValid: boolean;
  error?: string;
}

export const AdminCsvImport: React.FC<AdminCsvImportProps> = ({ tournamentId, matchId }) => {
  const [csvText, setCsvText] = useState('');
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importedStatus, setImportedStatus] = useState<string | null>(null);

  const handleParseCsv = () => {
    if (!csvText.trim()) return;

    const lines = csvText.trim().split('\n');
    const teams = dbStore.getTeams();
    const rows: ParsedRow[] = [];

    lines.forEach((line, index) => {
      // Skip header if line starts with team or team_name
      if (index === 0 && line.toLowerCase().includes('team')) return;

      const parts = line.split(',').map((p) => p.trim());
      if (parts.length < 3) return;

      const teamName = parts[0];
      const placement = parseInt(parts[1], 10);
      const kills = parseInt(parts[2], 10);

      const matchedTeam = teams.find(
        (t) => t.name.toLowerCase() === teamName.toLowerCase() || t.tag.toLowerCase() === teamName.toLowerCase()
      );

      const isValid = !isNaN(placement) && !isNaN(kills) && Boolean(matchedTeam);

      rows.push({
        teamName,
        placement: isNaN(placement) ? 0 : placement,
        kills: isNaN(kills) ? 0 : kills,
        teamId: matchedTeam?.id,
        isValid,
        error: !matchedTeam ? 'Team name not found in database' : isNaN(placement) ? 'Invalid placement' : undefined,
      });
    });

    setParsedRows(rows);
  };

  const handleConfirmImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid && r.teamId);
    if (validRows.length === 0) return;

    const payload = validRows.map((r) => ({
      team_id: r.teamId!,
      placement: r.placement,
      kills: r.kills,
    }));

    dbStore.saveMatchResults(matchId, tournamentId, payload);
    dbStore.logAction('CSV Results Import', 'MatchResult', matchId, '', `Imported ${validRows.length} rows`);

    setImportedStatus(`Successfully imported ${validRows.length} team match results! Leaderboard updated.`);
    setParsedRows([]);
    setCsvText('');
  };

  const downloadSampleCsv = () => {
    const sample = `team_name,placement,kills\nGodLike eSports,1,14\nSoul Gaming,2,10\nEntity Gaming,3,6`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_bgmi_results.csv';
    a.click();
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-orange-400" />
            CSV Match Result Import Engine
          </h3>
          <p className="text-xs text-gray-400">
            Paste raw CSV data or download template format: <code className="text-orange-400">team_name, placement, kills</code>
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadSampleCsv}>
          <Download className="w-3.5 h-3.5" /> Download Sample CSV
        </Button>
      </div>

      {importedStatus && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{importedStatus}</span>
        </div>
      )}

      {/* CSV Input */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-300 uppercase">Paste CSV Text</label>
        <textarea
          rows={5}
          placeholder={`team_name, placement, kills\nGodLike eSports, 1, 14\nSoul Gaming, 2, 10`}
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full bg-black/80 border border-gray-800 rounded-xl p-3 font-mono text-xs text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
        />
        <Button variant="secondary" size="sm" onClick={handleParseCsv}>
          <Upload className="w-3.5 h-3.5" /> Parse & Validate CSV
        </Button>
      </div>

      {/* Parsed Preview Table */}
      {parsedRows.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-gray-800">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300">Validation Preview</h4>

          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-black/60">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-900 text-gray-400 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Team Name</th>
                  <th className="py-2.5 px-3">Placement</th>
                  <th className="py-2.5 px-3">Kills</th>
                  <th className="py-2.5 px-3">Points</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {parsedRows.map((row, idx) => {
                  const { totalPoints } = dbStore.calculatePoints(row.placement, row.kills);
                  return (
                    <tr key={idx} className={row.isValid ? 'hover:bg-white/5' : 'bg-red-950/20'}>
                      <td className="py-2 px-3 font-bold text-white">{row.teamName}</td>
                      <td className="py-2 px-3">{row.placement}</td>
                      <td className="py-2 px-3 text-red-400">{row.kills}</td>
                      <td className="py-2 px-3 text-amber-400 font-bold">{totalPoints} pts</td>
                      <td className="py-2 px-3">
                        {row.isValid ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Matched
                          </span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-1 text-[11px]">
                            <AlertTriangle className="w-3.5 h-3.5" /> {row.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="primary"
              size="md"
              glow
              onClick={handleConfirmImport}
              disabled={parsedRows.filter((r) => r.isValid).length === 0}
            >
              Confirm & Save Valid Match Results
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};
