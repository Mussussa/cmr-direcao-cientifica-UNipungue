export default function CardEquipa({ membro }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-6 text-center transition hover:shadow-lg">
      <div className="w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-blue-50">
        <img 
          src={membro.imagem} 
          alt={membro.nome} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800">{membro.nome}</h3>
      <p className="text-sm text-gray-500 mt-2">{membro.cargo}</p>
    </div>
  );
}