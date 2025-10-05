
import React, { useState, useEffect, useCallback } from 'react';
import type { AppIdea } from './types';
import { analyzeProjectContent, generateAppIdeas } from './services/geminiService';
import FileUpload from './components/FileUpload';
import IdeaCard from './components/IdeaCard';
import Loader from './components/Loader';
import AnalysisDisplay from './components/AnalysisDisplay';
import { AppInspiratorIcon } from './components/icons';

type Status = 'idle' | 'processing' | 'analyzing' | 'generating' | 'success' | 'error';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const [folderName, setFolderName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setFiles(null);
    setFolderName(null);
    setFileContent(null);
    setAnalysis(null);
    setAppIdeas([]);
    setStatus('idle');
    setError(null);
  };

  const handleFolderSelect = (selectedFiles: FileList) => {
    resetState();
    if (selectedFiles.length === 0) return;

    setFiles(selectedFiles);
    const firstFile = selectedFiles[0];
    if (firstFile?.webkitRelativePath) {
        setFolderName(firstFile.webkitRelativePath.split('/')[0]);
    } else {
        setFolderName("Selected Folder");
    }

    setStatus('processing');
    
    const filePromises = Array.from(selectedFiles).map(file => {
        return new Promise<{ path: string; content: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target?.result as string;
                resolve({ path: file.webkitRelativePath || file.name, content });
            };
            reader.onerror = (err) => {
                console.error(`Failed to read file: ${file.name}`);
                reject(err);
            };
            reader.readAsText(file);
        });
    });

    Promise.all(filePromises)
        .then(fileContents => {
            const aggregatedContent = fileContents
                .map(file => `// Path: ${file.path}\n\n${file.content}`)
                .join('\n\n---\n\n');
            setFileContent(aggregatedContent);
        })
        .catch(err => {
            setError('Failed to read one or more files in the folder.');
            setStatus('error');
        });
  };

  const runAnalysis = useCallback(async (content: string) => {
    setStatus('analyzing');
    setError(null);
    try {
      const analysisResult = await analyzeProjectContent(content);
      setAnalysis(analysisResult);
    } catch (err) {
      console.error(err);
      setError('Failed to analyze the project. Please check your API key and try again.');
      setStatus('error');
    }
  }, []);
  
  const runIdeaGeneration = useCallback(async (analysisText: string) => {
    setStatus('generating');
    try {
      const ideas = await generateAppIdeas(analysisText);
      setAppIdeas(ideas);
      setStatus('success');
    } catch (err) {
      console.error(err);
      setError('Failed to generate app ideas. The analysis may have been inconclusive.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (fileContent && status === 'processing') {
      runAnalysis(fileContent);
    }
  }, [fileContent, status, runAnalysis]);

  useEffect(() => {
    if (analysis) {
        runIdeaGeneration(analysis);
    }
  }, [analysis, runIdeaGeneration]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center gap-4 mb-2">
            <AppInspiratorIcon className="w-12 h-12 text-cyan-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 text-transparent bg-clip-text">
              App Inspirator
            </h1>
          </div>
          <p className="text-lg text-slate-300">
            Get AI-powered application ideas from your project folder.
          </p>
        </header>

        <main className="bg-slate-800/50 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700">
          {status === 'idle' && (
            <FileUpload onFolderSelect={handleFolderSelect} />
          )}

          {status !== 'idle' && folderName && files && (
            <div className="mb-6 flex justify-between items-center bg-slate-900/70 p-4 rounded-lg">
                <div>
                    <p className="text-sm text-slate-400">Source Folder</p>
                    <p className="font-mono text-cyan-400">{folderName} ({files.length} files)</p>
                </div>
                <button 
                    onClick={resetState}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
                >
                    Start Over
                </button>
            </div>
          )}

          {(status === 'processing' || status === 'analyzing' || status === 'generating') && (
            <Loader status={status} />
          )}

          {status === 'error' && (
            <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
              <h3 className="text-2xl font-bold text-red-400 mb-2">An Error Occurred</h3>
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {status === 'success' && analysis && (
             <AnalysisDisplay analysis={analysis} />
          )}

          {status === 'success' && appIdeas.length > 0 && (
            <div className="mt-8">
              <h2 className="text-3xl font-bold text-center mb-6">Inspired App Ideas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {appIdeas.map((idea, index) => (
                  <IdeaCard key={index} idea={idea} />
                ))}
              </div>
            </div>
          )}
        </main>
        
        <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
