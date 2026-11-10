import React, { useEffect } from 'react';
import {
  ShoppingBag,
  Trash2,
  X,
  MessageCircle,
  ChevronRight,
} from 'lucide-react';
import { CONFIG } from '../config';

export default function CartDrawer({
  itens,
  aberto,
  onOpen,
  onClose,
  onRemoveItem,
  onClearCart,
}) {
  useEffect(() => {
    if (!aberto) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [aberto, onClose]);

  const handleEnviarTodosWhatsApp = () => {
    if (itens.length === 0) return;

    const linhasItens = itens
      .map(
        (item, index) =>
          `${index + 1}. *Categoria:* ${item.nomeExibicao} | *Tamanho:* ${item.tamanho}\nFoto: ${item.driveLink}`
      )
      .join('\n\n');

    const mensagem = `Olá! Separei estes modelos no catálogo e gostaria de saber se estão disponíveis:\n\n${linhasItens}`;
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Barra Inferior Flutuante (Floating Bottom Bar) */}
      {itens.length > 0 && !aberto && (
        <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 pointer-events-none">
          <div className="max-w-2xl mx-auto pointer-events-auto">
            <div className="bg-zinc-900 text-white rounded-2xl p-3 sm:px-5 sm:py-3.5 shadow-xl border border-zinc-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-emerald-400" />
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-emerald-500 text-zinc-950 text-xs font-bold flex items-center justify-center">
                    {itens.length}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold truncate">
                    {itens.length === 1
                      ? '1 par selecionado'
                      : `${itens.length} pares selecionados`}
                  </p>
                  <p className="text-[11px] text-zinc-400 truncate">
                    Peça todos de uma só vez no WhatsApp
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpen}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[42px] rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-zinc-950 font-bold text-xs sm:text-sm transition-all shrink-0 shadow-sm"
              >
                <span>Ver Sacola / Enviar Pedido</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer / Modal da Sacola */}
      {aberto && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl"
          >
            {/* Cabeçalho da Sacola */}
            <div className="px-4 py-4 border-b border-zinc-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900">
                    Minha Sacola de Interesse
                  </h2>
                  <p className="text-xs text-zinc-500">
                    {itens.length === 1
                      ? '1 modelo separado'
                      : `${itens.length} modelos separados`}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Fechar sacola"
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de Itens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {itens.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-800 mb-1">
                    Sua sacola está vazia
                  </p>
                  <p className="text-xs text-zinc-500 max-w-xs">
                    Escolha a numeração nos modelos do catálogo e toque em
                    &ldquo;Adicionar à Sacola&rdquo; para pedir vários pares de
                    uma vez.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-medium text-zinc-500">
                      Confira os pares e numerações:
                    </span>
                    <button
                      type="button"
                      onClick={onClearCart}
                      className="text-xs font-medium text-red-600 hover:text-red-700 underline underline-offset-2"
                    >
                      Limpar sacola
                    </button>
                  </div>

                  {itens.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center gap-3 p-2.5 rounded-2xl border border-zinc-200 bg-zinc-50/60"
                    >
                      <img
                        src={item.thumbUrl}
                        alt={item.nomeExibicao}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover bg-zinc-200 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-zinc-900 truncate">
                          {item.nomeExibicao}
                        </p>
                        <div className="mt-1 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 text-white text-xs font-semibold">
                          <span>Tamanho: {item.tamanho}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        title="Remover item"
                        className="p-2.5 rounded-xl text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Rodapé com botão principal para o WhatsApp */}
            {itens.length > 0 && (
              <div className="p-4 border-t border-zinc-200 bg-white space-y-2">
                <button
                  type="button"
                  onClick={handleEnviarTodosWhatsApp}
                  className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                  <span>
                    Enviar Todos para o WhatsApp ({itens.length})
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
