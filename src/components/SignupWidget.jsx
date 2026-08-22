import { useEffect, useId, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { globalContent } from '../content/globalContent';
import { useExternalScript } from '../hooks/useExternalScript';

export default function SignupWidget({ compact = false }) {
  const generatedId = useId().replace(/:/g, '');
  const containerId = 'crc-signup-' + generatedId;
  const status = useExternalScript(globalContent.creditRepairCloudScript);
  const [created, setCreated] = useState(false);

  useEffect(() => {
    if (status !== 'ready' || typeof window.createWidget !== 'function') return;
    try {
      window.createWidget({
        text: globalContent.signupLabel,
        color: '#159447',
        containerId,
        url: globalContent.billingUrl,
      });
      setCreated(true);
    } catch {
      setCreated(false);
    }
  }, [containerId, status]);

  return (
    <div className={compact ? 'signup-widget compact' : 'signup-widget'}>
      <div id={containerId} className={created ? 'widget-ready' : ''} />
      {!created && (
        <a className="signup-fallback" href={globalContent.billingUrl}>
          {globalContent.signupLabel}<ArrowUpRight size={compact ? 15 : 17} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
