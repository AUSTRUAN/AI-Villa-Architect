
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Sidebar from './components/Sidebar';
import SelectionView from './components/SelectionView';
import FinalView from './components/FinalView';
import Gallery from './components/Gallery';
import { VillaConfig, AppStep, GeneratedImage } from './types';
import { generateVillaImage } from './services/geminiService';

const App: React.FC = () => {
  // Application State
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Data State
  const [config, setConfig] = useState<VillaConfig>({
    style: '',
    floors: '',
    area: '',
    referenceImage: undefined
  });
  
  const [generatedOptions, setGeneratedOptions] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>('');
  const [history, setHistory] = useState<GeneratedImage[]>([]);

  // Handlers
  const handleInitialGenerate = async () => {
    setIsGenerating(true);
    setStep(AppStep.SELECTION);
    setGeneratedOptions([]); // Clear previous

    try {
      // Parallel generation for 4 options
      // Note: We run 4 independent requests to get variations, passing the index
      const promises = Array(4).fill(null).map((_, index) => generateVillaImage(config, index));
      
      const results = await Promise.all(promises);
      
      const newImages: GeneratedImage[] = results.map(url => ({
        id: uuidv4(),
        url,
        prompt: `Style: ${config.style}, Floors: ${config.floors}, Area: ${config.area}`,
        timestamp: Date.now()
      }));

      setGeneratedOptions(newImages);
      // Add all initial options to history
      setHistory(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error("Failed to generate options", error);
      alert("生成图片失败，请检查 API Key 或重试。");
      setStep(AppStep.INPUT);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (image: GeneratedImage) => {
    setSelectedImage(image);
    setCurrentDisplayImage(image.url);
    setStep(AppStep.FINAL);
  };

  const addToHistory = (url: string, prompt: string) => {
    const newItem: GeneratedImage = {
      id: uuidv4(),
      url,
      prompt,
      timestamp: Date.now()
    };
    setHistory(prev => [...prev, newItem]);
  };

  const handleGallerySelect = (url: string) => {
    // If in final view, just update display
    if (step === AppStep.FINAL) {
      setCurrentDisplayImage(url);
    } else {
       // If in other steps, we might want to go to final view with this image?
       // For simplicity, let's just preview it if possible, but the requirement implies 
       // gallery is for saved history.
       // Let's assume selecting history puts it in the main view area if possible.
       // To keep logic simple: we only really support "viewing" history in Final Step for now
       // or if we switch logic to treat everything as a viewer.
       // Let's switch to final view mode to view history items.
       setSelectedImage({ id: 'history', url, prompt: 'History item', timestamp: Date.now() });
       setCurrentDisplayImage(url);
       setStep(AppStep.FINAL);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar - Persistent */}
      <Sidebar 
        config={config} 
        setConfig={setConfig} 
        onGenerate={handleInitialGenerate}
        isGenerating={isGenerating}
        currentStep={step}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative h-full transition-all duration-500">
        
        {/* Step 1 & 2: Selection Area */}
        {step === AppStep.SELECTION && (
          <SelectionView 
            options={generatedOptions} 
            onSelect={handleSelectOption}
            isGenerating={isGenerating}
          />
        )}

        {/* Step 3: Final View & Edit */}
        {step === AppStep.FINAL && selectedImage && (
          <FinalView 
            selectedImage={selectedImage}
            currentDisplayImage={currentDisplayImage}
            setCurrentDisplayImage={setCurrentDisplayImage}
            addToHistory={addToHistory}
          />
        )}

        {/* Placeholder for Step 1 initial state if needed, or Sidebar handles 'Start' */}
        {step === AppStep.INPUT && !isGenerating && (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
             </div>
             <p className="text-lg font-light">在左侧输入参数开始设计</p>
          </div>
        )}

        {/* Bottom Gallery */}
        <Gallery history={history} onSelect={handleGallerySelect} />
      </main>
    </div>
  );
};

export default App;
