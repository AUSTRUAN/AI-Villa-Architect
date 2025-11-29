import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';

interface GalleryProps {
  history: GeneratedImage[];
  onSelect: (url: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ history, onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (history.length === 0) return null;

  return (
    <div className={`fixed bottom-0 right-0 left-0 md:left-80 bg-white border-t border-slate-200 transition-all duration-300 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]`}>
      {/* Header / Toggle Handle */}
      <div 
        className="h-10 flex items-center justify-between px-6 bg-white cursor-pointer hover:bg-slate-50 border-b border-slate-100"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <ImageIcon className="w-4 h-4 text-indigo-500" />
          生成历史 ({history.length})
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {/* Grid Content */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'h-40' : 'h-0'}`}>
        <div className="h-full p-4 overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 h-full">
            {history.slice().reverse().map((item) => (
              <div 
                key={item.id} 
                className="relative flex-shrink-0 h-full aspect-video rounded-lg overflow-hidden border border-slate-200 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all group"
                onClick={() => onSelect(item.url)}
              >
                <img src={item.url} alt="History" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;