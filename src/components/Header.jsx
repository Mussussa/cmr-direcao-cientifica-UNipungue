import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-4">
          <img 
            src="https://static.wixstatic.com/media/eb85cd_6930e534255d430388d168f93093e0de~mv2.png" 
            alt="Logo Direção Científica UPúnguè" 
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold text-xl text-gray-800">Direção Científica</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 font-medium text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition">Início</Link>
          <Link to="/equipa" className="hover:text-blue-600 transition">Nossa Equipa</Link>
          <Link to="/publicacoes" className="hover:text-blue-600 transition">Produção Científica</Link>
          <Link to="/eventos" className="hover:text-blue-600 transition">Eventos</Link>
        </nav>
      </div>
    </header>
  );
}