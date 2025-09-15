
import React, { useState, useEffect, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const RefuelHistoryPage = lazy(() => import('./features/refuel-history/RefuelHistoryPage'));
const SettingsPage = lazy(() => import('./features/settings/SettingsPage'));

type Page = 'dashboard' | 'history' | 'settings';

const App: React.FC = () => {
  const [page, setPage] = useState<Page>('dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      if (hash === 'history' || hash === 'settings') {
        setPage(hash);
      } else {
        setPage('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderPage = () => {
    switch (page) {
      case 'history':
        return <RefuelHistoryPage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  return (
    <Layout activePage={page} setPage={setPage}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><LoadingSpinner /></div>}>
        {renderPage()}
      </Suspense>
    </Layout>
  );
};

export default App;
