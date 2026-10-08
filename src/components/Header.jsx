import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img 
            src="https://static.wixstatic.com/media/eb85cd_6930e534255d430388d168f93093e0de~mv2.png" 
            alt="Logo Direção Científica UPúnguè" 
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold text-xl text-gray-800">Direção Científica</span>
        </Link>
        
        {/* Navegação Desktop */}
        <nav className="hidden md:flex gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition">Início</Link>
          <Link to="/equipa" className="hover:text-blue-600 transition">Nossa Equipa</Link>
          <Link to="/publicacoes" className="hover:text-blue-600 transition">Produção Científica</Link>
          <Link to="/eventos" className="hover:text-blue-600 transition">Eventos</Link>
        </nav>

        {/* Botão Hambúrguer (Mobile) */}
        <button 
          className="md:hidden text-gray-600 hover:text-blue-600 p-2"
          onClick={toggleMenu}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Navegação Mobile */}
      {isMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-100 flex flex-col absolute w-full left-0 shadow-lg px-4 pt-2 pb-6 gap-4 font-medium text-gray-600">
          <Link to="/" onClick={toggleMenu} className="hover:text-blue-600 transition block py-2 border-b border-gray-50">Início</Link>
          <Link to="/equipa" onClick={toggleMenu} className="hover:text-blue-600 transition block py-2 border-b border-gray-50">Nossa Equipa</Link>
          <Link to="/publicacoes" onClick={toggleMenu} className="hover:text-blue-600 transition block py-2 border-b border-gray-50">Produção Científica</Link>
          <Link to="/eventos" onClick={toggleMenu} className="hover:text-blue-600 transition block py-2">Eventos</Link>
        </nav>
      )}
    </header>
  );
}