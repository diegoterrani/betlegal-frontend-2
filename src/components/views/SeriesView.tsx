import React, { useState } from 'react';
import { store } from '../../lib/store';
import { TimeSeriesPoint } from '../../types';
import { formatDateBR } from '../../lib/formatters';
import { AlertBanner } from '../ui/AlertBanner';
import { BarChart3, Download, Table as TableIcon, Calendar, Info } from 'lucide-react';

interface SeriesViewProps {
  onNavigate: (path: string) => void;
}

export const SeriesView: React.FC<SeriesViewProps> = () => {
  const [activeSeries, setActiveSeries] = useState<'all' | 'authorized' | 'unauthorized' | 'blocked'>('all');
  const [showTable, setShowTable] = useState(true);

  const timeseries = store.getTimeSeries();

  const handleDownloadCsv = () => {
    const csvContent = store.exportTimeSeriesCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `serie-temporal-mercado-bet-legal-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // SVG Chart calculation
  const maxVal = 7000;
  const chartHeight = 220;
  const chartWidth = 640;
  const paddingX = 40;
  const paddingY = 20;

  const pointsCount = timeseries.length;
  const stepX = (chartWidth - paddingX * 2) / (pointsCount - 1);

  const getY = (val: number) => {
    const availableHeight = chartHeight - paddingY * 2;
    return chartHeight - paddingY - (val / maxVal) * availableHeight;
  };

  const getPointsPath = (key: keyof Omit<TimeSeriesPoint, 'date'>) => {
    return timeseries
      .map((pt, i) => {
        const x = paddingX + i * stepX;
        const y = getY(pt[key] as number);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#11A8A5] dark:text-[#38BDF8] uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Série Histórica Consolidada</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F33] dark:text-[#F8FAFC] tracking-tight">
            Dados históricos do mercado
          </h1>
          <p className="text-xs sm:text-sm text-[#667085] dark:text-[#94A3B8] mt-1 max-w-2xl leading-relaxed">
            Evolução do estoque de domínios autorizados, não autorizados detectados e bloqueios notificados desde a sanção da Lei nº 14.790 em 30/12/2023.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#1769E0] dark:bg-[#2563EB] text-white text-xs font-semibold rounded-md hover:bg-[#0B1F33] dark:hover:bg-[#1D4ED8] transition-colors shadow-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar dados (.csv)</span>
        </button>
      </div>

      {/* Methodological note */}
      <AlertBanner type="info" title="Nota Metodológica">
        As contagens representam datas de publicação de portarias oficiais e notificações aos provedores pela Anatel. Não são geradas interpolações artificiais de dias sem registros. Horário padrão America/Sao_Paulo.
      </AlertBanner>

      {/* Chart Card */}
      <div className="bg-white dark:bg-[#131F2E] rounded-xl border border-[#D7DEE8] dark:border-[#263548] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2F4F7] dark:border-[#1E293B] pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC]">Série visualizada:</span>
            <button
              type="button"
              onClick={() => setActiveSeries('all')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeSeries === 'all'
                  ? 'bg-[#0B1F33] dark:bg-[#2563EB] text-white font-semibold'
                  : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
              }`}
            >
              Todas as séries
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries('authorized')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeSeries === 'authorized'
                  ? 'bg-[#16794A] text-white font-semibold'
                  : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
              }`}
            >
              Autorizadas
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries('unauthorized')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeSeries === 'unauthorized'
                  ? 'bg-[#B54708] text-white font-semibold'
                  : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
              }`}
            >
              Não autorizadas
            </button>
            <button
              type="button"
              onClick={() => setActiveSeries('blocked')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                activeSeries === 'blocked'
                  ? 'bg-[#B42318] text-white font-semibold'
                  : 'bg-[#F6F8FB] dark:bg-[#0E1724] text-[#263648] dark:text-[#CBD5E1] hover:bg-[#D7DEE8]'
              }`}
            >
              Bloqueios Anatel
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#667085] dark:text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#16794A] inline-block" /> Autorizadas (Nac + Est)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B54708] inline-block" /> Radar Detectadas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B42318] inline-block" /> Bloqueadas Anatel
            </span>
          </div>
        </div>

        {/* Accessible SVG line chart */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto max-h-72 select-none"
            role="img"
            aria-label="Gráfico de evolução histórica dos domínios de apostas no Brasil de dezembro de 2023 a setembro de 2026"
          >
            {/* Grid lines */}
            {[0, 2000, 4000, 6000].map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    className="text-[#E5E9F0] dark:text-[#263548]"
                    strokeDasharray="4 4"
                  />
                  <text x={paddingX - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#667085" fontFamily="monospace">
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Lines according to active filter */}
            {(activeSeries === 'all' || activeSeries === 'authorized') && (
              <path
                d={getPointsPath('authorized_national')}
                fill="none"
                stroke="#16794A"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {(activeSeries === 'all' || activeSeries === 'unauthorized') && (
              <path
                d={getPointsPath('unauthorized_detected')}
                fill="none"
                stroke="#B54708"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {(activeSeries === 'all' || activeSeries === 'blocked') && (
              <path
                d={getPointsPath('anatel_blocked')}
                fill="none"
                stroke="#B42318"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* X-axis labels */}
            {timeseries.map((pt, i) => {
              const x = paddingX + i * stepX;
              return (
                <text
                  key={pt.date}
                  x={x}
                  y={chartHeight - 4}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#667085"
                  fontFamily="monospace"
                >
                  {formatDateBR(pt.date).slice(3)}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Tabular Alternative - WCAG accessibility requirement */}
        <div className="border-t border-[#F2F4F7] dark:border-[#1E293B] pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-[#0B1F33] dark:text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
              <TableIcon className="w-3.5 h-3.5 text-[#1769E0] dark:text-[#38BDF8]" />
              Tabela Acessível de Dados Equivalentes
            </h3>
            <button
              type="button"
              onClick={() => setShowTable(!showTable)}
              className="text-xs text-[#1769E0] dark:text-[#38BDF8] hover:underline font-medium"
            >
              {showTable ? 'Ocultar tabela' : 'Exibir tabela'}
            </button>
          </div>

          {showTable && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs" aria-label="Tabela de dados históricos">
                <thead className="bg-[#F8FAFC] dark:bg-[#0E1724] border-b border-[#D7DEE8] dark:border-[#263548] text-[#667085] dark:text-[#94A3B8] font-semibold">
                  <tr>
                    <th scope="col" className="py-2.5 px-3">Data</th>
                    <th scope="col" className="py-2.5 px-3">Autorizadas SPA/MF</th>
                    <th scope="col" className="py-2.5 px-3">Autorizadas Estaduais</th>
                    <th scope="col" className="py-2.5 px-3">Decisão Judicial</th>
                    <th scope="col" className="py-2.5 px-3">Não Autorizadas Radar</th>
                    <th scope="col" className="py-2.5 px-3">Bloqueadas Anatel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7] dark:divide-[#1E293B] font-mono">
                  {timeseries.map((row) => (
                    <tr key={row.date} className="hover:bg-[#F6F8FB] dark:hover:bg-[#1A293D]">
                      <td className="py-2 px-3 font-semibold text-[#0B1F33] dark:text-white">{formatDateBR(row.date)}</td>
                      <td className="py-2 px-3 text-[#16794A] font-bold">{row.authorized_national}</td>
                      <td className="py-2 px-3 text-[#16794A]">{row.authorized_state}</td>
                      <td className="py-2 px-3 text-[#6941C6] dark:text-[#C084FC]">{row.judicial}</td>
                      <td className="py-2 px-3 text-[#B54708] dark:text-[#FB923C]">{row.unauthorized_detected}</td>
                      <td className="py-2 px-3 text-[#B42318] dark:text-[#F87171]">{row.anatel_blocked}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
