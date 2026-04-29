import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
