import { useState, useEffect } from 'react';
import { client, urlFor } from '../lib/sanity';
import { Filter, X } from 'lucide-react';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [filtroAno, setFiltroAno] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  
  // Novo estado para controlar a janela modal (o popup com z-index)
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  useEffect(() => {
    client.fetch('*[_type == "evento"] | order(data desc)')
      .then((data) => setEventos(data))
      .catch(console.error);
  }, []);

  const anosDisponiveis = [...new Set(
    eventos
      .map(evento => evento.data ? evento.data.substring(0, 4) : null)
      .filter(Boolean)
  )].sort((a, b) => b - a);

  const eventosFiltrados = eventos.filter((evento) => {
    return filtroAno === '' || (evento.data && evento.data.startsWith(filtroAno));
  });

  // Função para fechar o modal se o utilizador clicar na área escura do fundo
  const fecharModal = (e) => {
    if (e.target.id === 'modal-fundo') {
      setEventoSelecionado(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Eventos e Conferências</h1>
      
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
                <label className="text-xs font-semibold text-gray-500 uppercase">Ano do Evento</label>
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
            </div>
          </div>
        </aside>

        <main className="w-full lg:w-3/4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Resultados da Pesquisa</h3>
            <span className="text-sm font-medium bg-blue-100 text-blue-800 py-1 px-3 rounded-full">
              {eventosFiltrados.length} {eventosFiltrados.length === 1 ? 'evento' : 'eventos'}
            </span>
          </div>

          {eventosFiltrados.length === 0 ? (
            <div className="bg-white p-10 text-center rounded-lg border border-gray-200">
              <p className="text-gray-500 text-lg">Nenhum evento encontrado para o ano selecionado.</p>
              <button 
                onClick={() => setFiltroAno('')}
                className="mt-4 text-blue-600 hover:underline font-medium"
              >
                Limpar filtro
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventosFiltrados.map((evento) => (
                <article key={evento._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
                  {evento.cartaz ? (
                    <img 
                      src={urlFor(evento.cartaz).url()} 
                      alt={evento.titulo} 
                      className="w-full h-56 object-cover"
                    />
                  ) : (
                    <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
                      Sem imagem disponível
                    </div>
                  )}
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{evento.titulo}</h2>
                    
                    {evento.data && (
                      <p className="text-sm text-blue-600 font-semibold mb-1">
                        Data: {new Date(evento.data).toLocaleDateString('pt-PT')}
                      </p>
                    )}
                    
                    {evento.local && <p className="text-sm text-gray-500 mb-4 flex-grow">Local: {evento.local}</p>}
                    
                    <p className="text-gray-700 text-sm line-clamp-3 mb-6">
                      {evento.descricao}
                    </p>
                    
                    <button 
                      onClick={() => setEventoSelecionado(evento)}
                      className="mt-auto block text-center w-full bg-gray-50 text-blue-600 border border-gray-200 font-medium py-2 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                    >
                      Ver detalhes e cartaz
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* MODAL (Z-Index Overlay) */}
      {eventoSelecionado && (
        <div 
          id="modal-fundo"
          onClick={fecharModal}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 overflow-y-auto backdrop-blur-sm"
        >
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setEventoSelecionado(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white p-2 rounded-full text-gray-800 shadow-md transition"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col max-h-[90vh]">
              {eventoSelecionado.cartaz && (
                <div className="w-full bg-gray-100 flex-shrink-0 border-b border-gray-200 rounded-t-xl overflow-hidden">
                  <img 
                    src={urlFor(eventoSelecionado.cartaz).url()} 
                    alt={eventoSelecionado.titulo} 
                    className="w-full h-auto max-h-[50vh] object-contain mx-auto"
                  />
                </div>
              )}
              
              <div className="p-6 md:p-8 overflow-y-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{eventoSelecionado.titulo}</h2>
                
                <div className="flex flex-wrap gap-4 mb-6 border-b border-gray-100 pb-6">
                  {eventoSelecionado.data && (
                    <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded font-medium text-sm">
                      {new Date(eventoSelecionado.data).toLocaleDateString('pt-PT')}
                    </div>
                  )}
                  {eventoSelecionado.local && (
                    <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded font-medium text-sm">
                      {eventoSelecionado.local}
                    </div>
                  )}
                </div>
                
                {/* white-space-pre-wrap permite que os parágrafos do Sanity sejam respeitados na leitura */}
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {eventoSelecionado.descricao}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}