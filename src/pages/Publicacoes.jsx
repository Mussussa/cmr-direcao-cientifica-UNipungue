import { useState, useEffect } from 'react';
import { client } from '../lib/sanity';

export default function Publicacoes() {
  const [publicacoes, setPublicacoes] = useState([]);

  useEffect(() => {
    // Busca os dados e resolve o URL do ficheiro PDF anexado
    const query = '*[_type == "publicacao"] | order(dataPublicacao desc) {_id, titulo, autores, dataPublicacao, resumo, link, "arquivoUrl": ficheiro.asset->url}';
    
    client.fetch(query)
      .then((data) => setPublicacoes(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Produção Científica</h1>
      
      {publicacoes.length === 0 ? (
        <p className="text-gray-600">Nenhuma publicação inserida no momento.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {publicacoes.map((pub) => (
            <div key={pub._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-xl font-bold text-blue-700 mb-2">{pub.titulo}</h2>
              <p className="text-sm text-gray-600 mb-2"><span className="font-semibold">Autores:</span> {pub.autores}</p>
              {pub.dataPublicacao && (
                <p className="text-sm text-gray-500 mb-4">
                  Publicado em: {new Date(pub.dataPublicacao).toLocaleDateString('pt-PT')}
                </p>
              )}
              <p className="text-gray-700 mb-4">{pub.resumo}</p>
              
              <div className="flex gap-4 mt-4">
                {pub.arquivoUrl && (
                  <a href={pub.arquivoUrl} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-sm">
                    Descarregar PDF
                  </a>
                )}
                {pub.link && (
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition text-sm">
                    Ver Online
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}