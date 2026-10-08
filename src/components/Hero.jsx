import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero({ data }) {
  // Garante que a data é um array. Se o Sanity enviar apenas um objeto, transforma-o num array.
  const slides = Array.isArray(data) ? data : [data];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Se houver apenas 1 slide, não faz sentido ativar o temporizador
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 10000); // 5000 milissegundos = 5 segundos

    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        {/* Usamos a key para o Framer Motion saber quando desmontar o slide antigo e montar o novo */}
        <motion.div
          key={currentSlide._id || currentIndex}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Imagem de Fundo com zoom out contínuo durante a visualização */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.imagemFundo})` }}
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: "easeOut" }}
          />
          
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-4 max-w-4xl mx-auto">
            
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
                textShadow: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 } 
              }}
            >
              {currentSlide.titulo}
            </motion.h1>
            
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
                {currentSlide.subtitulo}
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* O indicador de Scroll fica fora do AnimatePresence para não piscar durante a troca de slides */}
      <motion.div
        className="absolute bottom-8 text-white/70 z-20"
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
  );
}