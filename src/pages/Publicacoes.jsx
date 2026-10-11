import { useState, useEffect } from 'react';
import { client } from '../lib/sanity';
import { Filter } from 'lucide-react';

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState([]);
  
  // Estados para controlar os filtros selecionados
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFaculdade, setFiltroFaculdade] = useState('');
  const [filtroExtensao, setFiltroExtensao] = useState('');
  const [filtroAno, setFiltroAno] = useState('');
  
  // Estado para abrir/fechar filtros no mobile
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    const query = '*[_type == "publicacao"] | order(dataPublicacao desc) {_id, titulo, autores, dataPublicacao, resumo, link, categoria, faculdade, extensao, "arquivoUrl": ficheiro.asset->url}';
    
    client.fetch(query)
      .then((data) => setPublicacoes(data))
      .catch(console.error);
  }, []);

  // Extrai os anos únicos das publicações recebidas (ex: "2026", "2025")
  const anosDisponiveis = [...new Set(
    publicacoes
      .map(pub => pub.dataPublicacao ? pub.dataPublicacao.substring(0, 4) : null)
      .filter(Boolean)
  )].sort((a, b) => b - a); // Ordena do mais recente para o mais antigo

  // Lógica de filtragem no cliente (frontend)
  const publicacoesFiltradas = publicacoes.filter((pub) => {
    const matchCategoria = filtroCategoria === '' || pub.categoria === filtroCategoria;
    const matchFaculdade = filtroFaculdade === '' || pub.faculdade === filtroFaculdade;
    const matchExtensao = filtroExtensao === '' || pub.extensao === filtroExtensao;
    const matchAno = filtroAno === '' || (pub.dataPublicacao && pub.dataPublicacao.startsWith(filtroAno));
    
    return matchCategoria && matchFaculdade && matchExtensao && matchAno;
  });

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Produção Científica</h1>
      
      {/* Container Principal: Coluna no mobile, Linha no PC */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ASIDE - Barra de Filtros */}
        {/* No PC, tem 25% da largura (lg:w-1/4) e fica "colada" no topo ao fazer scroll (sticky top-24) */}
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
            
            {/* Cabeçalho do Aside com botão para mostrar/esconder no mobile */}
            <div 
              className="flex justify-between items-center cursor-pointer lg:cursor-default mb-4"
              onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            >
              <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                <Filter size={20} className="text-blue-600" />
                Filtros
              </h2>
              <span className="lg:hidden text-blue-600 font-medium">
                {filtrosAbertos ? 'Ocultar' : 'Mostrar'}
              </span>
            </div>

            {/* Campos de filtro (escondidos no mobile até se clicar em "Mostrar") */}
            <div className={`flex flex-col gap-4 ${filtrosAbertos ? 'block' : 'hidden lg:flex'}`}>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Ano de Publicação</label>
                <select 
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                  value={filtroAno}
                  onChange={(e) => setFiltroAno(e.target.value)}
                >
                  <option value="">Todos os Anos</option>
                  {anosDisponiveis.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Categoria</label>
                <select 
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="">Todas as Categorias</option>
                  <option value="artigo">Artigo Científico</option>
                  <option value="monografia">Monografia</option>
                  <option value="livro">Livro / E-book</option>
                  <option value="revista">Revista Científica</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Unidade Orgânica</label>
                <select 
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                  value={filtroFaculdade}
                  onChange={(e) => setFiltroFaculdade(e.target.value)}
                >
                  <option value="">Todas as Unidades</option>
                  <option value="fcab">Faculdade de Ciências Agrárias e Biológicas</option>
                  <option value="facet">Faculdade de Ciências Exactas e Tecnológicas</option>
                  <option value="fe">Faculdade de Educação</option>
                  <option value="feng">Faculdade de Engenharia</option>
                  <option value="fga">Faculdade de Geociências e Ambiente</option>
                  <option value="flcsh">Faculdade de Letras, Ciências Sociais e Humanidades</option>
                  <option value="isefd">Instituto Superior de Educação Física e Desporto</option>
                  <option value="esce">Escola Superior de Ciências Económicas</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Campus</label>
                <select 
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                  value={filtroExtensao}
                  onChange={(e) => setFiltroExtensao(e.target.value)}
                >
                  <option value="">Todos os Campus</option>
                  <option value="chimoio">Sede (Chimoio)</option>
                  <option value="tete">Extensão de Tete</option>
                </select>
              </div>

            </div>
          </div>
        </aside>
        
        {/* MAIN - Lista de Publicações */}
        {/* No PC, ocupa 75% do espaço restante (lg:w-3/4) */}
        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Resultados da Pesquisa</h3>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
              {publicacoesFiltradas.length} {publicacoesFiltradas.length === 1 ? 'publicação' : 'publicações'}
            </span>
          </div>

          {publicacoesFiltradas.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">Nenhuma publicação encontrada para os filtros selecionados.</p>
              <button 
                onClick={() => {
                  setFiltroCategoria(''); setFiltroFaculdade(''); setFiltroExtensao(''); setFiltroAno('');
                }}
                className="mt-4 text-blue-600 hover:underline font-medium"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {publicacoesFiltradas.map((pub) => (
                <article key={pub._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
                  
                  {/* Etiquetas Visuais (Tags) */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {pub.dataPublicacao && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {pub.dataPublicacao.substring(0, 4)}
                      </span>
                    )}
                    {pub.categoria && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {pub.categoria}
                      </span>
                    )}
                    {pub.extensao && (
                      <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {pub.extensao}
                      </span>
                    )}
                    {pub.faculdade && (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                        {pub.faculdade}
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-2">{pub.titulo}</h2>
                  <p className="text-sm text-gray-600 mb-1"><span className="font-semibold">Autores:</span> {pub.autores}</p>
                  
                  {pub.dataPublicacao && (
                    <p className="text-sm text-gray-500 mb-4">
                      Data: {new Date(pub.dataPublicacao).toLocaleDateString('pt-PT')}
                    </p>
                  )}
                  
                  <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">{pub.resumo}</p>
                  
                  <div className="flex gap-4">
                    {pub.arquivoUrl && (
                      <a href={pub.arquivoUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition text-sm font-medium">
                        Descarregar PDF
                      </a>
                    )}
                    {pub.link && (
                      <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 border border-blue-600 px-5 py-2 rounded-md hover:bg-blue-50 transition text-sm font-medium">
                        Ver Online
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
        
      </div>
    </div>
  );
}