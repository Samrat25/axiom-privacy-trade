import React from 'react';
import { Activity } from 'lucide-react';

export interface ProtocolLogEntry {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  detail: string;
  timestamp: string;
}

interface ProtocolLogProps {
  logs: ProtocolLogEntry[];
}

export const ProtocolLog: React.FC<ProtocolLogProps> = ({ logs }) => {
  return (
    <div className="bg-[#0F141C] border border-gray-800 rounded-2xl p-4 space-y-3 font-mono">
      {/* Log Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-200">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>LIVE PROTOCOL LOG</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-bold uppercase tracking-wider">
          REAL-TIME
        </span>
      </div>

      {/* Log Stream List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500 bg-[#080B10] rounded-xl border border-gray-900">
            No protocol events logged yet. Connect wallet or generate strategy.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                log.type === 'error'
                  ? 'bg-red-950/40 border-red-800/80 text-red-200'
                  : log.type === 'success'
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                  : 'bg-gray-900/60 border-gray-800 text-gray-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.type === 'error'
                        ? 'bg-red-500'
                        : log.type === 'success'
                        ? 'bg-emerald-400'
                        : 'bg-purple-400'
                    }`}
                  ></span>
                  <span>{log.title}</span>
                </div>
                <span className="text-[10px] text-gray-500">{log.timestamp}</span>
              </div>
              <p className="text-[11px] font-mono leading-relaxed text-gray-400 pl-4">{log.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
