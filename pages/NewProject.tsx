
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Upload, FileAudio, Loader2, Download, Copy, CheckCircle, FileText, List, AlignLeft, Info, FolderGit2 } from 'lucide-react';
import { processAudioFile } from '../services/geminiService';
import { saveProject, getUserPlan, getOrCreateUserId, getDailyConsumedSeconds, saveDailyUsage } from '../services/storageService';
import { logAction } from '../services/loggingService'; // Import logAction
import { AIResponseData, Project, UserPlanType } from '../types';
import { jsPDF } from 'jspdf';

interface DriveFileSelection {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  blob: Blob; // The actual file content as a Blob
}

// Extend the Window interface directly, making `aistudio` and its methods optional
// to handle cases where they might not be present or to prevent type declaration conflicts.
declare global {
  interface Window {
    aistudio?: {
      openGoogleDrivePicker?: () => Promise<DriveFileSelection | null>;
      hasSelectedApiKey?: () => Promise<boolean>;
      openSelectKey?: () => Promise<void>;
    };
  }
}

const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [fileDuration, setFileDuration] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AIResponseData | null>(null);
  const [activeTab, setActiveTab] = useState<'transcript' | 'summary' | 'insights'>('summary');
  const [projectTitle, setProjectTitle] = useState("Novo Projeto");
  const [projectType, setProjectType] = useState<Project['type']>('meeting');
  const [planLimitExceeded, setPlanLimitExceeded] = useState(false); // State for single file duration limit
  
  // New states for daily consumption tracking
  const [userId, setUserId] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<UserPlanType>('unauthenticated');
  const [dailyConsumedSeconds, setDailyConsumedSeconds] = useState<number>(0);
  const [dailyLimitSeconds, setDailyLimitSeconds] = useState<number>(0);
  const [isDailyLimitExceeded, setIsDailyLimitExceeded] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize user and usage data on component mount
    const currentUserId = getOrCreateUserId();
    setUserId(currentUserId);

    const currentUserPlan = getUserPlan();
    setUserPlan(currentUserPlan);

    const consumed = getDailyConsumedSeconds(currentUserId);
    setDailyConsumedSeconds(consumed);

    let maxDailyDuration: number;
    switch (currentUserPlan) {
      case 'free':
        maxDailyDuration = 10 * 60; // 10 minutes daily for free
        break;
      case 'pro':
        maxDailyDuration = 60 * 60; // 60 minutes daily for pro
        break;
      case 'unauthenticated':
      default:
        maxDailyDuration = 10 * 60; // 10 minutes daily for unauthenticated
        break;
    }
    setDailyLimitSeconds(maxDailyDuration);
    setIsDailyLimitExceeded(consumed >= maxDailyDuration);

  }, []); // Run once on mount

  const getDurationFromMediaFile = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.onloadedmetadata = () => {
        URL.revokeObjectURL(url);
        resolve(audio.duration);
      };
      audio.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Não foi possível carregar a duração do arquivo de mídia."));
      };
      audio.src = url;
    });
  };

  const validateAndSetFile = async (selectedFile: File) => {
    const currentUserId = getOrCreateUserId(); // Ensure userId is available for logging
    // Client-side validation for demo purposes
    const MAX_UPLOAD_SIZE = 25 * 1024 * 1024; // 25MB limit
    if (selectedFile.size > MAX_UPLOAD_SIZE) { 
        alert(`Para esta demonstração, o arquivo deve ser menor que ${MAX_UPLOAD_SIZE / (1024*1024)}MB.`);
        setFile(null);
        setFileDuration(null);
        setPlanLimitExceeded(false);
        logAction(currentUserId, 'File selection failed: too large', { fileName: selectedFile.name, fileSize: selectedFile.size });
        return;
    }
    
    setFile(selectedFile);
    setPlanLimitExceeded(false); // Reset individual file limit exceeded status

    try {
      const duration = await getDurationFromMediaFile(selectedFile);
      setFileDuration(duration);
      logAction(currentUserId, 'File selected for processing', { fileName: selectedFile.name, fileDuration: duration, fileType: selectedFile.type });
    } catch (error: any) {
      console.error("Erro ao obter duração do arquivo:", error);
      setFileDuration(null);
      alert("Não foi possível determinar a duração do arquivo. Por favor, tente outro arquivo.");
      setFile(null);
      logAction(currentUserId, 'File selection failed: duration error', { fileName: selectedFile.name, error: error.message });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await validateAndSetFile(e.target.files[0]);
    }
  };

  const handleGoogleDriveImport = async () => {
    const currentUserId = getOrCreateUserId(); // Ensure userId is available for logging
    // Use optional chaining for safer access to window.aistudio and its methods
    if (!window.aistudio?.openGoogleDrivePicker) {
      alert("A funcionalidade de importação do Google Drive não está disponível neste ambiente.");
      logAction(currentUserId, 'Google Drive picker not available');
      return;
    }

    try {
      // Safely call openGoogleDrivePicker now that its existence is checked
      const driveFile = await window.aistudio.openGoogleDrivePicker();
      if (driveFile) {
        // Create a File object from the Blob returned by the picker
        const selectedFile = new File([driveFile.blob], driveFile.name, { type: driveFile.mimeType });
        await validateAndSetFile(selectedFile);
      } else {
        console.log("Nenhum arquivo selecionado do Google Drive.");
        logAction(currentUserId, 'Google Drive import cancelled');
      }
    } catch (error: any) {
      console.error("Erro ao importar do Google Drive:", error);
      alert("Erro ao importar arquivo do Google Drive. Por favor, tente novamente.");
      logAction(currentUserId, 'Google Drive import failed', { error: error.message });
    }
  };


  const handleProcess = async () => {
    if (!file || fileDuration === null || !userId) return;

    // First, check individual file duration limit
    let maxSingleFileDurationSeconds: number;
    let singleFileLimitMessage: string;

    switch (userPlan) {
      case 'free':
        maxSingleFileDurationSeconds = 3 * 60; // 3 minutes for free
        singleFileLimitMessage = "Você está no plano gratuito. O limite de transcrição por arquivo é de 3 minutos.";
        break;
      case 'pro':
        maxSingleFileDurationSeconds = 20 * 60; // 20 minutes for pro
        singleFileLimitMessage = "Você está no plano Pro. O limite de transcrição por arquivo é de 20 minutos.";
        break;
      case 'unauthenticated': // Treat unauthenticated as free for limits
      default:
        maxSingleFileDurationSeconds = 3 * 60; // 3 minutes for unauthenticated
        singleFileLimitMessage = "Você não está logado ou seu plano é gratuito. O limite de transcrição por arquivo é de 3 minutos.";
        break;
    }

    if (fileDuration > maxSingleFileDurationSeconds) {
      alert(`Seu arquivo tem ${formatDuration(fileDuration)}, excedendo o limite de ${formatDuration(maxSingleFileDurationSeconds)} para um único arquivo no seu plano. ${singleFileLimitMessage} Considere fazer upgrade para processar arquivos maiores.`);
      setPlanLimitExceeded(true);
      logAction(userId, 'Processing blocked: single file limit exceeded', { fileName: file.name, fileDuration, userPlan, limit: maxSingleFileDurationSeconds });
      return;
    }

    // Second, check daily consumption limit
    if (dailyConsumedSeconds + fileDuration > dailyLimitSeconds) {
      alert(`Seu arquivo tem ${formatDuration(fileDuration)}. Com ele, você excederia o limite diário de ${formatDuration(dailyLimitSeconds)} (${formatDuration(dailyConsumedSeconds)} já consumidos). Faça upgrade ou tente novamente amanhã.`);
      setIsDailyLimitExceeded(true);
      logAction(userId, 'Processing blocked: daily limit exceeded', { fileName: file.name, fileDuration, dailyConsumedSeconds, dailyLimitSeconds, userPlan });
      return;
    }

    setIsProcessing(true);
    logAction(userId, 'Processing started', { fileName: file.name, fileDuration, projectType });
    try {
      const data = await processAudioFile(file);
      setResult(data);
      if (data.title) setProjectTitle(data.title);
      
      const newProjectId = Date.now().toString();

      // Save to history
      const newProject: Project = {
        id: newProjectId,
        name: data.title || projectTitle || file.name,
        type: projectType,
        createdAt: new Date().toISOString(),
        status: 'completed',
        originalFileName: file.name,
        durationSeconds: fileDuration, // Save the duration
        data: data
      };
      saveProject(newProject);

      // Save daily usage record
      saveDailyUsage(userId, {
        projectId: newProjectId,
        taskType: projectType,
        durationSeconds: fileDuration,
        timestamp: new Date().toISOString(),
      });
      // Update daily consumed seconds in state immediately
      setDailyConsumedSeconds(prev => prev + fileDuration);
      setIsDailyLimitExceeded((dailyConsumedSeconds + fileDuration) >= dailyLimitSeconds);

      logAction(userId, 'Processing completed successfully', { projectId: newProjectId, fileName: file.name, fileDuration, projectType });


    } catch (error: any) {
      alert("Erro ao processar o arquivo. Verifique sua chave de API e tente novamente.");
      logAction(userId, 'Processing failed', { fileName: file.name, projectType, error: error.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPDF = () => {
    if (!result || !userId) return;
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(result.title || "Resumo VoxResumo", 10, 10);
    
    doc.setFontSize(12);
    let y = 20;
    
    const addText = (title: string, body: string) => {
       doc.setFont("helvetica", "bold");
       doc.text(title, 10, y);
       y += 7;
       doc.setFont("helvetica", "normal");
       const splitText = doc.splitTextToSize(body, 180);
       doc.text(splitText, 10, y);
       y += (splitText.length * 7) + 10;
    };

    if (activeTab === 'summary' || activeTab === 'insights') {
        addText("Resumo Executivo", result.summary_short);
        addText("Resumo Detalhado", result.summary_detailed);
        doc.addPage();
        y = 10;
        doc.setFont("helvetica", "bold");
        doc.text("Principais Insights", 10, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        result.key_points.forEach(pt => {
            const split = doc.splitTextToSize(`- ${pt}`, 180);
            doc.text(split, 10, y);
            y += (split.length * 7);
        });
    }

    if (activeTab === 'transcript') {
        doc.addPage();
        y = 10;
        doc.setFont("helvetica", "bold");
        doc.text("Transcrição Completa", 10, y);
        y += 10;
        doc.setFont("helvetica", "normal");
        result.transcript.forEach(t => {
            if (y > 280) { doc.addPage(); y = 10; }
            doc.text(`[${t.timestamp}] ${t.speaker}:`, 10, y);
            y += 6;
            const text = doc.splitTextToSize(t.text, 180);
            doc.text(text, 10, y);
            y += (text.length * 6) + 4;
        });
    }

    doc.save("vox-resumo.pdf");
    logAction(userId, 'Exported project as PDF', { projectId: result.title });
  };

  const formatDuration = (seconds: number | null): string => {
    if (seconds === null || isNaN(seconds)) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
         <Navbar />
         <div className="text-center max-w-md px-4 mt-20">
            <div className="relative w-24 h-24 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto text-indigo-600 w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Processando seu arquivo...</h2>
            <p className="text-gray-500">A IA está transcrevendo, identificando falantes e gerando insights. Isso pode levar alguns segundos.</p>
         </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{result.title}</h1>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="uppercase bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold text-xs tracking-wide">{result.language}</span>
                        <span>• {projectType}</span>
                        <span>• {new Date().toLocaleDateString()}</span>
                        {fileDuration !== null && <span>• Duração: {formatDuration(fileDuration)}</span>}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleExportPDF} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium shadow-sm transition">
                        <Download className="w-4 h-4" /> Exportar PDF
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition">
                        <Copy className="w-4 h-4" /> Copiar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1 space-y-2 sticky top-24">
                    <button 
                        onClick={() => setActiveTab('summary')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition ${activeTab === 'summary' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <AlignLeft className="w-5 h-5" /> Resumo & Tópicos
                    </button>
                    <button 
                        onClick={() => setActiveTab('insights')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition ${activeTab === 'insights' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <List className="w-5 h-5" /> Insights Principais
                    </button>
                    <button 
                        onClick={() => setActiveTab('transcript')}
                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 font-medium transition ${activeTab === 'transcript' ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        <FileText className="w-5 h-5" /> Transcrição Completa
                    </button>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {activeTab === 'summary' && (
                        <>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Executivo</h3>
                                <p className="text-gray-700 leading-relaxed">{result.summary_short}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo Detalhado</h3>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{result.summary_detailed}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tópicos Abordados</h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.topics.map((topic, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">#{topic}</span>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === 'insights' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Pontos Chave & Insights</h3>
                            <ul className="space-y-4">
                                {result.key_points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1 min-w-5 min-h-5 bg-green-100 rounded-full flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'transcript' && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Transcrição Completa</h3>
                            <div className="space-y-6">
                                {result.transcript.map((segment, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-24 pt-1">
                                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">
                                                {segment.speaker}
                                            </div>
                                            <div className="text-xs text-gray-400 font-mono">
                                                {segment.timestamp}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-700 leading-relaxed">{segment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
  }

  // Upload State
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Projeto</h1>
        <p className="text-gray-500 mb-8">Faça upload de um áudio ou vídeo para começar.</p>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 border-b border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto (Opcional)</label>
                <input 
                    type="text" 
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                />

                <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">Tipo de Conteúdo</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['Reunião', 'Aula', 'Podcast', 'Entrevista'].map((type) => (
                        <button 
                            key={type}
                            onClick={() => setProjectType(type === 'Reunião' ? 'meeting' : type === 'Aula' ? 'class' : type === 'Podcast' ? 'podcast' : 'interview')}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                                (type === 'Reunião' && projectType === 'meeting') || 
                                (type === 'Aula' && projectType === 'class') || 
                                (type === 'Podcast' && projectType === 'podcast') || 
                                (type === 'Entrevista' && projectType === 'interview')
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-8 bg-gray-50">
                <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition bg-white"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Clique para fazer upload</h3>
                    <p className="text-sm text-gray-500 mb-4">ou arraste e solte o arquivo aqui</p>
                    <p className="text-xs text-gray-400">MP3, WAV, M4A, MP4 (max 25MB para demo)</p>
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="audio/*,video/*"
                        className="hidden" 
                    />
                </div>

                <div className="mt-4 text-center">
                    <button 
                        onClick={handleGoogleDriveImport}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition shadow-sm"
                    >
                        <FolderGit2 className="w-5 h-5" /> Importar do Google Drive
                    </button>
                </div>
                
                {file && (
                    <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <FileAudio className="text-gray-500 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  {(file.size / (1024*1024)).toFixed(2)} MB 
                                  {fileDuration !== null && ` • ${formatDuration(fileDuration)}`}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={handleProcess}
                            disabled={isProcessing || planLimitExceeded || isDailyLimitExceeded || fileDuration === null}
                            className={`px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm ${isProcessing || planLimitExceeded || isDailyLimitExceeded || fileDuration === null ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            Processar Agora
                        </button>
                    </div>
                )}
                
                {planLimitExceeded && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Seu arquivo excede o limite de duração para um único arquivo no seu plano. Faça upgrade para processar arquivos maiores.</span>
                    </div>
                )}

                {isDailyLimitExceeded && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">Você atingiu o limite diário de processamento ({formatDuration(dailyLimitSeconds)}). Tente novamente amanhã ou faça upgrade do seu plano.</span>
                    </div>
                )}

                {/* Daily Usage Info */}
                <div className="mt-6 p-3 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg flex items-center gap-2">
                    <Info className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm">
                        Consumo diário: <span className="font-semibold">{formatDuration(dailyConsumedSeconds)}</span> de <span className="font-semibold">{formatDuration(dailyLimitSeconds)}</span> ({userPlan === 'unauthenticated' ? 'Grátis/Não Autenticado' : userPlan === 'free' ? 'Grátis' : 'Pro'}).
                    </span>
                </div>

                <p className="mt-6 text-xs text-center text-gray-500 flex items-center justify-center gap-1 bg-white/50 py-2 rounded-lg">
                  🔒 Privacidade: Nenhum arquivo enviado é armazenado. Todo processamento é temporário e usado apenas para gerar sua transcrição e resumo.
                </p>

            </div>
        </div>
      </div>
    </div>
  );
};

export default NewProject;