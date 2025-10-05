
import React from 'react';

interface AnalysisDisplayProps {
  analysis: string;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-cyan-400">File Analysis</h2>
      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{analysis}</p>
    </div>
  );
};

export default AnalysisDisplay;
