# CONTEXT.md - Catálogo Dinâmico de Calçados (Drive + GAS API + WhatsApp)

## 1. Visão Geral do Projeto
Aplicação web **Mobile-First** de catálogo de calçados que consome dados dinamicamente de uma pasta pública do Google Drive através de uma API em **Google Apps Script (GAS)** e permite aos clientes selecionar a numeração desejada e enviar o pedido (com link/preview da foto) diretamente para o **WhatsApp** da vendedora.

- **Objetivo Principal:** Zero manutenção de banco de dados ou planilhas para a lojista. Ela apenas adiciona/remove fotos nas pastas do Google Drive pelo celular e o site reflete as mudanças automaticamente.
- **Hospedagem do Front-end:** Vercel (SPA estática).
- **Hospedagem do Back-end:** Google Apps Script (Web App retornando JSON com cache via `CacheService`).

---

## 2. Stack Tecnológica (Front-end)
- **Framework:** React (com Vite) + JavaScript/TypeScript.
- **Estilização:** TailwindCSS (Design Mobile-First, limpo, moderno e focado em conversão).
- **Ícones:** `lucide-react`.
- **Gerenciamento de Estado:** React Hooks nativos (`useState`, `useEffect`, `useMemo`) + `localStorage` (para persistir a Sacola de Interesse).

---

## 3. Arquitetura e Contrato da API (Back-end GAS)

### Endpoint de Consumo
- Definido em `src/config.js` (ou `.env`) na constante `https://script.google.com/macros/s/AKfycby6vKsrdk0PlUCUR_wMWm6gVQU2HwMHO9PrMvA_87mSVL6Z9zh2z-1y34839ohh-vCO/exec`.
- Para forçar a limpeza do cache no Google Apps Script, basta realizar um `GET` em `${API_URL}?refresh=true`.

### ⚠️ Regra Crítica de CORS no Fetch (Google Apps Script)
O Google Apps Script redireciona requisições (`HTTP 302`) para `script.googleusercontent.com`. 
- **NUNCA** envie headers customizados (como `Content-Type: application/json` ou `Authorization`) na requisição `fetch()`, pois isso dispara uma requisição *preflight* (`OPTIONS`) que o Google Apps Script bloqueia por CORS.
- Faça sempre um `fetch(API_URL)` simples (GET padrão).

### Formato do Payload JSON Retornado pela API
```json
{
  "sucesso": true,
  "atualizadoEm": "2026-11-10T12:00:00.000Z",
  "categorias": [
    {
      "idCategoria": "string",
      "nomeExibicao": "3 A. Pares do 34 ao 39.",
      "nomeOriginal": "3 A. Pares do 34 ao 39.",
      "tamanhos": [34, 35, 36, 37, 38, 39],
      "totalProdutos": 12,
      "produtos": [
        {
          "id": "string",
          "nomeArquivo": "IMG-20261102-WA0522.jpg",
          "dataCriacao": 1730548800000,
          "thumbUrl": "[https://drive.google.com/thumbnail?id=ID_ARQUIVO&sz=w600](https://drive.google.com/thumbnail?id=ID_ARQUIVO&sz=w600)",
          "zoomUrl": "[https://drive.google.com/thumbnail?id=ID_ARQUIVO&sz=w1200](https://drive.google.com/thumbnail?id=ID_ARQUIVO&sz=w1200)",
          "driveLink": "[https://drive.google.com/file/d/ID_ARQUIVO/view](https://drive.google.com/file/d/ID_ARQUIVO/view)"
        }
      ]
    }
  ]
}
4. Regras Críticas de Renderização de Imagens do Google Drive
Atributo Obrigatório (referrerPolicy="no-referrer"):

TODAS as tags <img /> que renderizam thumbUrl ou zoomUrl DEVEM conter o atributo referrerPolicy="no-referrer".

Motivo: Sem isso, a CDN do Google Drive retorna erro 403 Forbidden quando acessada repetidamente a partir de um domínio externo (*.vercel.app).

Performance Mobile:

Utilize sempre loading="lazy" nas imagens do grid.

Use thumbUrl (w600) nos cards da listagem e carregue zoomUrl (w1200) apenas quando o usuário abrir o Modal/Lightbox de zoom.

Nomes de Arquivos:

Os arquivos no Drive têm nomes gerados pelo WhatsApp (ex: IMG-20261102-WA0522.jpg). Não exiba o nomeArquivo em destaque no card para o cliente final (ou exiba apenas como código discreto de referência), pois o foco visual é 100% na foto do calçado.

5. Regras de Negócio e Funcionalidades de UI/UX
5.1. Filtros Duplos (Categoria + Numeração)
Filtro por Categoria: Barra horizontal deslizante (overflow-x-auto no-scrollbar) com botões estilo pill ("Todos" + cada categoria retornada pela API).

Filtro por Tamanho ("Qual seu número?"): Barra secundária com todas as numerações únicas disponíveis no catálogo (ex: 34 ao 43). Ao clicar em um número (ex: 37), exibir apenas os calçados de categorias que contenham o número 37 e já pré-selecionar esse tamanho nos cards visíveis para agilizar a compra.

5.2. Card de Produto
Foto quadrada (aspect-square, object-cover) com ícone discreto de lupa indicando que pode ser ampliada ao clicar.

Seletor de tamanhos disponíveis naquela pasta (botões clicáveis). O botão ativo deve ter alto contraste (ex: bg-zinc-900 text-white).

Ações do Card:

Pedir Agora (WhatsApp Direto): Envia apenas aquele par imediatamente, desde que um tamanho tenha sido selecionado.

Adicionar à Sacola: Adiciona o par + tamanho escolhido na sacola flutuante para o cliente pedir vários pares de uma só vez.

Validação de Tamanho: Se o cliente clicar em "Pedir" ou "Adicionar" sem selecionar o tamanho, exibir um feedback visual claro (shake/borda vermelha nos tamanhos ou toast: "Selecione a numeração primeiro").

5.3. Sacola de Interesse e Envio para WhatsApp
Barra Inferior Flutuante (Floating Bar): Aparece quando há 
≥1 item na sacola, mostrando o total de pares e o botão "Ver Sacola / Finalizar".

Drawer/Modal da Sacola: Lista os itens com miniatura (thumbUrl), categoria, tamanho escolhido e botão de remover.

Formatação da Mensagem do WhatsApp (https://wa.me/):
TELEFONE DO WHATSAPP:+55 11 94782-7992

Pedido Único:

Plaintext
Olá! Gostei deste modelo do catálogo:

*Categoria:* {nomeExibicao}
*Tamanho:* {tamanho}
*Foto do modelo:* {driveLink}

Ainda está disponível?
Pedido Múltiplo (Sacola):

Plaintext
Olá! Separei estes modelos no catálogo e gostaria de saber se estão disponíveis:

1. *Categoria:* {nomeExibicao} | *Tamanho:* {tamanho}
Foto: {driveLink}

2. *Categoria:* {nomeExibicao} | *Tamanho:* {tamanho}
Foto: {driveLink}
6. Estrutura de Pastas Sugerida
Plaintext
src/
├── components/
│   ├── Header.jsx          # Topo fixo + botão discreto de refresh do cache
│   ├── FilterBar.jsx       # Filtros de Categoria e de Numeração
│   ├── ProductCard.jsx     # Card com seletor de tamanho e botões de ação
│   ├── ImageModal.jsx      # Lightbox para dar zoom na foto (zoomUrl)
│   ├── CartDrawer.jsx      # Sacola lateral/modal para múltiplos pares
│   └── SkeletonGrid.jsx    # Loading state elegante
├── config.js               # Centraliza API_URL, WHATSAPP_NUMBER, STORE_NAME
├── App.jsx                 # Estado global do catálogo, filtros e sacola
└── main.jsx
7. Diretrizes de Código para o Agente
Mantenha todas as configurações da cliente isoladas em src/config.js para fácil manutenção.

Priorize usabilidade de polegar (botões com boa área de toque, mínimo 40px de altura nas ações principais).

Trate estados vazios (nenhum produto encontrado para o filtro selecionado) e estados de erro da API com botão de "Tentar novamente".


### Como usar no Antigravity:
1. Crie a pasta do projeto e salve esse arquivo como **`CONTEXT.md`** (ou `.cursorrules` / `AGENTS.md`, dependendo de como preferir referenciar).
2. No chat do agente, basta digitar:
   > *"Leia o arquivo `@CONTEXT.md` e construa toda a aplicação seguindo rigorosamente a arquitetura, regras de imagem do Google Drive e fluxos de UX especificados."*