import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero({ data }) {
  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Imagem de Fundo com zoom out mais longo */}
      <motion.div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${data.imagemFundo})` }}
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto flex flex-col items-center">
        
        {/* Título: Entrada com Zoom + Pulsação de brilho infinita */}
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            textShadow: [
              "0px 4px 15px rgba(0,0,0,0.6)", 
              "0px 4px 30px rgba(255,255,255,0.4)", 
              "0px 4px 15px rgba(0,0,0,0.6)"
            ]
          }}
          transition={{ 
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.8, ease: "easeOut" },
            // A animação do brilho repete infinitamente e começa depois da entrada
            textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 } 
          }}
        >
          {data.titulo}
        </motion.h1>
        
        {/* Subtítulo: Entrada lateral (wrapper) + Flutuação infinita (p) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <motion.p 
            className="text-xl md:text-2xl font-light text-gray-100"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {data.subtitulo}
          </motion.p>
        </motion.div>

        {/* Indicador de Scroll: Aparece com delay e pula infinitamente */}
        <motion.div
          className="mt-12 text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: 1.2, duration: 1 },
            y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <ChevronDown size={36} />
        </motion.div>

      </div>
    </div>
  );
}