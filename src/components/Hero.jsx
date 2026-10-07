export default function Hero({ data }) {
  return (
    <div 
      className="relative w-full h-[60vh] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${data.imagemFundo})` }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.titulo}</h1>
        <p className="text-xl md:text-2xl">{data.subtitulo}</p>
      </div>
    </div>
  );
}