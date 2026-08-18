import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Phone, 
  MapPin, 
  Sparkles, 
  GraduationCap, 
  BookOpen, 
  Image as ImageIcon, 
  Users, 
  Bell, 
  HelpCircle,
  Clock,
  HeartHandshake,
  ShieldCheck
} from 'lucide-react';
import { SCHOOL_INFO, schoolLogo } from '../data/schoolData';

interface NavbarProps {
  onOpenAdmission: () => void;
  onOpenAiAssistant: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmission,
  onOpenAiAssistant,
  onOpenAdmin,
  activeSection,
  setActiveSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', labelKh: 'ទំព័រដើម', icon: GraduationCap },
    { id: 'about', labelKh: 'អំពីសាលា', icon: BookOpen },
    { id: 'curriculum', labelKh: 'កម្មវិធីសិក្សា', icon: BookOpen },
    { id: 'gallery', labelKh: 'រូបភាពសកម្មភាព', icon: ImageIcon },
    { id: 'staff', labelKh: 'លោកគ្រូ-អ្នកគ្រូ', icon: Users },
    { id: 'news', labelKh: 'ដំណឹង & កាលវិភាគ', icon: Bell },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Royal Motto Top Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-white text-xs border-b border-blue-800/60">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Cambodian Royal Motto */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
            <span className="font-moul text-[11px] text-yellow-300 tracking-wide">
              ព្រះរាជាណាចក្រកម្ពុជា &bull; ជាតិ សាសនា ព្រះមហាក្សត្រ
            </span>
          </div>

          {/* Quick Contact Info */}
          <div className="hidden md:flex items-center gap-4 text-slate-200 text-xs">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3.5 h-3.5 text-yellow-400" />
              <span>{SCHOOL_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-yellow-400" />
              <span>{SCHOOL_INFO.locationKh}</span>
            </div>
            <div className="flex items-center gap-1.5 text-yellow-300 bg-blue-950/70 px-2 py-0.5 rounded border border-blue-800/80 font-medium">
              <Clock className="w-3.5 h-3.5 text-yellow-400" />
              <span>{SCHOOL_INFO.workingHoursKh}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b-2 border-yellow-400'
            : 'bg-white py-3 border-b-2 border-yellow-400/80 shadow-xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo & School Name */}
          <div
            id="brand-logo"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full p-0.5 bg-gradient-to-tr from-blue-900 via-yellow-400 to-blue-950 shadow-sm flex-shrink-0">
              <img
                src={schoolLogo}
                alt="Logo សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់"
                className="w-full h-full object-cover rounded-full bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="font-moul text-sm md:text-lg text-blue-950 leading-tight group-hover:text-blue-800 transition-colors">
                {SCHOOL_INFO.nameKh}
              </h1>
              <div className="flex items-center gap-2">
                <span className="text-[11px] md:text-xs font-semibold text-slate-500 tracking-normal">
                  {SCHOOL_INFO.nameEn}
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 bg-yellow-100 text-yellow-900 rounded text-[10px] font-bold border border-yellow-300">
                  ខេត្តកំពង់ធំ
                </span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'text-blue-950 bg-blue-50 font-bold border-b-2 border-yellow-400 shadow-xs'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                  <span>{item.labelKh}</span>
                </button>
              );
            })}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Admin Management Button */}
            <button
              id="btn-admin-header"
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-all active:scale-95 cursor-pointer"
              title="ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & Backend"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
              <span>រដ្ឋបាល</span>
            </button>

            {/* AI Assistant Button */}
            <button
              id="btn-ai-assistant-header"
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 shadow-2xs transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-blue-700 animate-spin" style={{ animationDuration: '8s' }} />
              <span>ជំនួយការ AI</span>
            </button>

            {/* Admission CTA Button */}
            <button
              id="btn-admission-header"
              onClick={onOpenAdmission}
              className="flex items-center gap-1.5 px-3.5 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-bold bg-yellow-400 hover:bg-yellow-300 text-blue-950 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer border border-yellow-500/60"
            >
              <HeartHandshake className="w-4 h-4 text-blue-950" />
              <span>ចុះឈ្មោះចូលរៀន</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              id="btn-ai-assistant-mobile"
              onClick={onOpenAiAssistant}
              className="p-2 rounded-md bg-blue-50 text-blue-900 border border-blue-200"
              aria-label="AI Assistant"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
            </button>
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-blue-900" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-white/98 border-b-2 border-yellow-400 shadow-xl px-4 py-4 backdrop-blur-md animate-in slide-in-from-top duration-200"
        >
          <div className="flex flex-col gap-1.5 mb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-950 font-bold border-l-4 border-yellow-400'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-900' : 'text-slate-400'}`} />
                  <span>{item.labelKh}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              id="mobile-btn-admission"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmission();
              }}
              className="w-full py-2.5 px-4 rounded-md bg-yellow-400 text-blue-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xs border border-yellow-500"
            >
              <HeartHandshake className="w-4 h-4 text-blue-950" />
              <span>ចុះឈ្មោះចូលរៀនឆ្នាំសិក្សាថ្មី</span>
            </button>

            <button
              id="mobile-btn-admin"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 px-4 rounded-md bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-300"
            >
              <ShieldCheck className="w-4 h-4 text-blue-900" />
              <span>ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & Backend</span>
            </button>

            <div className="text-xs text-slate-500 flex flex-col gap-1 mt-2 px-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-blue-900" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-blue-900" />
                <span>{SCHOOL_INFO.locationKh}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
