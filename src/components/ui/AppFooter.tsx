import React from 'react';
import { Shield, Rss, FileText, Lock, Code2, AlertTriangle, Info } from 'lucide-react';
import { ThemeToggle } from '../../lib/theme';

interface AppFooterProps {
  onNavigate: (path: string) => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1F33] dark:bg-[#070D15] text-white pt-12 pb-8 border-t border-[#263648] dark:border-[#1E293B] mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#263648]/80 dark:border-[#1E293B] text-xs">
          {/* Column 1: Brand premise */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-[#1769E0] flex items-center justify-center text-white">
                <Shield className="w-4 h-4 text-[#11A8A5]" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Bet<span className="text-[#11A8A5]"> Legal</span>
              </span>
            </div>

            <p className="text-[#D7DEE8]/80 text-xs leading-relaxed">
              Plataforma independente de verificação e inteligência sobre o mercado brasileiro de apostas.
            </p>

            <p className="text-[11px] text-[#11A8A5] font-mono">
              “Não presumimos. Não recomendamos. Conferimos.”
            </p>

            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] text-[#D7DEE8]/70">Aparência:</span>
              <ThemeToggle />
            </div>
          </div>

          {/* Column 2: Verificação & Consultas */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-[#D7DEE8]">
              Consultas & Listas
            </h4>
            <ul className="space-y-2 text-[#D7DEE8]/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/autorizadas')}
                  className="hover:text-white transition-colors"
                >
                  Casas Autorizadas (Nacional / Estadual)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/nao-autorizadas')}
                  className="hover:text-white transition-colors"
                >
                  Radar de Não Autorizadas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/mudancas')}
                  className="hover:text-white transition-colors"
                >
                  Mudanças Recentes no Mercado
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/series')}
                  className="hover:text-white transition-colors"
                >
                  Série Histórica e Estatísticas
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/ranking')}
                  className="hover:text-white transition-colors"
                >
                  Avaliações de Usuários
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Transparência & Fontes */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-[#D7DEE8]">
              Transparência
            </h4>
            <ul className="space-y-2 text-[#D7DEE8]/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/metodologia')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-[#11A8A5]" />
                  <span>Metodologia e Taxonomia</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/fontes')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Info className="w-3 h-3 text-[#11A8A5]" />
                  <span>Fontes Oficiais Consultadas</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/privacidade')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-3 h-3 text-[#11A8A5]" />
                  <span>Privacidade e LGPD</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/sobre')}
                  className="hover:text-white transition-colors"
                >
                  Sobre o Bet Legal
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Canais & Desenvolvedores */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px] text-[#D7DEE8]">
              Canais & Dados
            </h4>
            <ul className="space-y-2 text-[#D7DEE8]/80">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contestar')}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-[#FEDF89]"
                >
                  <AlertTriangle className="w-3 h-3 text-[#FEDF89]" />
                  <span>Contestar ou Reportar</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/api')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3 h-3 text-[#11A8A5]" />
                  <span>API Pública (JSON)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/mudancas/rss')}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Rss className="w-3 h-3 text-[#EAA914]" />
                  <span>Feed RSS de Mudanças</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Core Disclaimer - Section 2.2 & Apêndice A */}
        <div className="pt-8 text-xs text-[#D7DEE8]/70 space-y-4">
          <p className="leading-relaxed bg-[#263648]/40 dark:bg-[#131F2E]/60 p-4 rounded-lg border border-[#263648] dark:border-[#1E293B]">
            <strong className="text-white font-medium block mb-1">Aviso legal e de independência:</strong>
            Informação regulatória baseada em fontes públicas e verificações automatizadas com revisão humana. Não é aconselhamento jurídico. Em caso de divergência, prevalece a fonte oficial. O Bet Legal não tem vínculo com casas de apostas, não recebe comissões e não recomenda onde apostar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#D7DEE8]/60 pt-2">
            <span>
              Bet Legal © 2026 · “Os fatos antes da aposta.” · Horário oficial de Brasília (America/Sao_Paulo)
            </span>
            <div className="flex items-center gap-4">
              <span>Atualizações 4x ao dia</span>
              <span>·</span>
              <span>Zero comissões</span>
              <span>·</span>
              <span>Sem bônus</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
