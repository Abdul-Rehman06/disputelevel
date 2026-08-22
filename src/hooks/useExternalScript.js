import { useEffect, useState } from 'react';

const records = new Map();

export function useExternalScript(src) {
  const [status, setStatus] = useState(() => records.get(src)?.status || 'idle');

  useEffect(() => {
    if (!src) return undefined;
    const existing = records.get(src);
    if (existing?.status === 'ready') {
      setStatus('ready');
      return undefined;
    }

    let script = existing?.element || document.querySelector('script[data-dispute-levels-script="' + src + '"]');
    const onLoad = () => {
      records.set(src, { element: script, status: 'ready' });
      setStatus('ready');
    };
    const onError = () => {
      records.set(src, { element: script, status: 'error' });
      setStatus('error');
    };

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.disputeLevelsScript = src;
      document.head.appendChild(script);
      records.set(src, { element: script, status: 'loading' });
    }

    setStatus(records.get(src)?.status || 'loading');
    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });

    return () => {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    };
  }, [src]);

  return status;
}
