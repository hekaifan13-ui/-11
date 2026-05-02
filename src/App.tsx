import React, { useState } from 'react';
import { AppState, TemplateId, PostcardData, GalleryItem } from './types';
import { INITIAL_DATA } from './constants';
import IntroBox from './components/IntroBox';
import Editor from './components/Editor';
import Gallery from './components/Gallery';

const STORAGE_KEY = 'waytoagi_gallery';

const loadGallery = (): GalleryItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGallery = (items: GalleryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage might be full due to base64 images; silently fail
  }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.INTRO);
  const [data, setData] = useState<PostcardData>(INITIAL_DATA);
  const [gallery, setGallery] = useState<GalleryItem[]>(loadGallery);

  const handleBoxOpen = () => setAppState(AppState.SELECTION);
  const handleBoxClose = () => setAppState(AppState.INTRO);

  const handleSelectTemplate = (id: TemplateId) => {
    setData(prev => ({ ...prev, templateId: id }));
    setAppState(AppState.EDITOR);
  };

  const updateData = (key: keyof PostcardData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleBack = () => setAppState(AppState.SELECTION);

  const handleSaveToGallery = (imgDataUrl: string, height: number) => {
    const newItem: GalleryItem = {
      id: Date.now().toString(),
      img: imgDataUrl,
      height,
      templateId: data.templateId,
      createdAt: new Date().toLocaleString(),
    };
    const updated = [newItem, ...gallery];
    setGallery(updated);
    saveGallery(updated);
  };

  const handleDeleteFromGallery = (id: string) => {
    const updated = gallery.filter(item => item.id !== id);
    setGallery(updated);
    saveGallery(updated);
  };

  if (appState === AppState.GALLERY) {
    return (
      <Gallery
        items={gallery}
        onBack={() => setAppState(AppState.INTRO)}
        onDelete={handleDeleteFromGallery}
      />
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden text-gray-800">
      {appState === AppState.INTRO || appState === AppState.SELECTION ? (
        <IntroBox
          onOpen={handleBoxOpen}
          onClose={handleBoxClose}
          onSelectTemplate={handleSelectTemplate}
          onOpenGallery={() => setAppState(AppState.GALLERY)}
          galleryCount={gallery.length}
          appState={appState}
        />
      ) : (
        <Editor
          data={data}
          updateData={updateData}
          onBack={handleBack}
          onSaveToGallery={handleSaveToGallery}
        />
      )}
    </div>
  );
};

export default App;
