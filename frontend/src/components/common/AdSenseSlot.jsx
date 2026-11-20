import React, { useEffect, useState } from 'react';
import api from '../../api/axiosClient';
import { ShieldCheck } from 'lucide-react';

export default function AdSenseSlot({ slotId = '1234567890', format = 'auto', layout = 'horizontal', className = '' }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get('/adsense/config');
        if (res.data.success) {
          setConfig(res.data.config);
        }
      } catch (err) {
        // Fallback default
        setConfig({
          publisherId: 'ca-pub-9876543210987654',
          testMode: true,
          clientSideEnabled: true,
        });
      }
    };
    fetchConfig();
  }, []);

  if (!config || !config.clientSideEnabled) {
    return null;
  }

  return (
    <div className={`my-8 mx-auto w-full max-w-4xl px-4 ${className}`}>
      {/* Policy-compliant Ad Marker */}
      <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1 px-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          Sponsored / Advertisement
        </span>
        <span className="text-[10px] text-slate-600">Google AdSense Partner Unit</span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-dashed border-purple-500/25 bg-slate-900/40 p-4 text-center backdrop-blur-md">
        {config.testMode ? (
          <div className="flex flex-col items-center justify-center py-6 px-4">
            <div className="text-xs font-mono font-medium text-purple-300">
              [Google AdSense Responsive Unit — Policy Compliant]
            </div>
            <p className="mt-1 text-[11px] text-slate-400 max-w-md">
              Configured Publisher: <span className="text-slate-300 font-mono">{config.publisherId}</span> (Slot: {slotId}). Live ads will display here once Google reviews and approves the domain.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                Format: {format}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ads.txt Active
              </span>
            </div>
          </div>
        ) : (
          <ins
            className="adsbygoogle block"
            style={{ display: 'block', minHeight: '90px' }}
            data-ad-client={config.publisherId}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          ></ins>
        )}
      </div>
    </div>
  );
}
