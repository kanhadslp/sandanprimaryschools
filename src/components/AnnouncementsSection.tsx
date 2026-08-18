import React, { useState, useEffect } from 'react';
import { Bell, ChevronRight, AlertCircle, X, Sparkles } from 'lucide-react';
import { ANNOUNCEMENTS } from '../data/schoolData';
import { schoolApi } from '../services/api';
import { NewsAnnouncement } from '../types';

export const AnnouncementsSection: React.FC<{ onOpenAdmission: () => void }> = ({ onOpenAdmission }) => {
  const [items, setItems] = useState<NewsAnnouncement[]>(ANNOUNCEMENTS);
  const [selectedNews, setSelectedNews] = useState<NewsAnnouncement | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await schoolApi.getAnnouncements();
        if (res.data && res.data.length > 0) {
          setItems(res.data);
        }
      } catch (err) {
        // Fallback to static seed
        console.log('Using local fallback for announcements:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <section id="news" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-100 text-blue-950 border border-yellow-300 text-xs font-bold mb-3">
              <Bell className="w-4 h-4 text-blue-900" />
              <span>សេចក្តីជូនដំណឹង & ព្រឹត្តិការណ៍</span>
            </div>
            <h2 className="font-moul text-2xl md:text-3xl text-blue-950 leading-snug">
              ព័ត៌មានថ្មីៗពីសាលារៀន
            </h2>
            <p className="text-sm text-slate-600 font-kantumruy mt-1 max-w-xl">
              តាមដានដំណឹងសំខាន់ៗ កាលបរិច្ឆេទប្រឡង ការចុះឈ្មោះចូលរៀន និងព្រឹត្តិការណ៍សាលា។
            </p>
          </div>

          <button
            onClick={onOpenAdmission}
            className="px-5 py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer self-start md:self-auto border border-yellow-500"
          >
            <span>ចុះឈ្មោះចូលរៀនឆ្នាំសិក្សាថ្មី</span>
            <ChevronRight className="w-4 h-4 text-blue-950" />
          </button>
        </div>

        {/* Announcements Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 border-t-4 border-t-blue-900 hover:border-t-yellow-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 cursor-pointer"
            >
              {item.image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-200">
                  <img
                    src={item.image}
                    alt={item.titleKh}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {item.isImportant && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-900 text-yellow-300 text-[11px] font-bold rounded-md shadow-sm flex items-center gap-1 border border-yellow-400">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                      សំខាន់
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 px-2.5 py-0.5 bg-blue-950/80 backdrop-blur-xs text-white text-[10px] rounded-md font-medium">
                    {item.dateKh}
                  </span>
                </div>
              )}

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-900 border border-blue-200">
                      {item.categoryKh}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 font-battambang line-clamp-2 group-hover:text-blue-900 transition-colors mb-2">
                    {item.titleKh}
                  </h3>

                  <p className="text-xs text-slate-600 font-kantumruy font-normal leading-relaxed line-clamp-3">
                    {item.contentKh}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-blue-900 font-bold font-battambang">
                  <span>អានសេចក្តីលម្អិត</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* News Detail Lightbox / Modal */}
        {selectedNews && (
          <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-yellow-400">
              <div className="bg-blue-950 p-4 text-white flex items-center justify-between border-b border-blue-900">
                <span className="px-2 py-0.5 bg-yellow-400 text-blue-950 font-bold text-xs rounded">
                  {selectedNews.categoryKh}
                </span>
                <button
                  onClick={() => setSelectedNews(null)}
                  className="p-1 rounded-md text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedNews.image && (
                <div className="aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                  <img
                    src={selectedNews.image}
                    alt={selectedNews.titleKh}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-5 space-y-3 font-kantumruy">
                <span className="text-xs text-slate-400 block">{selectedNews.dateKh}</span>
                <h3 className="font-moul text-base text-blue-950 leading-snug">
                  {selectedNews.titleKh}
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedNews.contentKh}
                </p>
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-yellow-300 font-bold text-xs rounded border border-yellow-400"
                  >
                    បិទ
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
