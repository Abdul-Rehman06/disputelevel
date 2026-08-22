import { motion as Motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function RouteTransition({ children }) {
  const location = useLocation();
  return (
    <Motion.div
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </Motion.div>
  );
}
