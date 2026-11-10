import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AlertTriangle, PackageOpen, RefreshCw } from 'lucide-react';
import { API_URL } from './config';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import SkeletonGrid from './components/SkeletonGrid';
import ImageModal from './components/ImageModal';
import CartDrawer from './components/CartDrawer';

const STORAGE_KEY_SACOLA = 'catalogo_calcados_sacola_v1';

// Remove marcações Markdown caso a API retorne URLs no formato [url](url)
function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const markdownMatch = url.match(/^\[.*?\]\((.*?)\)$/);
  if (markdownMatch) {
    return markdownMatch[1].trim();
  }
  return url.trim();
}

export default function App() {
  const [categorias, setCategorias] = useState([]);
  const [atualizadoEm, setAtualizadoEm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState(null);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('TODOS');
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [zoomItem, setZoomItem] = useState(null);

  // Estado da Sacola de Interesse com persistência no localStorage
  const [sacola, setSacola] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY_SACOLA);
      return salvo ? JSON.parse(salvo) : [];
    } catch {
      return [];
    }
  });
  const [sacolaAberta, setSacolaAberta] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SACOLA, JSON.stringify(sacola));
    } catch {
      // Ignora erro de quota/storage
    }
  }, [sacola]);

  const adicionarNaSacola = useCallback((novoItem) => {
    const cartItemId = `${novoItem.produtoId}-${novoItem.tamanho}`;
    setSacola((prev) => {
      const jaExiste = prev.some((item) => item.cartItemId === cartItemId);
      if (jaExiste) return prev;
      return [...prev, { ...novoItem, cartItemId }];
    });
  }, []);

  const removerDaSacola = useCallback((cartItemId) => {
    setSacola((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  }, []);

  const limparSacola = useCallback(() => {
    setSacola([]);
    setSacolaAberta(false);
  }, []);

  const carregarCatalogo = useCallback(async (forcarRefresh = false) => {
    try {
      if (forcarRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setErro(null);

      const endpoint = forcarRefresh ? `${API_URL}?refresh=true` : API_URL;

      // Requisição GET simples sem headers customizados para evitar preflight CORS no Google Apps Script
      const response = await fetch(endpoint);

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data || data.sucesso === false) {
        throw new Error(data?.erro || 'Não foi possível carregar o catálogo.');
      }

      const categoriasNormalizadas = (data.categorias || []).map((cat) => ({
        ...cat,
        tamanhos: Array.isArray(cat.tamanhos)
          ? [...cat.tamanhos].map(Number).sort((a, b) => a - b)
          : [],
        produtos: (cat.produtos || []).map((prod) => ({
          ...prod,
          thumbUrl: sanitizeUrl(prod.thumbUrl),
          zoomUrl: sanitizeUrl(prod.zoomUrl),
          driveLink: sanitizeUrl(prod.driveLink),
        })),
      }));

      setCategorias(categoriasNormalizadas);
      setAtualizadoEm(data.atualizadoEm || null);
    } catch (err) {
      console.error('Erro ao buscar catálogo:', err);
      setErro(
        'Não foi possível carregar o catálogo no momento. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarCatalogo(false);
  }, [carregarCatalogo]);

  // Extrai todas as numerações únicas disponíveis no catálogo
  const tamanhosDisponiveis = useMemo(() => {
    const setNumeros = new Set();
    categorias.forEach((cat) => {
      (cat.tamanhos || []).forEach((t) => setNumeros.add(Number(t)));
    });
    return Array.from(setNumeros).sort((a, b) => a - b);
  }, [categorias]);

  // Filtra categorias e produtos com base na categoria e numeração selecionadas
  const itensFiltrados = useMemo(() => {
    const lista = [];

    categorias.forEach((cat) => {
      const bateCategoria =
        categoriaSelecionada === 'TODOS' ||
        cat.idCategoria === categoriaSelecionada;

      const bateTamanho =
        tamanhoSelecionado === null ||
        (cat.tamanhos && cat.tamanhos.includes(tamanhoSelecionado));

      if (bateCategoria && bateTamanho) {
        (cat.produtos || []).forEach((produto) => {
          lista.push({
            produto,
            categoria: cat,
          });
        });
      }
    });

    return lista;
  }, [categorias, categoriaSelecionada, tamanhoSelecionado]);

  const limparFiltros = () => {
    setCategoriaSelecionada('TODOS');
    setTamanhoSelecionado(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 text-zinc-900">
      {/* Header Fixo */}
      <Header
        onRefresh={() => carregarCatalogo(true)}
        isRefreshing={refreshing || loading}
        atualizadoEm={atualizadoEm}
        totalSacola={sacola.length}
        onOpenSacola={() => setSacolaAberta(true)}
      />

      {/* Barra de Filtros (Categorias + Tamanhos) */}
      {!loading && !erro && categorias.length > 0 && (
        <FilterBar
          categorias={categorias}
          categoriaSelecionada={categoriaSelecionada}
          onSelectCategoria={setCategoriaSelecionada}
          tamanhosDisponiveis={tamanhosDisponiveis}
          tamanhoSelecionado={tamanhoSelecionado}
          onSelectTamanho={setTamanhoSelecionado}
        />
      )}

      {/* Conteúdo Principal */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 ${
          sacola.length > 0 ? 'pb-28' : ''
        }`}
      >
        {loading ? (
          <SkeletonGrid count={8} />
        ) : erro ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 max-w-md mx-auto my-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">
              Ops! Algo deu errado
            </h2>
            <p className="text-sm text-zinc-600 mb-5">{erro}</p>
            <button
              type="button"
              onClick={() => carregarCatalogo(false)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
          </div>
        ) : itensFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 max-w-md mx-auto my-8 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center mx-auto mb-4">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-zinc-900 mb-1">
              Nenhum calçado encontrado
            </h2>
            <p className="text-sm text-zinc-600 mb-5">
              Não encontramos modelos para a combinação de filtros selecionada.
            </p>
            {(categoriaSelecionada !== 'TODOS' ||
              tamanhoSelecionado !== null) && (
              <button
                type="button"
                onClick={limparFiltros}
                className="inline-flex items-center justify-center px-5 py-2.5 min-h-[40px] rounded-xl bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-800 transition-all"
              >
                Ver todos os modelos
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Contador de resultados */}
            <div className="flex items-center justify-between mb-3 px-1">
              <p className="text-xs sm:text-sm text-zinc-500">
                Exibindo{' '}
                <strong className="text-zinc-800">
                  {itensFiltrados.length}
                </strong>{' '}
                {itensFiltrados.length === 1 ? 'modelo' : 'modelos'}
                {tamanhoSelecionado !== null && (
                  <span>
                    {' '}
                    no tamanho{' '}
                    <strong className="text-zinc-800">
                      {tamanhoSelecionado}
                    </strong>
                  </span>
                )}
              </p>

              {(categoriaSelecionada !== 'TODOS' ||
                tamanhoSelecionado !== null) && (
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 underline underline-offset-2"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Grid de Produtos: 2 colunas mobile, 3 tablet, 4 desktop */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {itensFiltrados.map(({ produto, categoria }) => (
                <ProductCard
                  key={`${categoria.idCategoria}-${produto.id}`}
                  produto={produto}
                  categoria={categoria}
                  tamanhoFiltroGlobal={tamanhoSelecionado}
                  onOpenZoom={(prod, cat) =>
                    setZoomItem({ produto: prod, categoria: cat })
                  }
                  onAddToCart={adicionarNaSacola}
                  itensSacola={sacola}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal / Lightbox de Zoom */}
      <ImageModal item={zoomItem} onClose={() => setZoomItem(null)} />

      {/* Barra Inferior Flutuante + Drawer da Sacola de Interesse */}
      <CartDrawer
        itens={sacola}
        aberto={sacolaAberta}
        onOpen={() => setSacolaAberta(true)}
        onClose={() => setSacolaAberta(false)}
        onRemoveItem={removerDaSacola}
        onClearCart={limparSacola}
      />
    </div>
  );
}
