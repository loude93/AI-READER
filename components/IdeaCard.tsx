
import React from 'react';
import type { AppIdea } from '../types';
import { LightbulbIcon, RocketIcon, CodeIcon, ChartIcon, ConnectIcon, CheckCircleIcon } from './icons';

interface IdeaCardProps {
  idea: AppIdea;
}

const iconMap: { [key: string]: React.ReactNode } = {
  lightbulb: <LightbulbIcon className="w-8 h-8" />,
  rocket: <RocketIcon className="w-8 h-8" />,
  code: <CodeIcon className="w-8 h-8" />,
  chart: <ChartIcon className="w-8 h-8" />,
  connect: <ConnectIcon className="w-8 h-8" />,
};

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const icon = iconMap[idea.icon.toLowerCase()] || <LightbulbIcon className="w-8 h-8" />;
  
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-cyan-500/20 hover:border-cyan-500 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-slate-700 p-3 rounded-full text-cyan-400">
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-100">{idea.title}</h3>
      </div>
      <p className="text-slate-300 mb-5 text-sm leading-relaxed">{idea.description}</p>
      <div>
        <h4 className="font-semibold text-slate-200 mb-3">Key Features:</h4>
        <ul className="space-y-2">
          {idea.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-400 text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IdeaCard;
