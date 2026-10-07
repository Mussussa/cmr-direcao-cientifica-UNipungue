import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import { client, urlFor } from '../lib/sanity';

export default function Home() {
  const [heroData, setHeroData] = useState(null);
  const [destaques, setDestaques] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Promise.all permite buscar o Hero e os Destaques em simultâneo (mais rápido)
        const [heroResult, destaquesResult] = await Promise.all([
          client.fetch('*[_type == "hero"][0]'),
          // Busca os 3 eventos mais recentes baseados na data
          client.fetch('*[_type == "evento"] | order(data desc)[0...3]') 
        ]);
        
        setHeroData(heroResult);
        setDestaques(destaquesResult);
      } catch (error) {
        console.error("Erro ao buscar dados do Sanity:", error);
      }
    };

    fetchHomeData();
  }, []);

  if (!heroData) {
    return <div className="h-[60vh] flex items-center justify-center">A carregar informações...</div>;
  }

  const formattedData = {
    titulo: heroData.titulo,
    subtitulo: heroData.subtitulo,
    imagemFundo: heroData.imagemFundo ? urlFor(heroData.imagemFundo).url() : ''
  };

  return (
    <div>
      <Hero data={formattedData} />
      
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
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
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
                  {/* A classe line-clamp-3 corta o texto caso seja muito longo */}
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-grow">
                    {item.descricao}
                  </p>
                  <Link to="/eventos" className="text-blue-600 font-medium hover:underline mt-auto inline-block">
                    Ler mais &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {destaques.length > 0 && (
          <div className="text-center mt-10">
            <Link to="/eventos" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition font-medium">
              Ver todos os Eventos
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}