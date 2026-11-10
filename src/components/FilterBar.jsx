import React from 'react';
import { Layers, Ruler } from 'lucide-react';

export default function FilterBar({
  categorias,
  categoriaSelecionada,
  onSelectCategoria,
  tamanhosDisponiveis,
  tamanhoSelecionado,
  onSelectTamanho,
}) {
  return (
    <section className="bg-white border-b border-zinc-200 sticky top-[65px] z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-3">
        {/* Filtro de Categorias */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-zinc-400 shrink-0 pr-1">
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Categorias:</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => onSelectCategoria('TODOS')}
              className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
                categoriaSelecionada === 'TODOS'
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              Todos
            </button>

            {categorias.map((cat) => {
              const ativo = categoriaSelecionada === cat.idCategoria;
              return (
                <button
                  key={cat.idCategoria}
                  type="button"
                  onClick={() => onSelectCategoria(cat.idCategoria)}
                  className={`px-3.5 py-1.5 min-h-[36px] rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 ${
                    ativo
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  <span>{cat.nomeExibicao}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      ativo
                        ? 'bg-zinc-700 text-zinc-100'
                        : 'bg-zinc-200/80 text-zinc-600'
                    }`}
                  >
                    {cat.produtos?.length || cat.totalProdutos || 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtro Rápido por Numeração */}
        {tamanhosDisponiveis.length > 0 && (
          <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
            <div className="flex items-center gap-1 text-xs font-medium text-zinc-500 shrink-0">
              <Ruler className="w-3.5 h-3.5 text-zinc-400" />
              <span>Filtrar pelo meu tamanho:</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => onSelectTamanho(null)}
                className={`px-3 py-1 min-h-[32px] rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  tamanhoSelecionado === null
                    ? 'bg-zinc-900 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                Todos
              </button>

              {tamanhosDisponiveis.map((tam) => {
                const ativo = tamanhoSelecionado === tam;
                return (
                  <button
                    key={tam}
                    type="button"
                    onClick={() =>
                      onSelectTamanho(ativo ? null : tam)
                    }
                    className={`min-w-[36px] h-8 px-2.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center justify-center ${
                      ativo
                        ? 'bg-zinc-900 text-white shadow-sm ring-2 ring-zinc-900/10'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {tam}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
