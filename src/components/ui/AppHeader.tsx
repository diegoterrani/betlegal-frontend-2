import React, { useState } from 'react';
import { UserSession } from '../../types';
import { Shield, Menu, X, Search, LogOut, ChevronRight } from 'lucide-react';
import { ThemeToggle } from '../../lib/theme';

interface AppHeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: UserSession | null;
  onLogout: () => void;
  onQuickSearch?: (query: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  currentPath,
  onNavigate,
  user,
  onLogout,
  onQuickSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickQuery, setQuickQuery] = useState('');

  const navItems = [
    { label: 'Início', path: '/' },
    { label: 'Autorizadas', path: '/autorizadas' },
    { label: 'Radar', path: '/nao-autorizadas' },
    { label: 'Mudanças', path: '/mudancas' },
    { label: 'Dados', path: '/series' },
    { label: 'Avaliações', path: '/ranking' },
    { label: 'Metodologia', path: '/metodologia' },
    { label: 'Fontes', path: '/fontes' },
  ];

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    if (onQuickSearch) {
      onQuickSearch(quickQuery.trim());
    } else {
      onNavigate(`/busca?q=${encodeURIComponent(quickQuery.trim())}`);
    }
    setSearchOpen(false);
    setQuickQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B131F]/95 backdrop-blur-md border-b border-[#D7DEE8] dark:border-[#263548] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
        {/* Logo / Wordmark */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 group text-left focus-visible:ring-2 focus-visible:ring-[#1769E0] rounded p-1"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0B1F33] dark:bg-[#1E293B] border border-transparent dark:border-[#334155] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1769E0] transition-colors">
              <Shield className="w-4 h-4 text-[#11A8A5] dark:text-[#38BDF8]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#0B1F33] dark:text-white">
              Bet<span className="text-[#1769E0] dark:text-[#38BDF8]"> Legal</span>
            </span>
          </button>

          {/* Desktop Primary Nav */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium text-[#263648] dark:text-[#CBD5E1]" aria-label="Navegação principal">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => handleNav(item.path)}
                  className={`px-3 py-1.5 rounded-md transition-colors relative ${
                    isActive
                      ? 'text-[#1769E0] dark:text-[#38BDF8] font-semibold bg-[#F6F8FB] dark:bg-[#131F2E]'
                      : 'text-[#263648] dark:text-[#CBD5E1] hover:text-[#0B1F33] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#131F2E]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#1769E0] dark:bg-[#38BDF8] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right side: Quick Search, Admin link, Theme Toggle, Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Desktop Input */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Buscar marca, domínio ou CNPJ..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="w-52 lg:w-60 bg-[#F6F8FB] dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-8 pr-3 py-1.5 text-xs text-[#0B1F33] dark:text-[#F8FAFC] placeholder-[#667085] dark:placeholder-[#94A3B8] focus-visible:ring-2 focus-visible:ring-[#1769E0] transition-all focus:w-68"
            />
            <Search className="w-3.5 h-3.5 text-[#667085] dark:text-[#94A3B8] absolute left-2.5 pointer-events-none" />
          </form>

          <button
            type="button"
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-md text-[#667085] dark:text-[#94A3B8] hover:text-[#0B1F33] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#131F2E] transition-colors"
            aria-label="Abrir busca rápida"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Theme Toggle Button (Light/Dark Mode switch) */}
          <ThemeToggle />

          {/* Admin Panel quick access */}
          {user?.is_admin && (
            <button
              type="button"
              onClick={() => handleNav('/painel')}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors ${
                currentPath === '/painel'
                  ? 'bg-[#0B1F33] dark:bg-[#1E293B] text-white border-[#0B1F33] dark:border-[#334155]'
                  : 'bg-[#F4F0FF] dark:bg-[#581C87]/30 text-[#6941C6] dark:text-[#C084FC] border-[#D8B4FE] dark:border-[#6B21A8] hover:bg-[#E9D5FF] dark:hover:bg-[#581C87]/50'
              }`}
            >
              <span>Painel Executivo</span>
            </button>
          )}

          {/* User Session status */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-[#0B1F33] dark:text-white max-w-[120px] truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-[#667085] dark:text-[#94A3B8] font-mono">
                  {user.cpf_masked}
                </span>
              </div>

              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-md text-[#667085] dark:text-[#94A3B8] hover:text-[#B42318] hover:bg-[#FDECEC] dark:hover:bg-[#7F1D1D]/30 transition-colors"
                title="Encerrar sessão"
                aria-label="Sair da conta"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleNav('/entrar')}
                className="px-3 py-1.5 text-xs font-semibold text-[#263648] dark:text-[#E2E8F0] hover:text-[#0B1F33] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#131F2E] rounded-md transition-colors"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => handleNav('/cadastrar')}
                className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-[#1769E0] hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] rounded-md transition-colors shadow-xs"
              >
                Criar conta
              </button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-md text-[#263648] dark:text-[#E2E8F0] hover:text-[#0B1F33] dark:hover:text-white hover:bg-[#F6F8FB] dark:hover:bg-[#131F2E] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            aria-label="Menu de navegação"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Dropdown */}
      {searchOpen && (
        <div className="md:hidden border-t border-[#D7DEE8] dark:border-[#263548] p-3 bg-white dark:bg-[#0B131F] animate-in slide-in-from-top-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              autoFocus
              placeholder="Digite marca, domínio ou CNPJ..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
              className="w-full bg-[#F6F8FB] dark:bg-[#131F2E] border border-[#D7DEE8] dark:border-[#263548] rounded-md pl-9 pr-3 py-2 text-sm text-[#0B1F33] dark:text-[#F8FAFC] focus-visible:ring-2 focus-visible:ring-[#1769E0]"
            />
            <Search className="w-4 h-4 text-[#667085] dark:text-[#94A3B8] absolute left-3 top-2.5 pointer-events-none" />
          </form>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D7DEE8] dark:border-[#263548] bg-white dark:bg-[#0B131F] px-4 pt-2 pb-6 space-y-1 shadow-lg animate-in slide-in-from-top-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                currentPath === item.path
                  ? 'bg-[#F0F7FF] dark:bg-[#1E293B] text-[#1769E0] dark:text-[#38BDF8] font-semibold'
                  : 'text-[#263648] dark:text-[#CBD5E1] hover:bg-[#F6F8FB] dark:hover:bg-[#131F2E]'
              }`}
            >
              <span>{item.label}</span>
              <ChevronRight className="w-4 h-4 text-[#667085] dark:text-[#94A3B8]" />
            </button>
          ))}

          {/* Mobile Theme Toggle switch */}
          <div className="pt-3 pb-1">
            <ThemeToggle variant="expanded" />
          </div>

          <div className="pt-2 mt-2 border-t border-[#D7DEE8] dark:border-[#263548] space-y-2">
            <button
              type="button"
              onClick={() => handleNav('/contestar')}
              className="w-full text-left px-3 py-2 rounded-md text-xs font-semibold text-[#A35C00] dark:text-[#FBBF24] bg-[#FFF4D6]/50 dark:bg-[#78350F]/20 hover:bg-[#FFF4D6] dark:hover:bg-[#78350F]/40"
            >
              Contestar registro ou reportar site suspeito
            </button>

            {user?.is_admin && (
              <button
                type="button"
                onClick={() => handleNav('/painel')}
                className="w-full text-left px-3 py-2 rounded-md text-xs font-semibold text-[#6941C6] dark:text-[#C084FC] bg-[#F4F0FF] dark:bg-[#581C87]/20 hover:bg-[#E9D5FF] dark:hover:bg-[#581C87]/40"
              >
                Acessar Painel Executivo
              </button>
            )}

            {!user && (
              <button
                type="button"
                onClick={() => handleNav('/cadastrar')}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#1769E0] rounded-md"
              >
                Criar conta gratuita
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
