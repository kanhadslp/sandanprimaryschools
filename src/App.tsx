/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, HeartHandshake, PhoneCall } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { BannerSlider } from './components/BannerSlider';
import { QuickStats } from './components/QuickStats';
import { AboutSection } from './components/AboutSection';
import { CurriculumSection } from './components/CurriculumSection';
import { GallerySection } from './components/GallerySection';
import { StaffSection } from './components/StaffSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { AiAssistantModal } from './components/AiAssistantModal';
import { AdmissionModal } from './components/AdmissionModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { Footer } from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenGallery = () => {
    setActiveSection('gallery');
    const galleryEl = document.getElementById('gallery');
    if (galleryEl) {
      galleryEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-blue-900 selection:text-yellow-300">
      {/* Top Navbar */}
      <Navbar
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full flex flex-col">
        {/* Banner Slideshow - Running 1 image at a time */}
        <BannerSlider
          onOpenAdmission={() => setIsAdmissionOpen(true)}
          onOpenGallery={handleOpenGallery}
        />

        {/* Quick Statistical Numbers */}
        <QuickStats />

        {/* About School Section */}
        <AboutSection onOpenAdmission={() => setIsAdmissionOpen(true)} />

        {/* Curriculum & Grade Levels */}
        <CurriculumSection onOpenAdmission={() => setIsAdmissionOpen(true)} />

        {/* Photo Gallery & Activities */}
        <GallerySection />

        {/* Staff & Teachers */}
        <StaffSection />

        {/* Announcements & News */}
        <AnnouncementsSection onOpenAdmission={() => setIsAdmissionOpen(true)} />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmission={() => setIsAdmissionOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating Action Trigger for AI Assistant */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <button
          id="btn-floating-ai"
          onClick={() => setIsAiAssistantOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-900 hover:bg-blue-950 text-yellow-300 shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer border-2 border-yellow-400"
          aria-label="Open AI School Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-yellow-300" />
          
          {/* Tooltip on hover */}
          <span className="absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-blue-950 text-yellow-300 text-xs font-battambang whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-blue-800">
            ជំនួយការ AI សាលារៀន
          </span>
        </button>
      </div>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
      />

      <AdmissionModal
        isOpen={isAdmissionOpen}
        onClose={() => setIsAdmissionOpen(false)}
      />

      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
