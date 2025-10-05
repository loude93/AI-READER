
import React from 'react';

interface LoaderProps {
  status: 'processing' | 'analyzing' | 'generating';
}

const Loader: React.FC<LoaderProps> = ({ status }) => {
  const messages = {
    processing: "Reading project files...",
    analyzing: "Analyzing project contents...",
    generating: "Generating brilliant app ideas...",
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
      <p className="mt-4 text-xl font-semibold text-slate-300">{messages[status]}</p>
      <p className="text-slate-400">This may take a moment.</p>
    </div>
  );
};

export default Loader;
