import React from 'react';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { CONFIG } from '../config';

export default function Header({
  onRefresh,
  isRefreshing,
  atualizadoEm,
  totalSacola = 0,
  onOpenSacola,
}) {
  const formatarHora = (isoString) => {
    if (!isoString) return null;
    try {
      const data = new Date(isoString);
      return data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  };

  const horaAtualizacao = formatarHora(atualizadoEm);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-zinc-900 tracking-tight truncate">
              {CONFIG.NOME_LOJA}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 truncate">
              {CONFIG.SUBTITULO_LOJA}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {totalSacola > 0 && (
            <button
              type="button"
              onClick={onOpenSacola}
              className="relative inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 active:scale-95 transition-all"
              title="Ver Sacola de Interesse"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="bg-emerald-500 text-zinc-950 text-xs font-bold px-1.5 py-0.2 rounded-full">
                {totalSacola}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            title={
              horaAtualizacao
                ? `Atualizar catálogo (Última atualização às ${horaAtualizacao})`
                : 'Atualizar catálogo'
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 min-h-[40px] rounded-xl text-xs sm:text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-60 disabled:pointer-events-none"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-zinc-900' : ''}`}
            />
            <span className="hidden sm:inline">
              {isRefreshing ? 'Atualizando...' : 'Atualizar'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
