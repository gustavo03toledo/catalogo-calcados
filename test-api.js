import fs from 'node:fs';

// Carrega o arquivo .env automaticamente no Node.js (v20.12+ / v22+)
if (fs.existsSync('.env') && typeof process.loadEnvFile === 'function') {
  process.loadEnvFile('.env');
}

const { API_URL, WHATSAPP_NUMERO, NOME_LOJA } = await import('./src/config.js');

async function testarApi() {
  console.log('====================================================');
  console.log('🧪 TESTE DE CONEXÃO E CONTRATO DA API (APPS SCRIPT)');
  console.log('====================================================');

  if (!API_URL) {
    console.error('❌ Variável VITE_API_URL não encontrada! Verifique seu arquivo .env.');
    process.exit(1);
  }

  console.log(`📌 Loja:     ${NOME_LOJA}`);
  console.log(`📱 WhatsApp: ${WHATSAPP_NUMERO} (https://wa.me/${WHATSAPP_NUMERO})`);
  console.log(`🌐 API_URL:  ${API_URL}`);
  console.log('----------------------------------------------------');

  const inicio = Date.now();

  try {
    console.log('⏳ Fazendo requisição GET simples (sem headers customizados)...');
    const response = await fetch(API_URL);
    const tempoMs = Date.now() - inicio;

    console.log(`✅ Status HTTP: ${response.status} ${response.statusText} (${tempoMs}ms)`);
    console.log(`🔗 URL Final (após redirect 302): ${response.url}`);

    if (!response.ok) {
      throw new Error(`Falha HTTP ${response.status}`);
    }

    const texto = await response.text();
    let json;
    try {
      json = JSON.parse(texto);
    } catch {
      console.error('❌ A resposta não é um JSON válido. Primeiros 300 caracteres:');
      console.error(texto.slice(0, 300));
      process.exit(1);
    }

    console.log('----------------------------------------------------');
    console.log('📦 RESUMO DO PAYLOAD RETORNADO:');
    console.log(`- sucesso:       ${json.sucesso}`);
    console.log(`- atualizadoEm:  ${json.atualizadoEm}`);

    const categorias = Array.isArray(json.categorias) ? json.categorias : [];
    console.log(`- Categorias:    ${categorias.length}`);

    let totalProdutosGeral = 0;

    categorias.forEach((cat, idx) => {
      const qtdProdutos = Array.isArray(cat.produtos) ? cat.produtos.length : 0;
      totalProdutosGeral += qtdProdutos;
      console.log(
        `  [${idx + 1}] "${cat.nomeExibicao}" (ID: ${cat.idCategoria}) | Tamanhos: [${(cat.tamanhos || []).join(', ')}] | Produtos: ${qtdProdutos}`
      );

      if (qtdProdutos > 0) {
        const exemplo = cat.produtos[0];
        console.log(`      ↳ Exemplo Produto [0]:`);
        console.log(`        • id:          ${exemplo.id}`);
        console.log(`        • nomeArquivo: ${exemplo.nomeArquivo}`);
        console.log(`        • thumbUrl:    ${exemplo.thumbUrl}`);
        console.log(`        • zoomUrl:     ${exemplo.zoomUrl}`);
        console.log(`        • driveLink:   ${exemplo.driveLink}`);
      }
    });

    console.log('----------------------------------------------------');
    console.log(`🎉 TESTE CONCLUÍDO COM SUCESSO! Total de produtos no catálogo: ${totalProdutosGeral}`);
    console.log('====================================================');
  } catch (erro) {
    console.error('----------------------------------------------------');
    console.error('❌ ERRO AO TESTAR A API:', erro.message);
    console.error('====================================================');
    process.exit(1);
  }
}

testarApi();
