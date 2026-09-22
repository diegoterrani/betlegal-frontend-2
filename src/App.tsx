import React, { useState, useEffect } from 'react';
import { store } from './lib/store';
import { UserSession } from './types';
import { AppHeader } from './components/ui/AppHeader';
import { AppFooter } from './components/ui/AppFooter';

// Views
import { HomeView } from './components/views/HomeView';
import { SearchResultsView } from './components/views/SearchResultsView';
import { AuthorizedView } from './components/views/AuthorizedView';
import { RadarView } from './components/views/RadarView';
import { DomainDetailView } from './components/views/DomainDetailView';
import { BrandDetailView } from './components/views/BrandDetailView';
import { RankingView } from './components/views/RankingView';
import { ChangesView } from './components/views/ChangesView';
import { SeriesView } from './components/views/SeriesView';
import { ContestView } from './components/views/ContestView';
import { MethodologyView } from './components/views/MethodologyView';
import { SourcesView } from './components/views/SourcesView';
import { PrivacyView } from './components/views/PrivacyView';
import { AboutView } from './components/views/AboutView';
import { ApiDocsView } from './components/views/ApiDocsView';
import { LoginView } from './components/views/LoginView';
import { RegisterView } from './components/views/RegisterView';
import { ConfirmEmailView } from './components/views/ConfirmEmailView';
import { AdminPanelView } from './components/views/AdminPanelView';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) return hash;
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => store.getCurrentUser());

  // Listen to browser back/forward and hash changes
  useEffect(() => {
    const handleHashOrPop = () => {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash) {
        setCurrentPath(hash);
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handleHashOrPop);
    window.addEventListener('hashchange', handleHashOrPop);

    return () => {
      window.removeEventListener('popstate', handleHashOrPop);
      window.removeEventListener('hashchange', handleHashOrPop);
    };
  }, []);

  // Listen to user session updates from store
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    store.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
  };

  const handleLoginAsAdmin = () => {
    const adminSession = store.login('admin@betlegal.com.br', 'adminpass', true);
    setCurrentUser(adminSession);
    navigate('/painel');
  };

  // Route parsing
  const cleanPath = currentPath.split('?')[0] || '/';
  const queryParams = new URLSearchParams(currentPath.includes('?') ? currentPath.split('?')[1] : '');

  const renderCurrentView = () => {
    // Root
    if (cleanPath === '/' || cleanPath === '') {
      return <HomeView onNavigate={navigate} />;
    }

    // Busca
    if (cleanPath === '/busca') {
      const q = queryParams.get('q') || '';
      return <SearchResultsView initialQuery={q} onNavigate={navigate} />;
    }

    // Autorizadas
    if (cleanPath === '/autorizadas') {
      return <AuthorizedView onNavigate={navigate} />;
    }

    // Não Autorizadas / Radar
    if (cleanPath === '/nao-autorizadas' || cleanPath === '/radar') {
      return <RadarView onNavigate={navigate} />;
    }

    // Detalhe de Domínio: /dominio/{host}
    if (cleanPath.startsWith('/dominio/')) {
      const host = cleanPath.replace('/dominio/', '');
      return <DomainDetailView host={decodeURIComponent(host)} onNavigate={navigate} />;
    }

    // Detalhe de Marca: /marca/{slug}
    if (cleanPath.startsWith('/marca/')) {
      const slug = cleanPath.replace('/marca/', '');
      return <BrandDetailView slug={decodeURIComponent(slug)} user={currentUser} onNavigate={navigate} />;
    }

    // Avaliações / Ranking
    if (cleanPath === '/ranking' || cleanPath === '/avaliacoes') {
      return <RankingView user={currentUser} onNavigate={navigate} />;
    }

    // Mudanças
    if (cleanPath === '/mudancas' || cleanPath === '/mudancas/rss' || cleanPath === '/mudancas/feed.xml') {
      return <ChangesView onNavigate={navigate} />;
    }

    // Séries Temporais / Dados
    if (cleanPath === '/series' || cleanPath === '/dados') {
      return <SeriesView onNavigate={navigate} />;
    }

    // Contestar ou Reportar
    if (cleanPath === '/contestar') {
      const initialUrl = queryParams.get('url') || '';
      return <ContestView initialUrl={initialUrl} onNavigate={navigate} />;
    }

    // Metodologia
    if (cleanPath === '/metodologia') {
      return <MethodologyView onNavigate={navigate} />;
    }

    // Fontes
    if (cleanPath === '/fontes') {
      return <SourcesView />;
    }

    // Privacidade
    if (cleanPath === '/privacidade') {
      return <PrivacyView />;
    }

    // Sobre
    if (cleanPath === '/sobre') {
      return <AboutView onNavigate={navigate} />;
    }

    // API Docs
    if (cleanPath === '/api') {
      return <ApiDocsView />;
    }

    // Login
    if (cleanPath === '/entrar') {
      const redirect = queryParams.get('redirect') || '/';
      return (
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigate}
          redirectPath={redirect}
        />
      );
    }

    // Cadastro
    if (cleanPath === '/cadastrar') {
      return <RegisterView onNavigate={navigate} />;
    }

    // Confirmação de E-mail
    if (cleanPath === '/confirmar') {
      return <ConfirmEmailView onNavigate={navigate} />;
    }

    // Painel Executivo / Admin
    if (cleanPath === '/painel') {
      return (
        <AdminPanelView
          user={currentUser}
          onNavigate={navigate}
          onLoginAsAdmin={handleLoginAsAdmin}
        />
      );
    }

    // Fallback Home
    return <HomeView onNavigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] dark:bg-[#0B131F] text-[#0B1F33] dark:text-[#F8FAFC] font-sans antialiased selection:bg-[#1769E0] selection:text-white transition-colors duration-200">
      {/* Universal Navigation Header */}
      <AppHeader
        currentPath={cleanPath}
        onNavigate={navigate}
        user={currentUser}
        onLogout={handleLogout}
        onQuickSearch={(query) => navigate(`/busca?q=${encodeURIComponent(query)}`)}
      />

      {/* Main Content View Container */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Universal Footer with Mandatory Disclaimers */}
      <AppFooter onNavigate={navigate} />
    </div>
  );
}
