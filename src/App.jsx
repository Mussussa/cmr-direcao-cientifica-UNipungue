import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Eventos from './pages/Eventos';
import Publicacoes from './pages/Publicacoes';
import Equipa from './pages/Equipa';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="eventos" element={<Eventos />} />
          <Route path="publicacoes" element={<Publicacoes />} />
          <Route path="equipa" element={<Equipa />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}