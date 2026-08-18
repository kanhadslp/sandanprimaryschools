import { 
  AdmissionInquiryForm, 
  NewsAnnouncement, 
  GalleryPhoto, 
  SchoolStat 
} from '../types';

export interface AdmissionRecord {
  id: string;
  studentName: string;
  gender: string;
  dob: string;
  parentName: string;
  phone: string;
  telegram?: string;
  gradeApplied: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected' | 'contacted';
  adminRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface AdmissionStatsResponse {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  contacted: number;
  byGrade: Record<string, number>;
  byGender: Record<string, number>;
}

export interface BackendStatusResponse {
  status: string;
  serverStartTime: string;
  uptimeSeconds: number;
  environment: string;
  hasGeminiKey: boolean;
  metrics: {
    totalAdmissions: number;
    pendingAdmissions: number;
    approvedAdmissions: number;
    totalAnnouncements: number;
    totalGalleryPhotos: number;
    unreadMessages: number;
    memoryHeapUsedMB: number;
  };
  endpoints: Array<{
    method: string;
    path: string;
    description: string;
  }>;
}

export interface ContactMessage {
  id: string;
  senderName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'resolved';
  createdAt: string;
}

// -------------------------------------------------------------
// School API Client
// -------------------------------------------------------------
export const schoolApi = {
  // Health & System
  async getSystemStatus(): Promise<BackendStatusResponse> {
    const res = await fetch('/api/system/status');
    if (!res.ok) throw new Error('Failed to fetch system status');
    return res.json();
  },

  // Admissions
  async submitAdmission(data: AdmissionInquiryForm): Promise<{ success: boolean; data: AdmissionRecord; message: string }> {
    const res = await fetch('/api/school/admission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to submit admission form');
    }
    return res.json();
  },

  async getAdmissions(params?: { status?: string; grade?: string; search?: string }): Promise<{ total: number; data: AdmissionRecord[] }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append('status', params.status);
    if (params?.grade) searchParams.append('grade', params.grade);
    if (params?.search) searchParams.append('search', params.search);

    const res = await fetch(`/api/school/admissions?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch admissions');
    return res.json();
  },

  async getAdmissionStats(): Promise<AdmissionStatsResponse> {
    const res = await fetch('/api/school/admissions/stats');
    if (!res.ok) throw new Error('Failed to fetch admission statistics');
    return res.json();
  },

  async updateAdmissionStatus(id: string, status: AdmissionRecord['status'], adminRemarks?: string): Promise<{ success: boolean; data: AdmissionRecord }> {
    const res = await fetch(`/api/school/admissions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminRemarks }),
    });
    if (!res.ok) throw new Error('Failed to update admission status');
    return res.json();
  },

  async deleteAdmission(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/school/admissions/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete admission');
    return res.json();
  },

  // Announcements
  async getAnnouncements(): Promise<{ total: number; data: NewsAnnouncement[] }> {
    const res = await fetch('/api/school/announcements');
    if (!res.ok) throw new Error('Failed to fetch announcements');
    return res.json();
  },

  async createAnnouncement(data: Partial<NewsAnnouncement>): Promise<{ success: boolean; data: NewsAnnouncement }> {
    const res = await fetch('/api/school/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create announcement');
    return res.json();
  },

  async deleteAnnouncement(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/school/announcements/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete announcement');
    return res.json();
  },

  // Gallery
  async getGallery(): Promise<{ total: number; data: GalleryPhoto[] }> {
    const res = await fetch('/api/school/gallery');
    if (!res.ok) throw new Error('Failed to fetch gallery');
    return res.json();
  },

  async addGalleryPhoto(data: Partial<GalleryPhoto>): Promise<{ success: boolean; data: GalleryPhoto }> {
    const res = await fetch('/api/school/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to add gallery photo');
    return res.json();
  },

  async deleteGalleryPhoto(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`/api/school/gallery/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete gallery photo');
    return res.json();
  },

  // Dynamic Stats
  async getStats(): Promise<{ data: SchoolStat[] }> {
    const res = await fetch('/api/school/stats');
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Contact Messages
  async sendContactMessage(data: { senderName: string; phone: string; email?: string; subject?: string; message: string }): Promise<{ success: boolean; message: string; data: ContactMessage }> {
    const res = await fetch('/api/school/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to send contact message');
    return res.json();
  },

  async getContactMessages(): Promise<{ total: number; data: ContactMessage[] }> {
    const res = await fetch('/api/school/contact');
    if (!res.ok) throw new Error('Failed to fetch contact messages');
    return res.json();
  },

  async updateContactMessageStatus(id: string, status: 'unread' | 'read' | 'resolved'): Promise<{ success: boolean; data: ContactMessage }> {
    const res = await fetch(`/api/school/contact/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update message status');
    return res.json();
  },

  // Project Source Code Files Explorer
  async getProjectFiles(): Promise<{ total: number; files: Array<{ path: string; name: string; content: string; size: number }> }> {
    const res = await fetch('/api/project-files');
    if (!res.ok) throw new Error('Failed to fetch project files');
    return res.json();
  },

  // AI Chat
  async chatWithAi(message: string, history: Array<{ role: string; text: string }>): Promise<{ reply: string }> {
    const res = await fetch('/api/school/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationHistory: history }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to chat with AI');
    }
    return res.json();
  },
};
