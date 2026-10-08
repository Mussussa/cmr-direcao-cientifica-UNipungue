import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { client, urlFor } from '../lib/sanity';

export default function Home() {
  // Alterado para iniciar como array vazio em vez de null
  const [heroData, setHeroData] = useState([]);
  const [destaques, setDestaques] = useState([]);
  const [publicacoes, setPublicacoes] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [heroResult, destaquesResult, publicacoesResult] = await Promise.all([
          // CRÍTICO: Consulta alterada para trazer todos os slides (sem o [0] no final)
          client.fetch('*[_type == "hero"]'),
          client.fetch('*[_type == "evento"] | order(data desc)[0...3]'),
          client.fetch('*[_type == "publicacao"] | order(data desc)[0...3]')
        ]);
        
        setHeroData(heroResult);
        setDestaques(destaquesResult);
        setPublicacoes(publicacoesResult);
      } catch (error) {
        console.error("Erro ao buscar dados do Sanity:", error);
      }
    };

    fetchHomeData();
  }, []);

  if (!heroData || heroData.length === 0) {
    return <div className="h-[60vh] flex items-center justify-center font-medium text-gray-500">A carregar informações...</div>;
  }

  // CRÍTICO: Prepara o array de slides para o Hero
  const formattedHeroData = heroData.map(hero => ({
    _id: hero._id,
    titulo: hero.titulo,
    subtitulo: hero.subtitulo,
    imagemFundo: hero.imagemFundo ? urlFor(hero.imagemFundo).url() : ''
  }));

  return (
    <div>
      {/* Passa o array formatado para o componente Hero */}
      <Hero data={formattedHeroData} />
      
      {/* Secção de Eventos */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Notícias e Destaques</h2>
        
        {destaques.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum destaque disponível no momento.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destaques.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition hover:shadow-lg border border-gray-100">
                {item.cartaz ? (
                  <img 
                    src={urlFor(item.cartaz).url()} 
                    alt={item.titulo} 
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400 font-medium">
                    Sem imagem
                  </div>
                )}
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.titulo}</h3>
                  {item.data && (
                    <p className="text-sm text-blue-600 font-semibold mb-3">
                      {new Date(item.data).toLocaleDateString('pt-PT')}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.descricao}
                  </p>
                  <Link to={`/eventos/${item._id}`} className="text-blue-600 font-medium hover:underline mt-auto inline-block">
                    Ler mais &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {destaques.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/eventos" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium inline-block shadow-sm">
              Ver todos os Eventos
            </Link>
          </div>
        )}
      </section>

      {/* Secção de Produção Científica */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Produção Científica Recente</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descobre os artigos, monografias e publicações mais recentes desenvolvidos pelos investigadores da Universidade Púnguè.
            </p>
          </div>

          {publicacoes.length === 0 ? (
            <p className="text-center text-gray-600">Nenhuma publicação disponível no momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {publicacoes.map((pub) => (
                <div key={pub._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition flex flex-col">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                    {pub.categoria || 'Artigo Científico'}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{pub.titulo}</h3>
                  <p className="text-sm text-gray-500 mb-4">Por: <span className="font-medium text-gray-700">{pub.autor}</span></p>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-6 flex-grow">
                    {pub.resumo}
                  </p>
                  <Link to={`/publicacoes/${pub._id}`} className="text-blue-600 font-medium hover:underline mt-auto">
                    Aceder à publicação &rarr;
                  </Link>
                </div>
              ))}
            </div>
          )}

          {publicacoes.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/publicacoes" className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 transition font-medium inline-block">
                Explorar Repositório Completo
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}