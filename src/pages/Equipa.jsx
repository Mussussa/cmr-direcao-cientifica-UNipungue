import { useState, useEffect } from 'react';
import CardEquipa from '../components/CardEquipa';
import { client, urlFor } from '../lib/sanity';

export default function Equipa() {
  const [equipa, setEquipa] = useState([]);

  useEffect(() => {
    // Procura todos os membros e ordena do menor para o maior (ordem asc)
    client.fetch('*[_type == "membro"] | order(ordem asc)')
      .then((data) => setEquipa(data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Nossa Equipa</h1>
      
      {equipa.length === 0 ? (
        <p className="text-center text-gray-500">A carregar equipa...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipa.map((membro) => (
            <CardEquipa 
              key={membro._id} 
              membro={{
                nome: membro.nome,
                cargo: membro.cargo,
                // Extrai o URL real da imagem, se ela existir
                imagem: membro.imagem ? urlFor(membro.imagem).url() : ''
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}