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
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-3 font-sans shadow-sm">
      {/* Log Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
          <Activity className="w-4 h-4 text-orange-500" />
          <span>LIVE PROTOCOL LOG</span>
        </div>
        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold uppercase tracking-wider">
          REAL-TIME
        </span>
      </div>

      {/* Log Stream List */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {logs.length === 0 ? (
          <div className="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200 font-sans">
            No protocol events logged yet. Connect wallet or generate strategy.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                log.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-900'
                  : log.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.type === 'error'
                        ? 'bg-red-500'
                        : log.type === 'success'
                        ? 'bg-emerald-500'
                        : 'bg-orange-500'
                    }`}
                  ></span>
                  <span>{log.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{log.timestamp}</span>
              </div>
              <p className="text-[11px] font-mono leading-relaxed text-gray-600 pl-4">{log.detail}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
