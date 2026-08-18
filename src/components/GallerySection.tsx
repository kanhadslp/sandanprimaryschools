import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Calendar,
  Sparkles
} from 'lucide-react';
import { GALLERY_PHOTOS } from '../data/schoolData';
import { GalleryPhoto } from '../types';

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  const categories = [
    { id: 'all', labelKh: 'រូបភាពទាំងអស់' },
    { id: 'exercise', labelKh: 'ហាត់ប្រាណ & កីឡា' },
    { id: 'assembly', labelKh: 'ជួរគោរពទង់ជាតិ' },
    { id: 'classroom', labelKh: 'បន្ទប់រៀន' },
    { id: 'library', labelKh: 'បណ្ណាល័យ' },
  ];

  const filteredPhotos = activeCategory === 'all'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const handleNextPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIndex]);
  };

  const handlePrevPhoto = () => {
    if (!selectedPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === selectedPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIndex]);
  };

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-3">
              <ImageIcon className="w-4 h-4 text-blue-900" />
              <span>បណ្ណាល័យរូបភាព & សកម្មភាព</span>
            </div>
            <h2 className="font-moul text-2xl md:text-3xl text-blue-950 leading-snug">
              ទិដ្ឋភាពជាក់ស្តែងនៃសាលារៀន
            </h2>
            <p className="text-sm text-slate-600 font-kantumruy mt-1 max-w-xl">
              រូបភាពសកម្មភាពហាត់ប្រាណពេលព្រឹក ការគោរពទង់ជាតិ បរិវេណសាលា ការរៀនសូត្រ និងសកម្មភាពកុមារ។
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-battambang font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-blue-900 text-yellow-300 shadow-xs border-b-2 border-yellow-400'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat.labelKh}
              </button>
            ))}
          </div>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPhotos.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              className="group relative bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 border-b-4 border-b-blue-900 hover:border-b-yellow-400 aspect-[4/3] cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
              <img
                src={photo.imageUrl}
                alt={photo.titleKh}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity"></div>

              {/* Expand Icon */}
              <div className="absolute top-3 right-3 p-2 rounded-md bg-black/50 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              {/* Tag & Caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-blue-950 text-[10px] font-bold border border-yellow-500">
                    {photo.categoryKh}
                  </span>
                  <span className="text-slate-300 text-[11px] font-medium">
                    {photo.dateKh}
                  </span>
                </div>
                <h3 className="font-moul text-sm sm:text-base text-white line-clamp-1 group-hover:text-yellow-300 transition-colors">
                  {photo.titleKh}
                </h3>
                <p className="text-xs text-slate-300 font-kantumruy font-light line-clamp-1 mt-0.5">
                  {photo.descriptionKh}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2.5 rounded-md bg-white/10 hover:bg-blue-900 text-white transition-colors cursor-pointer z-50 border border-white/20"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-5xl w-full flex flex-col items-center">
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.titleKh}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />

            <div className="mt-4 text-center text-white max-w-xl">
              <span className="px-3 py-1 bg-yellow-400 text-blue-950 text-xs font-bold rounded-md mb-2 inline-block border border-yellow-500">
                {selectedPhoto.categoryKh}
              </span>
              <h3 className="font-moul text-lg text-yellow-300 mb-1">
                {selectedPhoto.titleKh}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-kantumruy font-light">
                {selectedPhoto.descriptionKh}
              </p>
            </div>

            {/* Navigation inside Lightbox */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-blue-900 text-white transition-colors border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-blue-900 text-white transition-colors border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
