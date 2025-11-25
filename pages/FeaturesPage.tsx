import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { 
  Mic, 
  FileAudio, 
  Users, 
  FileText, 
  Download, 
  Folder, 
  Zap, 
  Globe, 
  Clock, 
  CheckCircle,
  Brain,
  Share2
} from 'lucide-react';

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Poder total para seus <span className="text-indigo-600">áudios e vídeos</span>
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Conheça todas as ferramentas que o VoxResumo oferece para transformar horas de gravação em minutos de leitura e insights.
          </p>
        </div>
      </div>

      {/* Core Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Tecnologia de Ponta</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              O que o VoxResumo faz por você
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <FileAudio className="text-indigo-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Suporte Universal</h3>
              <p className="text-gray-600">
                Faça upload de arquivos de áudio e vídeo nos formatos mais comuns: MP3, WAV, MP4, M4A e outros. Processamos tudo automaticamente.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Brain className="text-purple-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA Avançada (Gemini)</h3>
              <p className="text-gray-600">
                Utilizamos a mais recente tecnologia do Google Gemini para entender o contexto, nuances e termos técnicos do seu conteúdo.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Identificação de Falantes</h3>
              <p className="text-gray-600">
                O sistema detecta automaticamente quando há múltiplos participantes e separa o texto por orador (Speaker Diarization).
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Globe className="text-green-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Detecção de Idioma</h3>
              <p className="text-gray-600">
                Não precisa configurar nada. Detectamos o idioma falado automaticamente, seja Português, Inglês, Espanhol ou dezenas de outros.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Zap className="text-orange-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Insights Automáticos</h3>
              <p className="text-gray-600">
                Além do texto, receba uma lista de "Pontos Chave", sugestões de títulos e tópicos principais para catalogar seu conteúdo.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-6">
                <Download className="text-pink-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Exportação Flexível</h3>
              <p className="text-gray-600">
                Baixe seus resultados em PDF profissional formatado ou copie o texto para usar em seus documentos e e-mails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
                Perfeito para qualquer tipo de conteúdo
              </h2>
              <div className="space-y-8">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reuniões de Negócios</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Grave a reunião e receba a ata pronta, com as decisões tomadas e tarefas atribuídas a cada pessoa.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Share2 className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Podcasts e Entrevistas</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Transforme episódios em blog posts, threads para redes sociais e newsletter com resumos automáticos.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Aulas e Palestras</h3>
                    <p className="mt-2 text-base text-gray-500">
                      Foque em prestar atenção na aula e deixe que o VoxResumo crie suas anotações de estudo organizadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
               <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl transform rotate-3"></div>
               <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-200">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JS</div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">João Silva</div>
                            <div className="text-xs text-gray-500">00:15</div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">"Precisamos focar nos entregáveis para a próxima semana. A prioridade é a nova interface."</p>
                    
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 pt-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">MA</div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">Maria Almeida</div>
                            <div className="text-xs text-gray-500">00:22</div>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">"Concordo. Vou alinhar com a equipe de design hoje à tarde para garantir que os prazos sejam cumpridos."</p>

                    <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100">
                        <div className="text-xs font-bold text-green-700 uppercase mb-2">Insight Detectado</div>
                        <p className="text-green-800 text-sm font-medium flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 mt-0.5" />
                            Ação: Maria alinhar com equipe de design hoje à tarde.
                        </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Pronto para otimizar seu tempo?</h2>
          <p className="text-indigo-100 text-lg mb-8">
            Comece a usar o VoxResumo hoje e descubra o poder da inteligência artificial nos seus conteúdos.
          </p>
          <Link to="/app/new" className="inline-block bg-white text-indigo-600 font-bold py-4 px-10 rounded-xl hover:bg-indigo-50 transition shadow-lg">
            Começar Agora Gratuitamente
          </Link>
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
    </div>
  );
};

export default FeaturesPage;