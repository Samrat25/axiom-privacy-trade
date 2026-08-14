import React from 'react';
import { Activity, ShieldCheck, AlertCircle, Info } from 'lucide-react';
import { formatISTTime } from '../utils/time';

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
    <div className="bg-white border border-gray-200/80 rounded-2xl p-5 space-y-3 font-sans shadow-sm flex flex-col justify-between h-full">
      {/* Log Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
            <Activity className="w-4 h-4 text-orange-500" />
            <span>LIVE PROTOCOL LOG</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 font-bold uppercase tracking-wider">
            IST FEED (UTC+5:30)
          </span>
        </div>
      </div>

      {/* Log Stream List */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1 flex-1">
        {logs.length === 0 ? (
          <div className="p-6 text-center text-xs text-gray-500 bg-gray-50 rounded-xl border border-gray-200 font-sans">
            No protocol events logged yet. Connect 1AM wallet or commit a strategy.
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-3 rounded-xl border text-xs space-y-1.5 transition-all ${
                log.type === 'error'
                  ? 'bg-red-50/70 border-red-200 text-red-900'
                  : log.type === 'success'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-gray-50 border-gray-200/80 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold">
                  {log.type === 'error' ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                  ) : log.type === 'success' ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <Info className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  )}
                  <span className="text-xs">{log.title}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono font-medium">
                  {formatISTTime(log.timestamp)}
                </span>
              </div>
              <p className="text-[11px] font-mono leading-relaxed text-gray-600 pl-5">{log.detail}</p>
            </div>
          ))
        )}
      </div>

      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-mono">
        <span>Midnight Preview & Preprod</span>
        <span>IST Verified</span>
      </div>
    </div>
  );
};
