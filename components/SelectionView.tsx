import React from 'react';
import { GeneratedImage } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface SelectionViewProps {
  options: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  isGenerating: boolean;
}

const SelectionView: React.FC<SelectionViewProps> = ({ options, onSelect, isGenerating }) => {
  if (isGenerating && options.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-6"></div>
        <p className="text-lg animate-pulse">AI 正在构思您的别墅方案...</p>
        <p className="text-sm mt-2">正在生成 4 种不同的设计草图</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">选择方案</h2>
          <p className="text-slate-500 mt-1">请从以下 4 个方案中选择一种你最喜欢的别墅效果，我们将基于此进行深化设计。</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((img, index) => (
            <div 
              key={img.id}
              onClick={() => onSelect(img)}
              className="group relative aspect-video bg-white rounded-2xl overflow-hidden shadow-sm border-2 border-transparent hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer"
            >
              {/* Image */}
              <img 
                src={img.url} 
                alt={`Option ${index + 1}`} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-6">
                <span className="text-white font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                  方案 {index + 1}
                </span>
                <div className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                  选择此方案
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectionView;