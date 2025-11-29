import React, { useState } from 'react';
import { GeneratedImage, Season } from '../types';
import { modifyVillaSeason } from '../services/geminiService';
import { Download, Share2, Maximize2, CloudSun, Sun, CloudRain, Snowflake } from 'lucide-react';

interface FinalViewProps {
  selectedImage: GeneratedImage;
  currentDisplayImage: string;
  setCurrentDisplayImage: (url: string) => void;
  addToHistory: (url: string, prompt: string) => void;
}

const FinalView: React.FC<FinalViewProps> = ({ 
  selectedImage, 
  currentDisplayImage, 
  setCurrentDisplayImage,
  addToHistory 
}) => {
  const [activeSeason, setActiveSeason] = useState<Season | null>(null);
  const [loadingSeason, setLoadingSeason] = useState<Season | null>(null);

  const handleSeasonChange = async (season: Season) => {
    if (loadingSeason) return;
    
    setLoadingSeason(season);
    setActiveSeason(season);

    try {
      const newImageUrl = await modifyVillaSeason(selectedImage.url, season);
      setCurrentDisplayImage(newImageUrl);
      addToHistory(newImageUrl, `Season change: ${season}`);
    } catch (error) {
      console.error("Failed to change season", error);
      alert("生成季节效果失败，请重试。");
      setActiveSeason(null); // Reset if failed
    } finally {
      setLoadingSeason(null);
    }
  };

  const resetToOriginal = () => {
    setCurrentDisplayImage(selectedImage.url);
    setActiveSeason(null);
  };

  const getSeasonIcon = (season: Season) => {
    switch(season) {
      case Season.SPRING: return <CloudSun className="w-5 h-5" />;
      case Season.SUMMER: return <Sun className="w-5 h-5" />;
      case Season.AUTUMN: return <CloudRain className="w-5 h-5" />; // Using CloudRain as proxy for Autumn wind/mood or map to generic
      case Season.WINTER: return <Snowflake className="w-5 h-5" />;
    }
  };

  const getSeasonColor = (season: Season) => {
    switch(season) {
      case Season.SPRING: return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case Season.SUMMER: return "bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200";
      case Season.AUTUMN: return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
      case Season.WINTER: return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50/50">
      {/* Main Image Area */}
      <div className="flex-1 relative p-6 flex items-center justify-center">
        <div className="relative w-full h-full max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl bg-slate-200 group">
          <img 
            src={currentDisplayImage} 
            alt="Final Villa Design" 
            className="w-full h-full object-cover transition-all duration-700 ease-in-out"
          />
          
          {/* Loading Overlay */}
          {loadingSeason && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white z-10">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-lg font-light tracking-wide">正在生成 {loadingSeason} 效果...</p>
            </div>
          )}

          {/* Floating Action Bar */}
          <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-3 bg-white/90 backdrop-blur text-slate-700 rounded-full hover:bg-white shadow-lg transition-all" title="下载图片">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-3 bg-white/90 backdrop-blur text-slate-700 rounded-full hover:bg-white shadow-lg transition-all" title="全屏预览">
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Season Controls Overlay (Bottom of Image) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4 bg-white/90 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-white/50">
             <button
                onClick={resetToOriginal}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeSeason === null 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'bg-transparent text-slate-600 hover:bg-slate-100'
                }`}
              >
                原始方案
             </button>
             
             {Object.values(Season).map((season) => (
               <button
                 key={season}
                 onClick={() => handleSeasonChange(season)}
                 disabled={!!loadingSeason}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                   activeSeason === season
                     ? 'ring-2 ring-offset-2 ring-indigo-500 shadow-md ' + getSeasonColor(season)
                     : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100'
                 } ${loadingSeason ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {getSeasonIcon(season)}
                 {season}
               </button>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinalView;