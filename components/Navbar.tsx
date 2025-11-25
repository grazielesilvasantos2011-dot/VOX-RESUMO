import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mic, Layout, Plus } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();
  const isApp = location.pathname.startsWith('/app');

  const handlePricingClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
        e.preventDefault();
        const element = document.getElementById('pricing');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            // Update URL hash manually to reflect the section
            window.history.pushState(null, '', '/#pricing');
        }
    }
  };

  return (
    <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Mic className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">VoxResumo</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {isApp ? (
              <>
                <Link to="/app/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium flex items-center gap-1">
                  <Layout className="w-4 h-4" /> Dashboard
                </Link>
                <Link to="/app/new" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Novo Projeto
                </Link>
              </>
            ) : (
              <>
                <Link to="/features" className="text-gray-600 hover:text-indigo-600 font-medium">Funcionalidades</Link>
                <Link 
                  to="/#pricing" 
                  onClick={handlePricingClick}
                  className="text-gray-600 hover:text-indigo-600 font-medium"
                >
                  Preços
                </Link>
                <Link to="/login" className="text-indigo-600 font-medium hover:bg-indigo-50 px-4 py-2 rounded-lg transition">
                  Entrar
                </Link>
                <Link to="/signup" className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                  Começar Grátis
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;