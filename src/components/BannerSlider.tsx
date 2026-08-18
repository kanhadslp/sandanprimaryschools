import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Sliders, 
  Plus, 
  Sparkles, 
  Info,
  CheckCircle2,
  Calendar,
  Volume2,
  VolumeX,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SlideItem } from '../types';
import { BANNER_SLIDES } from '../data/schoolData';

interface BannerSliderProps {
  onOpenAdmission: () => void;
  onOpenGallery: () => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  onOpenAdmission,
  onOpenGallery,
}) => {
  const [slides, setSlides] = useState<SlideItem[]>(BANNER_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedInterval, setSpeedInterval] = useState(5000); // 5 seconds default
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [progress, setProgress] = useState(0);

  // New slide upload inputs
  const [newSlideTitle, setNewSlideTitle] = useState('');
  const [newSlideDesc, setNewSlideDesc] = useState('');
  const [newSlideImageUrl, setNewSlideImageUrl] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
    setProgress(0);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Slideshow auto-advance timer
  useEffect(() => {
    if (!isPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    const stepMs = 50;
    const increment = (stepMs / speedInterval) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + increment;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, speedInterval, nextSlide]);

  const currentSlide = slides[currentIndex] || slides[0];

  // Handle local image file upload for the custom slider manager
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setNewSlideImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlideTitle || !newSlideImageUrl) return;

    const newSlide: SlideItem = {
      id: `custom-slide-${Date.now()}`,
      titleKh: newSlideTitle,
      titleEn: "Custom School Activity Banner",
      subtitleKh: newSlideDesc || "សកម្មភាពថ្មីៗរបស់សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់",
      subtitleEn: "Recent primary school educational event",
      badgeKh: "សកម្មភាពថ្មី",
      badgeEn: "New Activity",
      descriptionKh: newSlideDesc || "រូបភាពសកម្មភាពថ្មីបន្ថែមដោយគណៈគ្រប់គ្រងសាលា។",
      descriptionEn: "New school banner added to the slideshow gallery.",
      image: newSlideImageUrl,
      tag: "សកម្មភាព",
    };

    setSlides([...slides, newSlide]);
    setNewSlideTitle('');
    setNewSlideDesc('');
    setNewSlideImageUrl('');
    setShowManageModal(false);
    setCurrentIndex(slides.length); // Jump to new slide
  };

  return (
    <section 
      id="home"
      className="relative w-full bg-slate-950 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Banner Tag / School Indicator */}
      <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between text-slate-300 text-xs z-20 relative">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-medium text-slate-200">ផ្ទាំងទិដ្ឋភាព & សកម្មភាពសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់</span>
        </div>

        {/* Speed Controls & Tooling */}
        <div className="flex items-center gap-2 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800 backdrop-blur-xs">
          <button
            id="btn-toggle-autoplay"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={isPlaying ? "ផ្អាកស្លាយ (Pause)" : "បន្តស្លាយ (Play)"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 text-amber-400" />
                <span className="hidden sm:inline">ផ្អាក</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-emerald-400" />
                <span className="hidden sm:inline">ដំណើរការ</span>
              </>
            )}
          </button>

          <span className="text-slate-700">|</span>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-[11px]">
            <span className="text-slate-400 hidden md:inline">ល្បឿន:</span>
            {[3000, 5000, 8000].map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  setSpeedInterval(speed);
                  setProgress(0);
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                  speedInterval === speed
                    ? 'bg-blue-900 text-yellow-300 font-bold border border-yellow-400/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed / 1000}វិនាទី
              </button>
            ))}
          </div>

          <span className="text-slate-700">|</span>

          {/* Lightbox / Expand */}
          <button
            id="btn-expand-banner"
            onClick={() => setLightboxOpen(true)}
            className="text-slate-400 hover:text-white p-1"
            title="មើលរូបភាពពេញអេក្រង់ (Full screen)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Add Slide Modal */}
          <button
            id="btn-manage-slides"
            onClick={() => setShowManageModal(true)}
            className="text-yellow-400 hover:text-yellow-300 p-1 flex items-center gap-1 text-[11px]"
            title="បន្ថែមរូបភាពស្លាយថ្មី (Add new slide)"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">បន្ថែមរូប</span>
          </button>
        </div>
      </div>

      {/* Main Slider Viewport */}
      <div className="relative w-full max-w-7xl mx-auto px-4 pb-6">
        <div className="relative aspect-[16/9] md:aspect-[21/9] lg:aspect-[2.4/1] w-full rounded-xl overflow-hidden shadow-2xl bg-slate-900 border-2 border-slate-800 group">
          
          {/* Animated Slide Transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {/* Background Image */}
              <img
                src={currentSlide.image}
                alt={currentSlide.titleKh}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />

              {/* Multi-layered Gradients for Perfect Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-950/30 to-transparent"></div>

              {/* Slide Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-10 lg:p-12 flex flex-col justify-end max-w-3xl">
                
                {/* Badge Tag */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="flex items-center gap-2 mb-2 sm:mb-3"
                >
                  <span className="px-3 py-1 bg-yellow-400 text-blue-950 border border-yellow-500 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-950 animate-ping"></span>
                    {currentSlide.badgeKh}
                  </span>
                  <span className="text-slate-300 text-xs font-medium px-2 py-0.5 bg-black/40 rounded-md backdrop-blur-xs border border-white/10">
                    ស្លាយទី {currentIndex + 1} នៃ {slides.length}
                  </span>
                </motion.div>

                {/* Main Heading in Khmer Display Font */}
                <motion.h2
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="font-moul text-lg sm:text-2xl md:text-3xl lg:text-4xl text-white tracking-wide leading-snug drop-shadow-md mb-2"
                >
                  {currentSlide.titleKh}
                </motion.h2>

                {/* Subtitle / Description */}
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-xs sm:text-sm md:text-base text-slate-200 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 max-w-2xl font-kantumruy font-normal leading-relaxed drop-shadow-xs"
                >
                  {currentSlide.descriptionKh}
                </motion.p>

                {/* Action Buttons & Highlight Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="flex flex-wrap items-center gap-3"
                >
                  <button
                    id="btn-slide-admission"
                    onClick={onOpenAdmission}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer border border-yellow-500"
                  >
                    <span>ចុះឈ្មោះចូលរៀន</span>
                    <ChevronRight className="w-4 h-4 text-blue-950" />
                  </button>

                  <button
                    id="btn-slide-gallery"
                    onClick={onOpenGallery}
                    className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-md bg-white/15 hover:bg-white/25 text-white border border-white/30 font-semibold text-xs sm:text-sm backdrop-blur-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>ទស្សនារូបភាពទាំងអស់</span>
                  </button>

                  {currentSlide.highlightStats && (
                    <div className="hidden md:flex items-center gap-2 ml-2 px-3 py-1.5 bg-blue-950/80 rounded-md border border-yellow-400/30 backdrop-blur-md text-xs">
                      <span className="font-koulen text-yellow-400 text-base">{currentSlide.highlightStats.number}</span>
                      <span className="text-slate-200 text-[11px] font-medium">{currentSlide.highlightStats.labelKh}</span>
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Chevrons */}
          <button
            id="btn-prev-slide"
            onClick={prevSlide}
            aria-label="រូបភាពមុន (Previous Slide)"
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-blue-900/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-lg z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            id="btn-next-slide"
            onClick={nextSlide}
            aria-label="រូបភាពបន្ទាប់ (Next Slide)"
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-blue-900/90 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95 cursor-pointer shadow-lg z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Top-Right Lightbox Trigger */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute top-4 right-4 p-2 rounded-md bg-black/50 text-white hover:bg-black/80 border border-white/20 backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="ពង្រីករូបភាពពេញអេក្រង់"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Bottom Countdown Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-yellow-400 to-amber-300 transition-all ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Thumbnail Preview Strip & Dot Indicators */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Slide Indicators / Dots */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                id={`btn-dot-slide-${idx}`}
                onClick={() => goToSlide(idx)}
                className={`transition-all duration-300 rounded-sm ${
                  currentIndex === idx
                    ? 'w-8 h-2 bg-yellow-400'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Mini Thumbnails with Active Glow */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {slides.map((slide, idx) => {
              const isActive = currentIndex === idx;
              return (
                <div
                  key={`thumb-${slide.id}`}
                  onClick={() => goToSlide(idx)}
                  className={`relative cursor-pointer rounded-md overflow-hidden transition-all flex-shrink-0 ${
                    isActive
                      ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-slate-950 scale-105 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  }`}
                  style={{ width: '70px', height: '42px' }}
                >
                  <img
                    src={slide.image}
                    alt={slide.titleKh}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-white bg-black/60 px-1 rounded">
                    {idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox Modal (Full-Screen HD Review) */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <button
            id="btn-close-lightbox"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 p-2.5 rounded-md bg-white/10 hover:bg-blue-900 text-white transition-all cursor-pointer z-50 border border-white/20"
            aria-label="Close fullscreen view"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center">
            <img
              src={currentSlide.image}
              alt={currentSlide.titleKh}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
            
            <div className="mt-4 text-center text-white max-w-2xl">
              <span className="px-3 py-1 bg-yellow-400 text-blue-950 text-xs font-bold rounded-md mb-2 inline-block border border-yellow-500">
                {currentSlide.badgeKh}
              </span>
              <h3 className="font-moul text-lg md:text-xl text-yellow-300 mb-1">
                {currentSlide.titleKh}
              </h3>
              <p className="text-slate-300 text-xs md:text-sm font-light">
                {currentSlide.descriptionKh}
              </p>
            </div>

            {/* Navigation inside Lightbox */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-blue-900 text-white transition-colors border border-white/20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-blue-900 text-white transition-colors border border-white/20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Add / Manage Slides Modal */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border-2 border-yellow-400/40 rounded-xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowManageModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
              <Plus className="w-5 h-5 text-yellow-400" />
              <h3 className="font-moul text-base text-yellow-300">បន្ថែមរូបភាពផ្ទាំងស្លាយថ្មី</h3>
            </div>

            <form onSubmit={handleAddCustomSlide} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">ចំណងជើងរូបភាព (Khmer Title)</label>
                <input
                  type="text"
                  required
                  value={newSlideTitle}
                  onChange={(e) => setNewSlideTitle(e.target.value)}
                  placeholder="ឧ. សកម្មភាពប្រកួតកីឡាបាល់ទាត់សិស្ស..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">ការពិពណ៌នាខ្លី (Short Description)</label>
                <textarea
                  rows={2}
                  value={newSlideDesc}
                  onChange={(e) => setNewSlideDesc(e.target.value)}
                  placeholder="ពិពណ៌នាអំពីសកម្មភាពក្នុងរូបភាព..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-sm text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">ជ្រើសរើសរូបភាព ឬបញ្ចូល URL</label>
                
                {/* File Upload Option */}
                <label className="border-2 border-dashed border-slate-700 hover:border-yellow-400 rounded-md p-3 flex flex-col items-center justify-center gap-1 cursor-pointer bg-slate-800/60 mb-2">
                  <Upload className="w-5 h-5 text-yellow-400" />
                  <span className="text-xs text-slate-300">ចុចដើម្បីជ្រើសរើសរូបភាពពីកុំព្យូទ័រ/ទូរស័ព្ទ</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* Direct Image URL input */}
                <input
                  type="url"
                  value={newSlideImageUrl}
                  onChange={(e) => setNewSlideImageUrl(e.target.value)}
                  placeholder="ឬបិទភ្ជាប់តំណ URL រូបភាព..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              {newSlideImageUrl && (
                <div className="rounded-md overflow-hidden border border-slate-700 h-28 bg-slate-950">
                  <img
                    src={newSlideImageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowManageModal(false)}
                  className="px-4 py-2 rounded-md text-xs text-slate-300 hover:text-white"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  disabled={!newSlideTitle || !newSlideImageUrl}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-950 font-bold rounded-md text-xs flex items-center gap-1.5 border border-yellow-500 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-blue-950" />
                  <span>បញ្ចូលផ្ទាំងស្លាយ</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
