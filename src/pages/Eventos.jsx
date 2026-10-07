import { useState, useEffect } from 'react';
import { client, urlFor } from '../lib/sanity';

export default function Eventos() {
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Busca os eventos ordenados da data mais recente para a mais antiga
    client.fetch('*[_type == "evento"] | order(data desc)')
      .then((data) => setEventos(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Eventos e Conferências</h1>
      
      {eventos.length === 0 ? (
        <p className="text-gray-600">Nenhum evento publicado no momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventos.map((evento) => (
            <div key={evento._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {evento.cartaz && (
                <img 
                  src={urlFor(evento.cartaz).url()} 
                  alt={evento.titulo} 
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{evento.titulo}</h2>
                {evento.data && (
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    {new Date(evento.data).toLocaleDateString('pt-PT')}
                  </p>
                )}
                {evento.local && <p className="text-sm text-gray-500 mb-3">{evento.local}</p>}
                <p className="text-gray-700 text-sm line-clamp-3">{evento.descricao}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}