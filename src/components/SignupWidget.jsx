import { ArrowUpRight } from 'lucide-react';
import { globalContent } from '../content/globalContent';

export default function SignupWidget({ compact = false }) {
  return (
    <div className={compact ? 'signup-widget compact' : 'signup-widget'}>
      <a className="signup-fallback" href={globalContent.billingUrl}>
        {globalContent.signupLabel}<ArrowUpRight size={compact ? 15 : 17} aria-hidden="true" />
      </a>
    </div>
  );
}
