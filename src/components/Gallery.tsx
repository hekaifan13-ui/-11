import React, { useState } from 'react';
import { ArrowLeft, Trash2, Download, Images, X } from 'lucide-react';
import { Masonry, MasonryItem } from './Masonry';
import { GalleryItem } from '../types';

interface GalleryProps {
  items: GalleryItem[];
  onBack: () => void;
  onDelete: (id: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ items, onBack, onDelete }) => {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);

  const masonryItems: MasonryItem[] = items.map(item => ({
    id: item.id,
    img: item.img,
    height: item.height,
  }));

  const handleItemClick = (masonryItem: MasonryItem) => {
    const full = items.find(i => i.id === masonryItem.id);
    if (full) setLightbox(full);
  };

  const handleDownload = (item: GalleryItem) => {
    const link = document.createElement('a');
    link.href = item.img;
    link.download = `postcard-${item.id}.${item.img.startsWith('data:image/png') ? 'png' : 'jpg'}`;
    link.click();
  };

  return (
    <div className="w-full h-screen flex flex-col bg-zinc-950 text-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-8 py-5 border-b border-white/10 bg-zinc-900/80 backdrop-blur-sm shrink-0">
        <button
          onClick={onBack}
          className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors group"
        >
          <ArrowLeft size={20} className="text-white/60 group-hover:text-white transition-colors" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center">
            <Images size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-none">My Gallery</h2>
            <p className="text-xs text-white/40 mt-0.5">{items.length} saved postcard{items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 opacity-40">
            <div className="w-24 h-24 border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center">
              <Images size={36} className="text-white/30" />
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-white/60 mb-2">No saved postcards yet</p>
              <p className="text-sm text-white/30">Export a postcard and it will appear here</p>
            </div>
          </div>
        ) : (
          <div className="px-8 py-8">
            <Masonry
              items={masonryItems}
              animateFrom="bottom"
              stagger={0.04}
              blurToFocus={true}
              scaleOnHover={true}
              hoverScale={0.97}
              colorShiftOnHover={false}
              onItemClick={handleItemClick}
            />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8 backdrop-blur-md"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl max-h-full flex flex-col items-center gap-4"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={lightbox.img}
              alt="Postcard"
              className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleDownload(lightbox)}
                className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
              >
                <Download size={16} /> Download
              </button>
              <button
                onClick={() => { onDelete(lightbox.id); setLightbox(null); }}
                className="flex items-center gap-2 bg-red-500/20 text-red-400 border border-red-500/30 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-red-500/30 transition-colors"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
            <p className="text-xs text-white/40">{lightbox.createdAt}</p>
          </div>
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
