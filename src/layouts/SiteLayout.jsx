import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import RouteTransition from '../components/RouteTransition';

export default function SiteLayout() {
  return (
    <>
      <Header />
      <RouteTransition><Outlet /></RouteTransition>
      <Footer />
    </>
  );
}
