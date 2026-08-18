import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Users,
  Bell,
  Image as ImageIcon,
  MessageSquare,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Download,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  Server,
  Database,
  ExternalLink,
  Phone,
  Send,
  AlertCircle,
  Code2,
  Copy,
  Check,
  FileCode,
  FolderTree,
  Sparkles
} from 'lucide-react';
import { schoolApi, AdmissionRecord, BackendStatusResponse, ContactMessage } from '../services/api';
import { NewsAnnouncement, GalleryPhoto } from '../types';
import { schoolLogo, SCHOOL_INFO } from '../data/schoolData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProjectFile {
  path: string;
  name: string;
  content: string;
  size: number;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'admissions' | 'announcements' | 'gallery' | 'messages' | 'system' | 'code'>('admissions');
  
  // Data states
  const [admissions, setAdmissions] = useState<AdmissionRecord[]>([]);
  const [announcements, setAnnouncements] = useState<NewsAnnouncement[]>([]);
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [systemStatus, setSystemStatus] = useState<BackendStatusResponse | null>(null);
  
  // Code Explorer states
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);
  
  // Loading & Filter states
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRecord | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Announcement Form State
  const [newNotice, setNewNotice] = useState({
    titleKh: '',
    categoryKh: 'សេចក្តីជូនដំណឹង',
    contentKh: '',
    isImportant: false,
    image: '',
  });

  // New Gallery Photo Form State
  const [newPhoto, setNewPhoto] = useState({
    titleKh: '',
    categoryKh: 'សកម្មភាពសាលា',
    imageUrl: '',
    descriptionKh: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadAllData();
    }
  }, [isOpen, activeTab]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'admissions') {
        const res = await schoolApi.getAdmissions({
          status: statusFilter !== 'all' ? statusFilter : undefined,
          grade: gradeFilter !== 'all' ? gradeFilter : undefined,
          search: searchQuery || undefined,
        });
        setAdmissions(res.data);
      } else if (activeTab === 'announcements') {
        const res = await schoolApi.getAnnouncements();
        setAnnouncements(res.data);
      } else if (activeTab === 'gallery') {
        const res = await schoolApi.getGallery();
        setGallery(res.data);
      } else if (activeTab === 'messages') {
        const res = await schoolApi.getContactMessages();
        setMessages(res.data);
      } else if (activeTab === 'system') {
        const res = await schoolApi.getSystemStatus();
        setSystemStatus(res);
      } else if (activeTab === 'code') {
        const res = await schoolApi.getProjectFiles();
        setProjectFiles(res.files);
        if (res.files.length > 0 && !selectedFile) {
          const defaultFile = res.files.find(f => f.path === 'src/App.tsx') || res.files[0];
          setSelectedFile(defaultFile);
        }
      }
    } catch (err) {
      console.error('Error fetching backend data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZipBlob = async () => {
    setDownloadingZip(true);
    try {
      const response = await fetch('/api/download-zip');
      if (!response.ok) throw new Error('Download failed from API');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'siem-nam-sandan-primary-school.zip';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      setActionSuccess('ការទាញយក File ZIP កំពុងដំណើរការ...');
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (error) {
      console.error('Blob download error:', error);
      // Fallback: direct window open or notification
      window.open('/api/download-zip', '_blank');
      setActionSuccess('បានបើកតំណទាញយកក្នុង Tab ថ្មី។');
      setTimeout(() => setActionSuccess(null), 4000);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleDownloadSingleFile = (file: ProjectFile) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleStatusUpdate = async (id: string, newStatus: AdmissionRecord['status']) => {
    try {
      await schoolApi.updateAdmissionStatus(id, newStatus);
      setActionSuccess(`បានកែប្រែស្ថានភាពសិស្សទៅជា «${newStatus === 'approved' ? 'បានអនុម័ត' : newStatus === 'rejected' ? 'បដិសេធ' : 'បានទាក់ទង'}»`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadAllData();
      if (selectedAdmission && selectedAdmission.id === id) {
        setSelectedAdmission({ ...selectedAdmission, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAdmission = async (id: string) => {
    if (window.confirm('តើលោកអ្នកពិតជាចង់លុបទិន្នន័យចុះឈ្មោះនេះមែនទេ?')) {
      try {
        await schoolApi.deleteAdmission(id);
        setActionSuccess('បានលុបទិន្នន័យជោគជ័យ');
        setTimeout(() => setActionSuccess(null), 3000);
        loadAllData();
        if (selectedAdmission?.id === id) setSelectedAdmission(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.titleKh || !newNotice.contentKh) return;
    try {
      await schoolApi.createAnnouncement(newNotice);
      setNewNotice({ titleKh: '', categoryKh: 'សេចក្តីជូនដំណឹង', contentKh: '', isImportant: false, image: '' });
      setActionSuccess('បានបន្ថែមសេចក្តីជូនដំណឹងថ្មីជោគជ័យ!');
      setTimeout(() => setActionSuccess(null), 3000);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('តើលោកអ្នកពិតជាចង់លុបសេចក្តីជូនដំណឹងនេះមែនទេ?')) {
      try {
        await schoolApi.deleteAnnouncement(id);
        setActionSuccess('បានលុបសេចក្តីជូនដំណឹងជោគជ័យ');
        setTimeout(() => setActionSuccess(null), 3000);
        loadAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.titleKh || !newPhoto.imageUrl) return;
    try {
      await schoolApi.addGalleryPhoto(newPhoto);
      setNewPhoto({ titleKh: '', categoryKh: 'សកម្មភាពសាលា', imageUrl: '', descriptionKh: '' });
      setActionSuccess('បានបន្ថែមរូបភាពសកម្មភាពថ្មីជោគជ័យ!');
      setTimeout(() => setActionSuccess(null), 3000);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (window.confirm('តើលោកអ្នកពិតជាចង់លុបរូបភាពនេះមែនទេ?')) {
      try {
        await schoolApi.deleteGalleryPhoto(id);
        setActionSuccess('បានលុបរូបភាពជោគជ័យ');
        setTimeout(() => setActionSuccess(null), 3000);
        loadAllData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMessageStatus = async (id: string, status: 'read' | 'resolved') => {
    try {
      await schoolApi.updateContactMessageStatus(id, status);
      setActionSuccess(`បានកែប្រែស្ថានភាពសារទៅជា «${status === 'resolved' ? 'បានដោះស្រាយ' : 'បានអាន'}»`);
      setTimeout(() => setActionSuccess(null), 3000);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-xl w-full max-w-6xl h-[92vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden border-2 border-yellow-400">
        
        {/* Top Header */}
        <div className="bg-blue-950 px-5 py-4 border-b border-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white p-0.5 border-2 border-yellow-400 flex-shrink-0">
              <img src={schoolLogo} alt="Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-moul text-sm sm:text-base text-yellow-300">
                  ផ្ទាំងគ្រប់គ្រងរដ្ឋបាល & Backend API
                </h2>
                <span className="px-2 py-0.5 bg-yellow-400 text-blue-950 font-bold text-[10px] rounded-sm uppercase tracking-wider">
                  Live Server
                </span>
              </div>
              <p className="text-xs text-slate-400 font-kantumruy">
                {SCHOOL_INFO.nameKh} &bull; ប្រព័ន្ធគ្រប់គ្រងការចុះឈ្មោះ ព័ត៌មាន និងសេវាកម្ម API
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZipBlob}
              disabled={downloadingZip}
              title="ទាញយកកូដទាំងអស់ជា File ZIP"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 text-xs font-bold transition-all shadow-xs border border-yellow-500 cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 text-blue-950 ${downloadingZip ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{downloadingZip ? 'កំពុងទាញយក...' : 'ទាញយកកូដ ZIP'}</span>
            </button>

            <button
              onClick={loadAllData}
              title="Refresh Data"
              className="p-2 rounded-md bg-blue-900/60 hover:bg-blue-900 text-yellow-300 transition-colors cursor-pointer border border-blue-800"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="bg-emerald-950 border-b border-emerald-800 px-4 py-2 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('admissions')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'admissions'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>ពាក្យចុះឈ្មោះសិស្ស ({admissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'announcements'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>សេចក្តីជូនដំណឹង ({announcements.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>បណ្ណាល័យរូបភាព ({gallery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'messages'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>សារសាកសួរ ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'system'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Backend Server & API</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'code'
                ? 'bg-yellow-400 text-blue-950 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Explorer & Export</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-900 font-kantumruy">
          
          {/* TAB 1: ADMISSIONS */}
          {activeTab === 'admissions' && (
            <div className="space-y-4">
              
              {/* Top Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                  <span className="text-[11px] text-slate-400">ពាក្យសរុប</span>
                  <p className="text-xl font-bold text-yellow-400 font-koulen">{admissions.length} នាក់</p>
                </div>
                <div className="bg-slate-950 border border-amber-900/40 rounded-lg p-3">
                  <span className="text-[11px] text-amber-400">រង់ចាំការពិនិត្យ (Pending)</span>
                  <p className="text-xl font-bold text-amber-400 font-koulen">
                    {admissions.filter((a) => a.status === 'pending').length} នាក់
                  </p>
                </div>
                <div className="bg-slate-950 border border-emerald-900/40 rounded-lg p-3">
                  <span className="text-[11px] text-emerald-400">បានអនុម័ត (Approved)</span>
                  <p className="text-xl font-bold text-emerald-400 font-koulen">
                    {admissions.filter((a) => a.status === 'approved').length} នាក់
                  </p>
                </div>
                <div className="bg-slate-950 border border-blue-900/40 rounded-lg p-3">
                  <span className="text-[11px] text-blue-400">បានទាក់ទង (Contacted)</span>
                  <p className="text-xl font-bold text-blue-400 font-koulen">
                    {admissions.filter((a) => a.status === 'contacted').length} នាក់
                  </p>
                </div>
              </div>

              {/* Filters & Export Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ស្វែងរកតាមឈ្មោះ/លេខទូរស័ព្ទ..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 w-48 sm:w-60"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                  >
                    <option value="all">ស្ថានភាពទាំងអស់</option>
                    <option value="pending">រង់ចាំការពិនិត្យ (Pending)</option>
                    <option value="approved">បានអនុម័ត (Approved)</option>
                    <option value="contacted">បានទាក់ទង (Contacted)</option>
                    <option value="rejected">បដិសេធ (Rejected)</option>
                  </select>

                  <select
                    value={gradeFilter}
                    onChange={(e) => setGradeFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-yellow-400"
                  >
                    <option value="all">គ្រប់កម្រិតថ្នាក់</option>
                    <option value="ថ្នាក់មត្តេយ្យ">ថ្នាក់មត្តេយ្យ</option>
                    <option value="ថ្នាក់ទី១">ថ្នាក់ទី១</option>
                    <option value="ថ្នាក់ទី២">ថ្នាក់ទី២</option>
                    <option value="ថ្នាក់ទី៣">ថ្នាក់ទី៣</option>
                    <option value="ថ្នាក់ទី៤">ថ្នាក់ទី៤</option>
                    <option value="ថ្នាក់ទី៥">ថ្នាក់ទី៥</option>
                    <option value="ថ្នាក់ទី៦">ថ្នាក់ទី៦</option>
                  </select>
                </div>

                <a
                  href="/api/school/admissions/export"
                  download="admissions_siem_nam_sandan.csv"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយកទិន្នន័យ (Excel CSV)</span>
                </a>
              </div>

              {/* Admissions Table */}
              <div className="bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-3">កូដពាក្យ</th>
                        <th className="p-3">ឈ្មោះសិស្ស</th>
                        <th className="p-3">ភេទ / ថ្ងៃខែកំណើត</th>
                        <th className="p-3">ថ្នាក់ស្នើសុំ</th>
                        <th className="p-3">អាណាព្យាបាល / ទូរស័ព្ទ</th>
                        <th className="p-3">ស្ថានភាព</th>
                        <th className="p-3 text-right">សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-200">
                      {admissions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500 font-kantumruy">
                            មិនមានទិន្នន័យចុះឈ្មោះត្រូវនឹងលក្ខខណ្ឌស្វែងរកនេះទេ។
                          </td>
                        </tr>
                      ) : (
                        admissions.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-3 font-mono font-bold text-yellow-400">{item.id}</td>
                            <td className="p-3 font-bold text-white">{item.studentName}</td>
                            <td className="p-3 text-slate-300">
                              {item.gender} &bull; {item.dob}
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[11px] font-bold">
                                {item.gradeApplied}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="text-white font-medium">{item.parentName}</div>
                              <div className="text-slate-400 text-[11px] flex items-center gap-1">
                                <Phone className="w-3 h-3 text-emerald-400" />
                                <span>{item.phone}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                                  item.status === 'approved'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : item.status === 'pending'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : item.status === 'contacted'
                                    ? 'bg-blue-950 text-blue-300 border border-blue-800'
                                    : 'bg-red-950 text-red-300 border border-red-800'
                                }`}
                              >
                                {item.status === 'approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                                {item.status === 'pending' && <Clock className="w-3 h-3 text-amber-400" />}
                                {item.status === 'contacted' && <Phone className="w-3 h-3 text-blue-400" />}
                                {item.status === 'rejected' && <XCircle className="w-3 h-3 text-red-400" />}
                                {item.status === 'approved'
                                  ? 'បានអនុម័ត'
                                  : item.status === 'pending'
                                  ? 'រង់ចាំពិនិត្យ'
                                  : item.status === 'contacted'
                                  ? 'បានទាក់ទង'
                                  : 'បដិសេធ'}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setSelectedAdmission(item)}
                                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                                  title="ពិនិត្យលម្អិត"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteAdmission(item.id)}
                                  className="p-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-300 hover:text-white border border-red-900"
                                  title="លុបចោល"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detail Drawer Modal */}
              {selectedAdmission && (
                <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
                  <div className="bg-slate-900 border-2 border-yellow-400 rounded-xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl animate-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <span className="text-xs text-yellow-400 font-mono font-bold">
                          {selectedAdmission.id}
                        </span>
                        <h3 className="font-moul text-base text-white">{selectedAdmission.studentName}</h3>
                      </div>
                      <button
                        onClick={() => setSelectedAdmission(null)}
                        className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">ភេទ & ថ្ងៃកំណើត:</span>
                        <span className="font-bold">{selectedAdmission.gender} &bull; {selectedAdmission.dob}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">ថ្នាក់ស្នើសុំ:</span>
                        <span className="font-bold text-yellow-300">{selectedAdmission.gradeApplied}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">អាណាព្យាបាល:</span>
                        <span className="font-bold">{selectedAdmission.parentName}</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                        <span className="text-slate-400 block mb-0.5">លេខទូរស័ព្ទ:</span>
                        <span className="font-bold text-emerald-400">{selectedAdmission.phone}</span>
                      </div>
                    </div>

                    {selectedAdmission.note && (
                      <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                        <span className="text-slate-400 block mb-1">កំណត់សម្គាល់បន្ថែម:</span>
                        <p className="text-slate-300 italic">{selectedAdmission.note}</p>
                      </div>
                    )}

                    <div className="border-t border-slate-800 pt-3">
                      <span className="text-xs text-slate-400 block mb-2">ប្តូរស្ថានភាពពាក្យចុះឈ្មោះ៖</span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate(selectedAdmission.id, 'approved')}
                          className="px-3 py-1.5 rounded bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>អនុម័ត (Approve)</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedAdmission.id, 'contacted')}
                          className="px-3 py-1.5 rounded bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>បានទាក់ទង (Contacted)</span>
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(selectedAdmission.id, 'rejected')}
                          className="px-3 py-1.5 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>បដិសេធ (Reject)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              {/* Form Add New */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h3 className="font-moul text-xs text-yellow-300 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-yellow-400" />
                  <span>បង្កើតសេចក្តីជូនដំណឹងថ្មី (Add Announcement)</span>
                </h3>

                <form onSubmit={handleAddAnnouncement} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ចំណងជើងសេចក្តីជូនដំណឹង (ជាភាសាខ្មែរ)..."
                      value={newNotice.titleKh}
                      onChange={(e) => setNewNotice({ ...newNotice, titleKh: e.target.value })}
                      required
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                    />

                    <select
                      value={newNotice.categoryKh}
                      onChange={(e) => setNewNotice({ ...newNotice, categoryKh: e.target.value })}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="សេចក្តីជូនដំណឹង">សេចក្តីជូនដំណឹងទូទៅ</option>
                      <option value="ការប្រឡង">ការប្រឡង & តេស្ត</option>
                      <option value="ការចុះឈ្មោះ">ការចុះឈ្មោះសិស្សថ្មី</option>
                      <option value="ព្រឹត្តិការណ៍">ព្រឹត្តិការណ៍សាលា</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="url"
                      placeholder="តំណភ្ជាប់រូបភាព Image URL (ស្រេចចិត្ត)..."
                      value={newNotice.image}
                      onChange={(e) => setNewNotice({ ...newNotice, image: e.target.value })}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                    />

                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-900 px-3 py-2 rounded border border-slate-700">
                      <input
                        type="checkbox"
                        checked={newNotice.isImportant}
                        onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                        className="rounded text-yellow-400 focus:ring-0"
                      />
                      <span>ជាដំណឹងសំខាន់ (Important Alert)</span>
                    </label>
                  </div>

                  <textarea
                    rows={3}
                    placeholder="ខ្លឹមសារលម្អិតនៃសេចក្តីជូនដំណឹង..."
                    value={newNotice.contentKh}
                    onChange={(e) => setNewNotice({ ...newNotice, contentKh: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ផ្សាយសេចក្តីជូនដំណឹង</span>
                  </button>
                </form>
              </div>

              {/* List of Announcements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {announcements.map((item) => (
                  <div key={item.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex gap-3 justify-between">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-950 text-yellow-300 border border-blue-800 text-[10px] font-bold">
                          {item.categoryKh}
                        </span>
                        {item.isImportant && (
                          <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 text-[10px] font-bold">
                            សំខាន់
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">{item.dateKh}</span>
                      </div>
                      <h4 className="font-bold text-white text-xs sm:text-sm font-battambang">{item.titleKh}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{item.contentKh}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="p-2 h-fit rounded bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-900"
                      title="លុប"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Form Add Photo */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h3 className="font-moul text-xs text-yellow-300 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-yellow-400" />
                  <span>បញ្ចូលរូបភាពសកម្មភាពថ្មី (Add Gallery Photo)</span>
                </h3>

                <form onSubmit={handleAddPhoto} className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="ចំណងជើងរូបភាព (ឧទាហរណ៍៖ ការហាត់ប្រាណពេលព្រឹក)..."
                      value={newPhoto.titleKh}
                      onChange={(e) => setNewPhoto({ ...newPhoto, titleKh: e.target.value })}
                      required
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                    />

                    <select
                      value={newPhoto.categoryKh}
                      onChange={(e) => setNewPhoto({ ...newPhoto, categoryKh: e.target.value })}
                      className="px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value="ហាត់ប្រាណ & កីឡា">ហាត់ប្រាណ & កីឡា</option>
                      <option value="ជួរគោរពទង់ជាតិ">ជួរគោរពទង់ជាតិ</option>
                      <option value="បន្ទប់រៀន">បន្ទប់រៀន</option>
                      <option value="បណ្ណាល័យ">បណ្ណាល័យ</option>
                      <option value="បរិវេណសាលា">បរិវេណសាលា</option>
                    </select>
                  </div>

                  <input
                    type="url"
                    placeholder="តំណភ្ជាប់រូបភាព Image URL (https://...)..."
                    value={newPhoto.imageUrl}
                    onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                  />

                  <textarea
                    rows={2}
                    placeholder="ការពិពណ៌នារូបភាពសង្ខេប..."
                    value={newPhoto.descriptionKh}
                    onChange={(e) => setNewPhoto({ ...newPhoto, descriptionKh: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-yellow-400"
                  />

                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>បញ្ចូលរូបភាពទៅក្នុងបណ្ណាល័យ</span>
                  </button>
                </form>
              </div>

              {/* Photo Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((photo) => (
                  <div key={photo.id} className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800 group relative">
                    <div className="aspect-[4/3] bg-slate-900">
                      <img src={photo.imageUrl} alt={photo.titleKh} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 text-xs space-y-1">
                      <span className="text-[10px] text-yellow-400 block font-bold">{photo.categoryKh}</span>
                      <h4 className="font-bold text-white text-xs truncate">{photo.titleKh}</h4>
                    </div>
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute top-2 right-2 p-1.5 bg-red-900/90 hover:bg-red-800 text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {messages.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 bg-slate-950 rounded-lg border border-slate-800">
                    មិនទាន់មានសារសាកសួរពីអាណាព្យាបាលនៅឡើយទេ។
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`bg-slate-950 p-4 rounded-lg border ${
                        msg.status === 'unread' ? 'border-yellow-400/80 bg-slate-950' : 'border-slate-800 opacity-80'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2 mb-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{msg.senderName}</span>
                          <span className="text-emerald-400 font-mono">({msg.phone})</span>
                          {msg.email && <span className="text-slate-400">&bull; {msg.email}</span>}
                        </div>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(msg.createdAt).toLocaleString('km-KH')}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <h4 className="font-bold text-yellow-300">{msg.subject}</h4>
                        <p className="text-slate-300 leading-relaxed">{msg.message}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            msg.status === 'unread'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : msg.status === 'resolved'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-blue-950 text-blue-400 border border-blue-800'
                          }`}
                        >
                          {msg.status === 'unread' ? 'មិនទាន់អាន' : msg.status === 'resolved' ? 'បានដោះស្រាយ' : 'បានអាន'}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMessageStatus(msg.id, 'read')}
                            className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 rounded text-[11px] font-bold"
                          >
                            សម្គាល់ថាបានអាន
                          </button>
                          <button
                            onClick={() => handleMessageStatus(msg.id, 'resolved')}
                            className="px-2.5 py-1 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded text-[11px] font-bold"
                          >
                            សម្គាល់ថាបានដោះស្រាយ
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: SYSTEM & BACKEND STATUS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              
              {/* Project Source Code ZIP Download Card */}
              <div className="bg-gradient-to-r from-blue-950 to-slate-950 p-5 rounded-lg border-2 border-yellow-400/80 shadow-md space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5 text-yellow-400" />
                      <h3 className="font-moul text-sm text-yellow-300">
                        ទាញយកកូដគម្រោងទាំងមូលជា File ZIP
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300">
                      កញ្ចប់ ZIP រួមបញ្ចូល Source Code ទាំងអស់ (React, Express, Tailwind CSS, TypeScript, Assets, និង Config) សម្រាប់ Deploy ឬយកទៅកែច្នៃបន្ត។
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleDownloadZipBlob}
                      disabled={downloadingZip}
                      className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs rounded-md shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-yellow-500 disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-blue-950" />
                      <span>{downloadingZip ? 'កំពុងទាញយក...' : 'ទាញយក File .ZIP ឥឡូវនេះ'}</span>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab('code')}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-yellow-300 font-bold text-xs rounded-md shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                    >
                      <Code2 className="w-4 h-4 text-yellow-400" />
                      <span>មើល និងចម្លងកូដ (Code Explorer)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Health Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Server Health Status</span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <p className="text-xl font-bold text-emerald-400 uppercase">ONLINE 200 OK</p>
                  <p className="text-[11px] text-slate-500">Running on Node.js / Express Backend</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Server Uptime</span>
                  <p className="text-xl font-bold text-yellow-300 font-koulen">
                    {systemStatus?.uptimeSeconds ? `${Math.floor(systemStatus.uptimeSeconds / 60)} នាទី ${systemStatus.uptimeSeconds % 60} វិនាទី` : 'Live'}
                  </p>
                  <p className="text-[11px] text-slate-500">Memory Heap: {systemStatus?.metrics.memoryHeapUsedMB || 24} MB</p>
                </div>

                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400">Gemini AI Assistant</span>
                  <p className="text-xl font-bold text-blue-400">
                    {systemStatus?.hasGeminiKey ? 'CONNECTED' : 'STANDALONE KNOWLEDGE'}
                  </p>
                  <p className="text-[11px] text-slate-500">Model: Gemini 2.5 Flash + Thinking Mode</p>
                </div>
              </div>

              {/* Endpoints Table */}
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
                <h3 className="font-moul text-xs text-yellow-300 flex items-center gap-2">
                  <Database className="w-4 h-4 text-yellow-400" />
                  <span>បញ្ជីផ្លូវតភ្ជាប់ API Endpoints របស់ Backend</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Method</th>
                        <th className="p-2.5">Endpoint Path</th>
                        <th className="p-2.5">ការងារមុខងារ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {systemStatus?.endpoints ? (
                        systemStatus.endpoints.map((ep, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50">
                            <td className="p-2.5 font-bold">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] ${
                                  ep.method === 'GET'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : ep.method === 'POST'
                                    ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                    : ep.method === 'PATCH'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                    : 'bg-red-950 text-red-400 border border-red-800'
                                }`}
                              >
                                {ep.method}
                              </span>
                            </td>
                            <td className="p-2.5 text-slate-200">{ep.path}</td>
                            <td className="p-2.5 font-kantumruy text-slate-400">{ep.description}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="p-4 text-center text-slate-500 font-kantumruy">
                            កំពុងផ្ទុកបញ្ជី Endpoints...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 6: CODE EXPLORER & DIRECT EXPORTER */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              
              {/* Instructions Bar */}
              <div className="bg-blue-950/60 p-4 rounded-lg border border-blue-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>មើល និងចម្លងកូដដោយផ្ទាល់ (Code Explorer & File Exporter)</span>
                  </div>
                  <p className="text-slate-300">
                    ប្រសិនបើ Browser របស់អ្នករារាំងការទាញយក File ZIP ដោយសារ iFrame sandbox លោកអ្នកអាចជ្រើសរើស File នីមួយៗខាងក្រោម ហើយចុច **«ចម្លងកូដ (Copy Code)»** ឬ **«ទាញយក File នេះ»** ដោយឥតគិតថ្លៃ។
                  </p>
                </div>

                <button
                  onClick={handleDownloadZipBlob}
                  disabled={downloadingZip}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-yellow-500 flex-shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក ZIP ទាំងមូល</span>
                </button>
              </div>

              {/* Code Viewer Layout */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-[480px]">
                
                {/* File Tree / List */}
                <div className="md:col-span-4 bg-slate-950 rounded-lg border border-slate-800 p-3 overflow-y-auto space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase px-2 py-1 flex items-center gap-1.5 border-b border-slate-800 mb-2">
                    <FolderTree className="w-3.5 h-3.5 text-yellow-400" />
                    <span>បញ្ជី File គម្រោង ({projectFiles.length})</span>
                  </div>

                  {projectFiles.map((file) => (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFile(file)}
                      className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        selectedFile?.path === file.path
                          ? 'bg-yellow-400 text-blue-950 font-bold'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileCode className={`w-3.5 h-3.5 flex-shrink-0 ${selectedFile?.path === file.path ? 'text-blue-950' : 'text-yellow-400'}`} />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className={`text-[10px] ${selectedFile?.path === file.path ? 'text-blue-950/70' : 'text-slate-500'}`}>
                        {(file.size / 1024).toFixed(1)}k
                      </span>
                    </button>
                  ))}
                </div>

                {/* Code Preview & Actions */}
                <div className="md:col-span-8 bg-slate-950 rounded-lg border border-slate-800 flex flex-col overflow-hidden">
                  {selectedFile ? (
                    <>
                      {/* Code Header Actions */}
                      <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-yellow-400" />
                          <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
                          <span className="text-[10px] text-slate-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyCode(selectedFile.content)}
                            className="px-3 py-1 bg-blue-900 hover:bg-blue-800 text-yellow-300 rounded text-xs font-bold flex items-center gap-1.5 border border-blue-700 transition-colors cursor-pointer"
                          >
                            {copiedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSuccess ? 'បានចម្លងរួចរាល់!' : 'ចម្លងកូដ (Copy)'}</span>
                          </button>

                          <button
                            onClick={() => handleDownloadSingleFile(selectedFile)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            title="ទាញយកឯកសារនេះ"
                          >
                            <Download className="w-3.5 h-3.5 text-yellow-400" />
                            <span className="hidden sm:inline">ទាញយក File នេះ</span>
                          </button>
                        </div>
                      </div>

                      {/* Code Editor Body */}
                      <pre className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 bg-slate-950 leading-relaxed select-all">
                        <code>{selectedFile.content}</code>
                      </pre>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                      សូមជ្រើសរើស File មួយពីបញ្ជីខាងឆ្វេងដើម្បីមើលកូដ
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Backend Version: 2.0.0 (Express + TypeScript + Vite)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold rounded transition-colors cursor-pointer border border-yellow-500"
          >
            បិទផ្ទាំងគ្រប់គ្រង
          </button>
        </div>

      </div>
    </div>
  );
};
