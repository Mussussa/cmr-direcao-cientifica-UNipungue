import { useState, useEffect } from 'react';
import { client } from '../lib/sanity';
import { Filter } from 'lucide-react';

export default function Projetos() {
  const [projetos, setProjetos] = useState([]);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  useEffect(() => {
    // Busca os projetos e a URL da imagem
    const query = '*[_type == "projeto"] | order(_createdAt desc) {_id, titulo, investigadorPrincipal, membros, duracao, instituicaoFinanciadora, estado, faculdade, extensao, resumo, "imagemUrl": imagem.asset->url}';
    
    client.fetch(query)
      .then((data) => setProjetos(data))
      .catch(console.error);
  }, []);

  const projetosFiltrados = projetos.filter((proj) => {
    return filtroEstado === '' || proj.estado === filtroEstado;
  });

  // Função para formatar o texto do estado
  const formatarEstado = (estado) => {
    switch(estado) {
      case 'em_curso': return 'Em curso';
      case 'concluido': return 'Concluído';
      case 'em_aprovacao': return 'Em aprovação';
      default: return estado;
    }
  };

  // Cores dinâmicas baseadas no estado
  const corDoEstado = (estado) => {
    switch(estado) {
      case 'em_curso': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'em_aprovacao': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Projetos de Investigação</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        
        <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
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

            <div className={`flex flex-col gap-4 ${filtrosAbertos ? 'block' : 'hidden lg:flex'}`}>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Estado do Projeto</label>
                <select 
                  className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Todos os Estados</option>
                  <option value="em_curso">Em Curso</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Resultados da Pesquisa</h3>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
              {projetosFiltrados.length} {projetosFiltrados.length === 1 ? 'projeto' : 'projetos'}
            </span>
          </div>

          {projetosFiltrados.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">Nenhum projeto encontrado.</p>
              <button 
                onClick={() => setFiltroEstado('')}
                className="mt-4 text-blue-600 hover:underline font-medium"
              >
                Limpar filtros
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {projetosFiltrados.map((proj) => (
                <article key={proj._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col md:flex-row gap-6">
                  
                  {proj.imagemUrl && (
                    <div className="md:w-1/4 flex-shrink-0">
                      <img 
                        src={proj.imagemUrl} 
                        alt={proj.titulo} 
                        className="w-full h-32 md:h-full object-cover rounded-md"
                      />
                    </div>
                  )}

                  <div className="flex-grow flex flex-col">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {proj.estado && (
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider ${corDoEstado(proj.estado)}`}>
                          {formatarEstado(proj.estado)}
                        </span>
                      )}
                      {proj.faculdade && (
                        <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider">
                          {proj.faculdade}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 mb-4">{proj.titulo}</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-gray-700">
                      <p><span className="font-semibold text-gray-900">Investigador Principal:</span> {proj.investigadorPrincipal}</p>
                      {proj.instituicaoFinanciadora && <p><span className="font-semibold text-gray-900">Financiamento:</span> {proj.instituicaoFinanciadora}</p>}
                      {proj.duracao && <p><span className="font-semibold text-gray-900">Duração:</span> {proj.duracao}</p>}
                      {proj.membros && <p className="md:col-span-2"><span className="font-semibold text-gray-900">Equipa:</span> {proj.membros}</p>}
                    </div>
                    
                    {proj.resumo && (
                      <p className="text-gray-600 leading-relaxed border-t pt-4 mt-2">
                        {proj.resumo}
                      </p>
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