import React, { useState, useEffect } from 'react';
import {
  ZoomIn,
  AlertCircle,
  MessageCircle,
  ShoppingBag,
  Check,
} from 'lucide-react';
import { CONFIG } from '../config';

export default function ProductCard({
  produto,
  categoria,
  tamanhoFiltroGlobal,
  onOpenZoom,
  onAddToCart,
  itensSacola,
}) {
  const [tamanhoEscolhido, setTamanhoEscolhido] = useState(
    tamanhoFiltroGlobal ?? null
  );
  const [erroTamanho, setErroTamanho] = useState(false);
  const [imgErro, setImgErro] = useState(false);
  const [feedbackAdicionado, setFeedbackAdicionado] = useState(false);

  // Sincroniza quando o usuário filtra por um tamanho específico na barra superior
  useEffect(() => {
    if (
      tamanhoFiltroGlobal !== null &&
      categoria.tamanhos?.includes(tamanhoFiltroGlobal)
    ) {
      setTamanhoEscolhido(tamanhoFiltroGlobal);
      setErroTamanho(false);
    }
  }, [tamanhoFiltroGlobal, categoria.tamanhos]);

  const jaNaSacola = Boolean(
    tamanhoEscolhido &&
      itensSacola?.some(
        (item) =>
          item.produtoId === produto.id && item.tamanho === tamanhoEscolhido
      )
  );

  const handleSelectTamanho = (tam) => {
    setTamanhoEscolhido(tam === tamanhoEscolhido ? null : tam);
    if (erroTamanho) {
      setErroTamanho(false);
    }
  };

  const validarTamanho = () => {
    if (!tamanhoEscolhido) {
      setErroTamanho(true);
      return false;
    }
    return true;
  };

  const handleAdicionarSacola = () => {
    if (!validarTamanho()) return;

    onAddToCart({
      produtoId: produto.id,
      idCategoria: categoria.idCategoria,
      nomeExibicao: categoria.nomeExibicao,
      tamanho: tamanhoEscolhido,
      thumbUrl: produto.thumbUrl,
      driveLink: produto.driveLink,
    });

    setFeedbackAdicionado(true);
    setTimeout(() => {
      setFeedbackAdicionado(false);
    }, 1500);
  };

  const handlePedirWhatsApp = () => {
    if (!validarTamanho()) return;

    const mensagem = `Olá! Gostei deste modelo do catálogo:\n\n*Categoria:* ${categoria.nomeExibicao}\n*Tamanho escolhido:* ${tamanhoEscolhido}\n*Foto do modelo:* ${produto.driveLink}\n\nAinda está disponível?`;
    const url = `https://wa.me/${CONFIG.WHATSAPP_NUMERO}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <article className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      {/* Imagem do Produto */}
      <div
        onClick={() => onOpenZoom(produto, categoria)}
        className="relative aspect-square w-full bg-zinc-100 overflow-hidden cursor-pointer group"
      >
        {!imgErro ? (
          <img
            src={produto.thumbUrl}
            alt={`Calçado - ${categoria.nomeExibicao}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setImgErro(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 p-4 text-center text-xs">
            <span>Imagem indisponível</span>
          </div>
        )}

        {/* Ícone de Zoom */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white p-2 rounded-full opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-sm">
          <ZoomIn className="w-4 h-4" />
        </div>
      </div>

      {/* Corpo do Card */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 gap-3">
        {/* Nome da Categoria */}
        <div>
          <span className="inline-block text-[11px] sm:text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-md truncate max-w-full">
            {categoria.nomeExibicao}
          </span>
        </div>

        {/* Seletor de Tamanhos */}
        <div
          className={`rounded-xl transition-all ${
            erroTamanho
              ? 'p-2 -mx-1 bg-red-50/80 ring-2 ring-red-500 animate-shake'
              : ''
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={`text-xs font-medium ${
                erroTamanho ? 'text-red-600 font-semibold' : 'text-zinc-600'
              }`}
            >
              {erroTamanho ? 'Escolha um tamanho:' : 'Tamanhos disponíveis:'}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categoria.tamanhos?.map((tam) => {
              const selecionado = tamanhoEscolhido === tam;
              return (
                <button
                  key={tam}
                  type="button"
                  onClick={() => handleSelectTamanho(tam)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center justify-center ${
                    selecionado
                      ? 'bg-zinc-900 text-white shadow-sm scale-105'
                      : erroTamanho
                      ? 'bg-white text-red-700 border border-red-300 hover:bg-red-100'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200 active:scale-95'
                  }`}
                >
                  {tam}
                </button>
              );
            })}
          </div>

          {erroTamanho && (
            <p className="mt-1.5 text-[11px] text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Selecione a numeração primeiro</span>
            </p>
          )}
        </div>

        {/* Botões de Ação: Adicionar à Sacola + Pedir no WhatsApp */}
        <div className="mt-auto pt-1 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleAdicionarSacola}
            className={`w-full min-h-[40px] px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all border ${
              feedbackAdicionado || jaNaSacola
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border-zinc-200 active:scale-[0.98]'
            }`}
          >
            {feedbackAdicionado ? (
              <>
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Adicionado à Sacola!</span>
              </>
            ) : jaNaSacola ? (
              <>
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Na Sacola (Tam. {tamanhoEscolhido})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Adicionar à Sacola</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePedirWhatsApp}
            className="w-full min-h-[42px] px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current shrink-0" />
            <span>Pedir no WhatsApp</span>
          </button>
        </div>
      </div>
    </article>
  );
}
