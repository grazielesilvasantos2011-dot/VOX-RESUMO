
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import PricingCard from '../components/PricingCard'; // This component will no longer be used in the pricing section
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FileAudio, FileText, Zap, Layers, Clock, Shield, Check, Mic, X, CreditCard, Lock, Loader2 } from 'lucide-react';
import { PricingTier, UserPlanType } from '../types';
import { saveUserPlan } from '../services/storageService'; // Import saveUserPlan

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Removed showCheckout, selectedPlan, isProcessing states as per request

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Small timeout to ensure DOM is fully rendered before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  // Removed handleSelectPlan and handleConfirmPayment functions as per request

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Transforme áudio em <span className="text-indigo-600">conhecimento</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Transcrição automática, resumos inteligentes e insights valiosos de suas reuniões, aulas e podcasts em segundos usando IA avançada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
              Experimentar Agora
            </Link>
            <a 
              href="#pricing" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('pricing');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition"
            >
              Ver Planos
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Recursos</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tudo o que você precisa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <FileText className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Transcrição Precisa</h3>
              <p className="text-gray-600">Converte áudio e vídeo em texto com alta fidelidade, identificando automaticamente o idioma falado.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Layers className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diarização de Falantes</h3>
              <p className="text-gray-600">Saiba exatamente quem falou o quê. O sistema identifica e separa os diferentes participantes.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:shadow-md transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Resumos Inteligentes</h3>
              <p className="text-gray-600">Obtenha resumos curtos, detalhados e listas de tópicos principais instantaneamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Replaced with new structure */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Planos flexíveis para sua necessidade
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Pague uma única vez ou assine mensalmente, e tenha acesso ao poder da IA.
            </p>
          </div>

          {/* New Pricing Tiers */}
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto">

            {/* Plano Básico */}
            <div className="flex-1 border border-gray-300 p-6 mb-4 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Básico</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4"><strong>R$ 19</strong><span className="text-gray-500 text-base">/mês</span></p>
              <p className="text-gray-600 text-sm mb-4">Até 60 min/mês</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Resumo automático</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Exportação TXT e PDF</li>
              </ul>
              <a href="https://buy.stripe.com/test_00w3cvblocFg1vg7sLdnW00" target="_blank" className="block w-full text-decoration-none">
                <button className="w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                  Começar Agora
                </button>
              </a>
            </div>

            {/* Plano Intermediário (Recomendado) */}
            <div className="flex-1 border-2 border-indigo-600 p-6 mb-4 rounded-xl shadow-xl bg-indigo-50 relative">
              <div className="absolute top-0 right-0 -mt-3 mr-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Recomendado
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Intermediário</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4"><strong>R$ 39</strong><span className="text-gray-500 text-base">/mês</span></p>
              <p className="text-gray-600 text-sm mb-4">Até 180 min/mês</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Diarização de falantes</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Suporte a vídeo</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Exportação avançada</li>
              </ul>
              <a href="https://buy.stripe.com/test_4gMfZhblo6gS0rcaEXdnW01" target="_blank" className="block w-full text-decoration-none">
                <button className="w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                  Escolher Plano
                </button>
              </a>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 max-w-4xl mx-auto mt-6">
            {/* Plano Profissional */}
            <div className="flex-1 border border-gray-300 p-6 mb-4 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Profissional</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4"><strong>R$ 79</strong><span className="text-gray-500 text-base">/mês</span></p>
              <p className="text-gray-600 text-sm mb-4">Até 480 min/mês</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Todas as funcionalidades</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Prioridade no processamento</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Integrações</li>
              </ul>
              <a href="https://buy.stripe.com/test_9B63cv4X08p00rcdR9dnW02" target="_blank" className="block w-full text-decoration-none">
                <button className="w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                  Escolher Plano
                </button>
              </a>
            </div>

            {/* Plano Empresarial */}
            <div className="flex-1 border border-gray-300 p-6 mb-4 rounded-xl shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Empresarial</h3>
              <p className="text-2xl font-bold text-gray-900 mb-4"><strong>R$ 199</strong><span className="text-gray-500 text-base">/mês</span></p>
              <p className="text-gray-600 text-sm mb-4">Até 1500 min/mês</p>
              <ul className="text-gray-700 text-sm space-y-2 mb-6">
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Todas as funcionalidades</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Suporte dedicado</li>
                <li className="flex items-center"><Check className="flex-shrink-0 w-4 h-4 text-green-500 mr-2" /> Customizações</li>
              </ul>
              <a href="https://buy.stripe.com/test_6oU6oH4X0bBc2zk4gzdnW03" target="_blank" className="block w-full text-decoration-none">
                <button className="w-full py-3 px-6 border border-transparent rounded-lg text-center font-medium transition-all bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">
                  Fale Conosco
                </button>
              </a>
            </div>
          </div>

          {/* Plano Vitalício (Recommended) */}
          <div className="max-w-4xl mx-auto mt-6">
             <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl shadow-2xl overflow-hidden relative">
                {/* Decorative gradient blob */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                
               <div className="px-6 py-12 md:p-12 md:flex md:items-center md:justify-between relative z-10">
                 <div className="flex-1">
                   <div className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-yellow-900 mb-4">
                      OFERTA LIMITADA
                   </div>
                   <h3 className="text-3xl font-extrabold text-white">Plano Vitalício</h3>
                   <p className="mt-4 text-lg text-gray-300 max-w-md">
                     Pague uma única vez e tenha acesso para sempre. Sem mensalidades, sem surpresas.
                   </p>
                   <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-300">
                     <li className="flex items-center"><Check className="w-5 h-5 text-yellow-400 mr-2"/> Até 1.000 min/mês</li>
                     <li className="flex items-center"><Check className="w-5 h-5 text-yellow-400 mr-2"/> Acesso para sempre</li>
                     <li className="flex items-center"><Check className="w-5 h-5 text-yellow-400 mr-2"/> Todas as atualizações</li>
                     <li className="flex items-center"><Check className="w-5 h-5 text-yellow-400 mr-2"/> Suporte VIP</li>
                   </ul>
                 </div>
                 <div className="mt-8 md:mt-0 md:ml-10 bg-white/10 p-6 rounded-2xl backdrop-blur-sm text-center min-w-[200px] border border-white/10">
                   <p className="text-gray-300 text-sm mb-1">Pagamento Único</p>
                   <p className="text-5xl font-bold text-white mb-6">R$ 499</p> {/* Updated price to match HTML */}
                   <a href="https://buy.stripe.com/test_8x228rfBEfRs7TE3cvdnW04" target="_blank" className="block w-full text-decoration-none">
                    <button className="w-full bg-yellow-400 text-yellow-900 font-bold py-3 px-6 rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg">
                        Garantir Lifetime
                    </button>
                   </a>
                 </div>
               </div>
             </div>
          </div>


        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
                <Mic className="text-white w-3 h-3" />
            </div>
            <span className="font-bold text-lg text-slate-900">VoxResumo</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 VoxResumo. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* Removed Checkout Modal */}
    </div>
  );
};

export default LandingPage;
