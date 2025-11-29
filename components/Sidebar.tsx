
import React, { useRef, useState, useEffect } from 'react';
import { VillaConfig, AppStep } from '../types';
import { Home, Layers, Grid, ArrowRight, ImagePlus, X, RefreshCw, ZoomIn, Check } from 'lucide-react';

interface SidebarProps {
  config: VillaConfig;
  setConfig: React.Dispatch<React.SetStateAction<VillaConfig>>;
  onGenerate: () => void;
  isGenerating: boolean;
  currentStep: AppStep;
}

const STYLE_PRESETS = [
  { name: '现代极简 (Modern Minimalist)', url: 'https://images.unsplash.com/photo-1600596542815-60c37c6525fa?q=80&w=600' },
  { name: '新中式 (New Chinese)', url: 'https://images.unsplash.com/photo-1548625361-e88c60eb027e?q=80&w=600' },
  { name: '欧式古典 (European Classic)', url: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=600' },
  { name: '美式乡村 (American Country)', url: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=600' },
  { name: '工业风 (Industrial)', url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=600' },
  { name: '日式禅意 (Japanese Zen)', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600' },
  { name: '法式庄园 (French Manor)', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600' },
  { name: '未来主义 (Futuristic)', url: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?q=80&w=600' },
  { name: '地中海风格 (Mediterranean)', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600' }, // Adjusted URL for variety
  { name: '野兽派 (Brutalist)', url: 'https://images.unsplash.com/photo-1527576539890-dfa815648363?q=80&w=600' },
  { name: '玻璃屋 (Modern Glass)', url: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600' },
  { name: '热带度假 (Tropical Resort)', url: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?q=80&w=600' }
];

const Sidebar: React.FC<SidebarProps> = ({ config, setConfig, onGenerate, isGenerating, currentStep }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inspirations, setInspirations] = useState<typeof STYLE_PRESETS>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Shuffle logic
  const shuffleInspirations = () => {
    const shuffled = [...STYLE_PRESETS].sort(() => 0.5 - Math.random());
    setInspirations(shuffled.slice(0, 4));
  };

  // Initial shuffle
  useEffect(() => {
    shuffleInspirations();
  }, []);

  const handleChange = (field: keyof VillaConfig, value: string | undefined) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('referenceImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleChange('referenceImage', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerateClick = () => {
    onGenerate();
    // Logic removed: do not shuffle inspirations on generate
  };

  const selectInspiration = (styleName: string) => {
    // Extract just the Chinese name or full name. Using Full name for prompt quality.
    // But UI shows full. Let's put full name in input.
    handleChange('style', styleName);
  };

  return (
    <>
      <div className="w-full md:w-80 bg-white border-r border-slate-200 h-full flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">AI</span> 别墅设计
          </h1>
          <p className="text-slate-500 text-sm mt-1">Nano Banana 驱动</p>
        </div>

        <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Style Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Home className="w-4 h-4 text-indigo-500" />
              建筑风格
            </label>
            <input
              type="text"
              value={config.style}
              onChange={(e) => handleChange('style', e.target.value)}
              placeholder="例如：现代简约、欧式、中式..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700"
            />
          </div>

          {/* Floors Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              建筑层数
            </label>
            <input
              type="text"
              value={config.floors}
              onChange={(e) => handleChange('floors', e.target.value)}
              placeholder="例如：3层"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700"
            />
          </div>

          {/* Area Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Grid className="w-4 h-4 text-indigo-500" />
              占地面积 (㎡)
            </label>
            <input
              type="number"
              value={config.area}
              onChange={(e) => handleChange('area', e.target.value)}
              placeholder="例如：200"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-700"
            />
          </div>

          {/* Reference Image Input */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <ImagePlus className="w-4 h-4 text-indigo-500" />
              参考图片 (选填)
            </label>
            
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {config.referenceImage ? (
               <div className="relative group rounded-xl overflow-hidden border border-slate-200 h-32 w-full">
                 <img src={config.referenceImage} alt="Reference" className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={clearImage}
                      className="p-2 bg-white/20 backdrop-blur rounded-full hover:bg-red-500 hover:text-white transition-all text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            ) : (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl hover:border-indigo-400 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center text-slate-400 gap-2"
              >
                <ImagePlus className="w-6 h-6" />
                <span className="text-xs">点击上传图片</span>
              </button>
            )}
          </div>

          {/* Inspiration Gallery */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-500" />
                灵感推荐
              </label>
              <button 
                onClick={shuffleInspirations} 
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
                title="换一批"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {inspirations.map((item, idx) => (
                <div 
                  key={idx} 
                  className={`group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                    config.style === item.name 
                      ? 'border-indigo-500 ring-2 ring-indigo-200' 
                      : 'border-transparent hover:border-slate-200'
                  }`}
                  onClick={() => selectInspiration(item.name)}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  
                  {/* Style Name Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 pt-6">
                    <p className="text-[10px] text-white font-medium truncate leading-tight">
                      {item.name.split(' (')[0]}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {config.style === item.name && (
                    <div className="absolute top-1 left-1 bg-indigo-500 text-white p-0.5 rounded-full shadow-sm">
                      <Check className="w-3 h-3" />
                    </div>
                  )}

                  {/* Enlarge Button */}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(item.url);
                      }}
                      className="p-1 bg-black/40 backdrop-blur rounded text-white hover:bg-black/60"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Indicator */}
          {currentStep > AppStep.INPUT && (
            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
               <h3 className="text-indigo-900 font-medium text-sm mb-1">当前配置</h3>
               <div className="text-xs text-indigo-700 space-y-1">
                 <p>风格: {config.style}</p>
                 <p>层数: {config.floors}</p>
                 <p>面积: {config.area}㎡</p>
                 {config.referenceImage && <p>包含参考图片</p>}
               </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <button
            onClick={handleGenerateClick}
            disabled={isGenerating || !config.style || !config.floors || !config.area}
            className={`w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all ${
              isGenerating || !config.style || !config.floors || !config.area
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在生成...
              </>
            ) : (
              <>
                {currentStep === AppStep.INPUT ? '开始生成' : '重新生成'} 
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-screen">
             <button 
               onClick={() => setPreviewImage(null)}
               className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors"
             >
               <X className="w-8 h-8" />
             </button>
             <img 
               src={previewImage} 
               alt="Preview" 
               className="w-full h-full max-h-[90vh] object-contain rounded-lg shadow-2xl" 
               onClick={(e) => e.stopPropagation()} 
             />
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
