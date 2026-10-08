import { motion } from 'framer-motion';

export default function Hero({ data }) {
  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de Fundo com animação suave de zoom out (Efeito Ken Burns) */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.imagemFundo})` }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      
      {/* Camada escura para dar contraste ao texto */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Conteúdo de Texto Animado */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          {data.titulo}
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl font-light drop-shadow-md text-gray-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        >
          {data.subtitulo}
        </motion.p>
      </div>
    </div>
  );
}