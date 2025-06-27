// components/zendesk-debug.tsx
'use client';

import { useEffect, useState } from 'react';

export function ZendeskDebug() {
  const [status, setStatus] = useState({
    keyExists: false,
    scriptLoaded: false,
    widgetAvailable: false,
    settingsConfigured: false
  });

  useEffect(() => {
    const checkInterval = setInterval(() => {
      setStatus({
        keyExists: !!process.env.NEXT_PUBLIC_ZENDESK_KEY,
        scriptLoaded: !!document.getElementById('ze-snippet'),
        widgetAvailable: typeof window.zE !== 'undefined',
        settingsConfigured: typeof window.zESettings !== 'undefined'
      });
    }, 1000);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <div className="fixed bottom-40 right-6 bg-black text-white p-4 rounded-lg text-xs z-[9999] max-w-xs">
      <h3 className="font-bold mb-2">Zendesk Debug:</h3>
      <div>Key: {status.keyExists ? '✅' : '❌'}</div>
      <div>Script: {status.scriptLoaded ? '✅' : '❌'}</div>
      <div>Widget: {status.widgetAvailable ? '✅' : '❌'}</div>
      <div>Settings: {status.settingsConfigured ? '✅' : '❌'}</div>
      <div className="mt-2">
        <button 
          onClick={() => window.zE && window.zE('webWidget', 'show')}
          className="bg-blue-500 px-2 py-1 rounded text-xs"
        >
          Force Show
        </button>
      </div>
    </div>
  );
}