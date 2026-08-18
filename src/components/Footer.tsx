import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  GraduationCap, 
  Heart, 
  ArrowUp,
  ShieldCheck,
  Send,
  CheckCircle2
} from 'lucide-react';
import { SCHOOL_INFO, schoolLogo } from '../data/schoolData';
import { schoolApi } from '../services/api';

interface FooterProps {
  onOpenAdmission: () => void;
  onOpenAiAssistant: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmission, onOpenAiAssistant, onOpenAdmin }) => {
  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName || !phone || !message) return;
    setIsSending(true);
    try {
      await schoolApi.sendContactMessage({
        senderName,
        phone,
        subject: 'សារសាកសួរពី Footer គេហទំព័រ',
        message,
      });
      setSentSuccess(true);
      setSenderName('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSentSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-2 border-yellow-400">
      
      {/* Top Pre-Footer Banner */}
      <div className="bg-blue-950 border-b border-blue-900 py-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-moul text-lg sm:text-xl text-yellow-300 mb-1">
              ស្វាគមន៍ការចុះឈ្មោះចូលរៀនឆ្នាំសិក្សាថ្មី!
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 font-kantumruy font-normal">
              ផ្តល់ឱកាសឱ្យកូនៗរបស់លោកអ្នកទទួលបានការអប់រំបឋមដ៏រឹងមាំ និងបរិយាកាសសិក្សាគំរូ។
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAdmission}
              className="px-5 py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer border border-yellow-500"
            >
              ចុះឈ្មោះចូលរៀនឥឡូវនេះ
            </button>
            <button
              onClick={onOpenAiAssistant}
              className="px-4 py-2.5 rounded-md bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs sm:text-sm font-bold backdrop-blur-xs transition-colors cursor-pointer"
            >
              សាកសួរជំនួយការ AI
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-3.5 py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-yellow-400" />
              <span>ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Col 1: School Identity & Quick Inquiry */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full p-0.5 bg-yellow-400 flex-shrink-0 shadow-sm">
                <img
                  src={schoolLogo}
                  alt="School Logo"
                  className="w-full h-full object-cover rounded-full bg-white"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="font-moul text-base text-yellow-300">
                  {SCHOOL_INFO.nameKh}
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  {SCHOOL_INFO.nameEn}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-kantumruy leading-relaxed">
              សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់ ជាគ្រឹះស្ថានអប់រំបឋមសិក្សាសាធារណៈ 
              ផ្តោតលើការកសាងចំណេះដឹងទូទៅ ភាសាខ្មែរ គណិតវិទ្យា វិទ្យាសាស្ត្រ វិន័យ សីលធម៌ និងសុខភាពកាយសម្បទា។
            </p>

            {/* Quick Contact Form to Backend */}
            <div className="mt-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h5 className="font-moul text-xs text-yellow-300 mb-2">
                ផ្ញើសារសាកសួរទៅកាន់រដ្ឋបាលសាលា
              </h5>
              {sentSuccess ? (
                <div className="bg-emerald-950 border border-emerald-800 p-3 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>សាររបស់អ្នកត្រូវបានបញ្ជូនជោគជ័យ! យើងនឹងឆ្លើយតបវិញឆាប់ៗ។</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="ឈ្មោះលោកអ្នក *"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-yellow-400"
                    />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="លេខទូរស័ព្ទ *"
                      className="px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="ខ្លឹមសារសំណួរ ឬមតិយោបល់..."
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-slate-200 focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-1.5 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-blue-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-yellow-500 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'កំពុងផ្ញើ...' : 'ផ្ញើសារ'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h5 className="font-moul text-sm text-white border-b-2 border-yellow-400 pb-1.5 inline-block w-fit">
              តំណភ្ជាប់រហ័ស
            </h5>
            <ul className="space-y-2 text-xs font-kantumruy text-slate-400">
              <li>
                <a href="#home" className="hover:text-yellow-300 transition-colors">ទំព័រដើម (Home)</a>
              </li>
              <li>
                <a href="#about" className="hover:text-yellow-300 transition-colors">អំពីសាលា & ទស្សនវិស័យ</a>
              </li>
              <li>
                <a href="#curriculum" className="hover:text-yellow-300 transition-colors">កម្មវិធីសិក្សា ថ្នាក់មត្តេយ្យ - ទី៦</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-yellow-300 transition-colors">បណ្ណាល័យរូបភាព & សកម្មភាព</a>
              </li>
              <li>
                <a href="#staff" className="hover:text-yellow-300 transition-colors">គណៈគ្រប់គ្រង & លោកគ្រូអ្នកគ្រូ</a>
              </li>
              <li>
                <a href="#news" className="hover:text-yellow-300 transition-colors">សេចក្តីជូនដំណឹង & កាលវិភាគ</a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-yellow-400 hover:underline flex items-center gap-1 mt-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ប្រព័ន្ធគ្រប់គ្រងរដ្ឋបាល (Admin Portal)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Hours */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <h5 className="font-moul text-sm text-white border-b-2 border-yellow-400 pb-1.5 inline-block w-fit">
              ព័ត៌មានទំនាក់ទំនង
            </h5>
            <div className="space-y-3 text-xs text-slate-400 font-kantumruy">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span>{SCHOOL_INFO.locationKh}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>Telegram: {SCHOOL_INFO.telegram}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                <span>ម៉ោងធ្វើការ: {SCHOOL_INFO.workingHoursKh}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright & Scroll To Top */}
      <div className="bg-slate-950 py-4 border-t border-slate-800 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-center sm:text-left font-kantumruy">
            រក្សាសិទ្ធិគ្រប់យ៉ាង &copy; {new Date().getFullYear()} {SCHOOL_INFO.nameKh} ({SCHOOL_INFO.nameEn})
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1 text-slate-400 hover:text-yellow-300 transition-colors cursor-pointer"
          >
            <span>ត្រឡប់ទៅខាងលើ</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>

    </footer>
  );
};
