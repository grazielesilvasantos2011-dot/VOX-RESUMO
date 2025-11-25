import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getProjects } from '../services/storageService';
import { Project } from '../types';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MoreVertical, FileText, Search } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(getProjects());
  }, []);

  const getTypeColor = (type: Project['type']) => {
      switch(type) {
          case 'meeting': return 'bg-blue-100 text-blue-700';
          case 'class': return 'bg-green-100 text-green-700';
          case 'podcast': return 'bg-purple-100 text-purple-700';
          default: return 'bg-gray-100 text-gray-700';
      }
  };

  const getTypeLabel = (type: Project['type']) => {
    switch(type) {
        case 'meeting': return 'Reunião';
        case 'class': return 'Aula';
        case 'podcast': return 'Podcast';
        case 'interview': return 'Entrevista';
        default: return 'Outro';
    }
  };

  const formatDuration = (seconds: number | undefined): string => {
    if (seconds === undefined) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Meus Projetos</h1>
                <p className="text-gray-500 text-sm mt-1">Gerencie suas transcrições e resumos.</p>
            </div>
            <div className="flex gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        type="text" 
                        placeholder="Buscar projetos..." 
                        className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                </div>
                <Link to="/app/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                    Novo Projeto
                </Link>
            </div>
        </div>

        {projects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum projeto ainda</h3>
                <p className="text-gray-500 mb-6">Faça upload do seu primeiro arquivo de áudio ou vídeo.</p>
                <Link to="/app/new" className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                    Criar Projeto
                </Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${getTypeColor(project.type)}`}>
                                {getTypeLabel(project.type)}
                            </span>
                            <button className="text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{project.name}</h3>
                        <p className="text-sm text-gray-500 mb-6 line-clamp-2">
                            {project.data?.summary_short || "Processamento concluído."}
                        </p>
                        
                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                            {project.durationSeconds !== undefined && (
                                <div className="flex items-center gap-1 ml-2">
                                    <Clock className="w-3 h-3" />
                                    <span>{formatDuration(project.durationSeconds)}</span>
                                </div>
                            )}
                            {project.data?.topics && (
                                <div className="flex gap-1">
                                    {project.data.topics.slice(0,2).map((t,i) => (
                                        <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded">#{t}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;