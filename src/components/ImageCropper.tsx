import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, Move } from 'lucide-react';

interface ImageCropperProps {
  imageSrc: string;
  aspectRatio: number;
  onCancel: () => void;
  onCrop: (croppedImage: string) => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, aspectRatio, onCancel, onCrop }) => {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [imageSrc]);

  const getCropAreaDimensions = () => {
    if (!containerRef.current) return { width: 0, height: 0 };
    const container = containerRef.current.getBoundingClientRect();
    const maxWidth = container.width * 0.9;
    const maxHeight = container.height * 0.8;
    let width = maxWidth;
    let height = width / aspectRatio;
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
    return { width, height };
  };

  const cropArea = getCropAreaDimensions();

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setDragStart({ x: clientX - offset.x, y: clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setOffset({ x: clientX - dragStart.x, y: clientY - dragStart.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const generateCrop = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const outputWidth = 1200;
    const outputHeight = outputWidth / aspectRatio;
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const scaleFactor = outputWidth / cropArea.width;
    ctx.clearRect(0, 0, outputWidth, outputHeight);
    ctx.save();
    ctx.translate(outputWidth / 2, outputHeight / 2);
    ctx.translate(offset.x * scaleFactor, offset.y * scaleFactor);

    const imageRatio = imageSize.width / imageSize.height;
    const cropRatio = cropArea.width / cropArea.height;
    let baseRenderWidth, baseRenderHeight;
    if (imageRatio > cropRatio) {
      baseRenderHeight = cropArea.height;
      baseRenderWidth = baseRenderHeight * imageRatio;
    } else {
      baseRenderWidth = cropArea.width;
      baseRenderHeight = baseRenderWidth / imageRatio;
    }

    const drawWidth = outputWidth * (baseRenderWidth / cropArea.width);
    const drawHeight = drawWidth / imageRatio;
    ctx.scale(zoom, zoom);
    ctx.drawImage(imageRef.current, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
    onCrop(canvas.toDataURL('image/png'));
  };

  const getBaseImageStyle = (): React.CSSProperties => {
    if (!imageSize.width || !cropArea.width) return {};
    const imageRatio = imageSize.width / imageSize.height;
    const cropRatio = cropArea.width / cropArea.height;
    const style: React.CSSProperties = {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transformOrigin: 'center',
      transform: `translate(-50%, -50%) translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
      transition: isDragging ? 'none' : 'transform 0.1s ease-out'
    };
    if (imageRatio > cropRatio) {
      style.height = `${cropArea.height}px`;
      style.width = 'auto';
    } else {
      style.width = `${cropArea.width}px`;
      style.height = 'auto';
    }
    return style;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full h-full flex flex-col p-4 md:p-8">
        <div className="flex justify-between items-center mb-4 text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Move size={20} /> Adjust Image
          </h3>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[#1a1a1a] rounded-xl border border-white/10 select-none">
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center relative cursor-move"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseMove={handleMouseMove}
            onTouchMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {cropArea.width > 0 && (
              <div
                style={{
                  width: cropArea.width,
                  height: cropArea.height,
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)'
                }}
                className="relative z-10 border-2 border-white pointer-events-none"
              >
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-30">
                  <div className="border-r border-white/50"></div>
                  <div className="border-r border-white/50"></div>
                  <div className="border-r border-0"></div>
                  <div className="col-span-3 border-b border-white/50 h-full row-start-1"></div>
                  <div className="col-span-3 border-b border-white/50 h-full row-start-2"></div>
                </div>
              </div>
            )}
            {imageSrc && (
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop Target"
                draggable={false}
                style={getBaseImageStyle()}
              />
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-6 items-center justify-center max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-4 w-full md:w-auto flex-1">
            <ZoomOut size={20} className="text-gray-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
            <ZoomIn size={20} className="text-gray-400" />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={onCancel}
              className="flex-1 md:flex-none px-6 py-3 rounded-full font-bold text-sm bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={generateCrop}
              className="flex-1 md:flex-none px-8 py-3 rounded-full font-bold text-sm bg-white text-black hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Check size={18} /> Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
