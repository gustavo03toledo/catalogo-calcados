import React, { useEffect, useState } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function ImageModal({ item, onClose }) {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!item) return;
    setCarregando(true);

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
  }, [item, onClose]);

  if (!item) return null;

  const { produto, categoria } = item;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex flex-col items-center justify-center p-3 sm:p-6 animate-fadeIn"
    >
      {/* Barra Superior do Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl flex items-center justify-between text-white mb-3 px-1"
      >
        <div className="min-w-0 pr-4">
          <h3 className="text-sm sm:text-base font-semibold truncate">
            {categoria.nomeExibicao}
          </h3>
          {categoria.tamanhos?.length > 0 && (
            <p className="text-xs text-zinc-300">
              Numerações da categoria: {categoria.tamanhos.join(', ')}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar zoom"
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Container da Imagem Ampliada */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[80vh] flex items-center justify-center rounded-2xl overflow-hidden bg-zinc-900/60"
      >
        {carregando && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <img
          src={produto.zoomUrl || produto.thumbUrl}
          alt={`Zoom - ${categoria.nomeExibicao}`}
          referrerPolicy="no-referrer"
          onLoad={() => setCarregando(false)}
          onError={() => setCarregando(false)}
          className="max-w-full max-h-[80vh] object-contain rounded-xl select-none"
        />
      </div>

      {/* Link opcional para abrir no Drive */}
      {produto.driveLink && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-3 flex items-center justify-center"
        >
          <a
            href={produto.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white underline underline-offset-4"
          >
            <span>Abrir foto original no Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </div>
  );
}
