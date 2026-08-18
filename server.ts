import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server Start Time for Uptime tracking
const SERVER_START_TIME = new Date();

// ==========================================
// 1. GEMINI AI CLIENT INITIALIZATION
// ==========================================
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// ==========================================
// 2. IN-MEMORY PERSISTENT DATABASE ENGINE
// ==========================================

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
  status: "pending" | "approved" | "rejected" | "contacted";
  adminRemarks?: string;
  submittedAt: string;
  reviewedAt?: string;
}

export interface AnnouncementRecord {
  id: string;
  titleKh: string;
  titleEn: string;
  category: "announcement" | "event" | "academic" | "activity";
  categoryKh: string;
  dateKh: string;
  dateIso: string;
  excerptKh: string;
  contentKh: string;
  isImportant?: boolean;
  image?: string;
  createdAt: string;
}

export interface GalleryRecord {
  id: string;
  titleKh: string;
  titleEn: string;
  category: "assembly" | "exercise" | "classroom" | "library" | "sports" | "environment";
  categoryKh: string;
  imageUrl: string;
  dateKh: string;
  descriptionKh: string;
  createdAt: string;
}

export interface TeacherRecord {
  id: string;
  nameKh: string;
  nameEn: string;
  roleKh: string;
  roleEn: string;
  gradeOrSubjectKh: string;
  experienceYears: number;
  photoUrl: string;
  quoteKh: string;
  honorTitleKh?: string;
}

export interface ContactMessageRecord {
  id: string;
  senderName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
}

export interface SchoolStatRecord {
  id: string;
  labelKh: string;
  labelEn: string;
  value: string;
  iconName: string;
  descriptionKh: string;
  descriptionEn: string;
  trendKh?: string;
}

// Initial Database Seeding
const admissionsDb: AdmissionRecord[] = [
  {
    id: "ADM-2026-081401",
    studentName: "សុខ វិសាល",
    gender: "ប្រុស",
    dob: "2020-04-12",
    parentName: "សុខ សុភា",
    phone: "012 884 920",
    telegram: "@sok_sophea",
    gradeApplied: "ថ្នាក់ទី១ (កម្រិតដំបូង)",
    note: "កុមារមានសុខភាពល្អ និងចូលចិត្តគំនូរ",
    status: "approved",
    adminRemarks: "បានផ្ទៀងផ្ទាត់សំបុត្រកំណើត និងឯកសារគ្រប់គ្រាន់",
    submittedAt: "2026-08-14T08:30:00.000Z",
    reviewedAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "ADM-2026-081502",
    studentName: "ចាន់ ធីតា",
    gender: "ស្រី",
    dob: "2021-06-25",
    parentName: "ចាន់ វណ្ណារ៉ា",
    phone: "097 554 8831",
    telegram: "",
    gradeApplied: "ថ្នាក់មត្តេយ្យសិក្សា",
    note: "ចុះឈ្មោះចូលរៀនថ្នាក់ត្រៀមបឋម",
    status: "pending",
    submittedAt: "2026-08-15T14:15:00.000Z",
  },
  {
    id: "ADM-2026-081603",
    studentName: "ហេង ពិសិដ្ឋ",
    gender: "ប្រុស",
    dob: "2019-11-03",
    parentName: "ហេង រតនៈ",
    phone: "088 923 1102",
    telegram: "@heng_rotanak",
    gradeApplied: "ថ្នាក់ទី២ (ពង្រឹងការអាន-សរសេរ)",
    note: "ផ្លាស់ប្តូរទីលំនៅមកពីស្រុកផ្សេង",
    status: "contacted",
    adminRemarks: "បានទូរស័ព្ទណែនាំឱ្យយកសៀវភៅតាមដានការសិក្សាពីសាលាចាស់",
    submittedAt: "2026-08-16T10:45:00.000Z",
    reviewedAt: "2026-08-16T15:20:00.000Z",
  },
];

const announcementsDb: AnnouncementRecord[] = [
  {
    id: "news-1",
    titleKh: "សេចក្តីជូនដំណឹងស្តីពីការចុះឈ្មោះចូលរៀនឆ្នាំសិក្សាថ្មី",
    titleEn: "New Academic Year Student Enrollment Notice",
    category: "announcement",
    categoryKh: "សេចក្តីជូនដំណឹង",
    dateKh: "១៥ សីហា ២០២៦",
    dateIso: "2026-08-15",
    isImportant: true,
    excerptKh: "សាលាបើកទទួលពាក្យចុះឈ្មោះសិស្សថ្មីថ្នាក់មត្តេយ្យ និងថ្នាក់ទី១ ដល់ទី៦ ចាប់ពីថ្ងៃនេះតទៅ។",
    contentKh: "គណៈគ្រប់គ្រងសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់ សូមជម្រាបជូនដំណឹងដល់មាតាបិតា និងអាណាព្យាបាលសិស្សទាំងអស់ឱ្យបានជ្រាបថា សាលាចាប់ផ្តើមទទួលចុះឈ្មោះសិស្សថ្មីសម្រាប់ឆ្នាំសិក្សាថ្មី។ សូមភ្ជាប់មកជាមួយនូវ សំបុត្រកំណើតសិស្ស និងសៀវភៅគ្រួសារ ឬសៀវភៅស្នាក់នៅ។",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-15T00:00:00.000Z",
  },
  {
    id: "news-2",
    titleKh: "កម្មវិធីប្រកួតអានសៀវភៅ និងសរសេរតាមអានប្រចាំឆមាស",
    titleEn: "Mid-Term Reading & Dictation Competition",
    category: "activity",
    categoryKh: "សកម្មភាពសិក្សា",
    dateKh: "១០ សីហា ២០២៦",
    dateIso: "2026-08-10",
    excerptKh: "លើកកម្ពស់សមត្ថភាពអាន និងសរសេរអក្សរខ្មែរឱ្យបានស្ទាត់ជំនាញដល់សិស្សានុសិស្សគ្រប់កម្រិតថ្នាក់។",
    contentKh: "ការប្រកួតប្រជែងអានសៀវភៅ និងសរសេរតាមអាន ត្រូវបានរៀបចំឡើងយ៉ាងផុសផុលក្នុងបណ្ណាល័យសាលា ដោយមានការចូលរួមពីប្អូនៗសិស្សានុសិស្សថ្នាក់ទី១ ដល់ទី៦។ ជ័យលាភីទទួលបានរង្វាន់សៀវភៅ និងសម្ភារៈសិក្សាជាច្រើន។",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-10T00:00:00.000Z",
  },
  {
    id: "news-3",
    titleKh: "យុទ្ធនាការដាំកូនឈើ និងថែរក្សាបរិស្ថានសាលារៀនស្អាត",
    titleEn: "Green Tree Planting & Clean Campus Campaign",
    category: "event",
    categoryKh: "ព្រឹត្តិការណ៍សាលា",
    dateKh: "០២ សីហា ២០២៦",
    dateIso: "2026-08-02",
    excerptKh: "លោកគ្រូ អ្នកគ្រូ និងសិស្សានុសិស្សរួមគ្នាដាំកូនឈើជាង ២០០ ដើម ដើម្បីបង្កើនម្លប់បៃតង។",
    contentKh: "ដើម្បីគាំទ្រចលនាសាលារៀនស្អាតគ្មានសំរាមប្លាស្ទិក និងបរិស្ថានបៃតង លោកគ្រូអ្នកគ្រូ និងសិស្សានុសិស្សបានរួមគ្នាដាំកូនឈើហូបផ្លែ និងឈើម្លប់នៅក្នុងបរិវេណសាលា ព្រមទាំងបោសសម្អាតទីធ្លាឱ្យមានរបៀបរៀបរយល្អ។",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&auto=format&fit=crop&q=80",
    createdAt: "2026-08-02T00:00:00.000Z",
  },
];

const galleryDb: GalleryRecord[] = [
  {
    id: "g1",
    titleKh: "សកម្មភាពហាត់ប្រាណពេលព្រឹក",
    titleEn: "Morning Fitness Routine",
    category: "exercise",
    categoryKh: "ហាត់ប្រាណ & កីឡា",
    imageUrl: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80",
    dateKh: "សីហា ២០២៦",
    descriptionKh: "សិស្សានុសិស្សក្នុងឯកសណ្ឋានក្រហម-ស ហាត់ប្រាណដោយស្វាហាប់លើទីធ្លាសាលា។",
    createdAt: "2026-08-12T00:00:00.000Z",
  },
  {
    id: "g2",
    titleKh: "ការគោរពទង់ជាតិ និងសំពះគំនាប់",
    titleEn: "Flag Assembly & Respect Ceremony",
    category: "assembly",
    categoryKh: "ជួរគោរពទង់ជាតិ",
    imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80",
    dateKh: "សីហា ២០២៦",
    descriptionKh: "ជួរតម្រង់យ៉ាងមានរបៀបរៀបរយ និងការលើកដៃសំពះបង្ហាញពីសីលធម៌ខ្ពស់។",
    createdAt: "2026-08-11T00:00:00.000Z",
  },
  {
    id: "g3",
    titleKh: "ទិដ្ឋភាពពីលើអាកាសនៃបរិវេណសាលា",
    titleEn: "Campus Aerial Drone View",
    category: "assembly",
    categoryKh: "បរិវេណសាលា",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    dateKh: "សីហា ២០២៦",
    descriptionKh: "ខ្លោងទ្វារស្ថាបត្យកម្មប្រពៃណីខ្មែរ ទីធ្លាធំទូលាយ និងម្លប់ឈើបៃតងស្រស់។",
    createdAt: "2026-08-10T00:00:00.000Z",
  },
];

const contactMessagesDb: ContactMessageRecord[] = [
  {
    id: "MSG-001",
    senderName: "អ៊ុំ ចាន់នី",
    phone: "012 449 881",
    email: "channy.oum@gmail.com",
    subject: "សាកសួរអំពីម៉ោងរៀនបន្ថែម និងបណ្ណាល័យ",
    message: "សូមសាកសួរថាតើបណ្ណាល័យសាលាបើកឱ្យសិស្សានុសិស្សអានសៀវភៅនៅថ្ងៃសៅរ៍ដែរឬទេ?",
    status: "unread",
    createdAt: "2026-08-16T11:20:00.000Z",
  },
  {
    id: "MSG-002",
    senderName: "គង់ វិបុល",
    phone: "097 882 1144",
    subject: "ការបរិច្ចាគសៀវភៅអំណានសម្រាប់បណ្ណាល័យ",
    message: "ខ្ញុំចង់ឧបត្ថម្ភសៀវភៅរឿងនិទានខ្មែរ និងគំនូរកុមារចំនួន ៥០ ក្បាល ជូនសាលា។",
    status: "read",
    createdAt: "2026-08-14T16:05:00.000Z",
  },
];

const statsDb: SchoolStatRecord[] = [
  {
    id: "stat-students",
    labelKh: "សិស្សានុសិស្សសរុប",
    labelEn: "Total Enrolled Students",
    value: "៦៨៥",
    iconName: "GraduationCap",
    descriptionKh: "ប្រុស ៣៣០ នាក់ / ស្រី ៣៥៥ នាក់",
    descriptionEn: "330 Boys / 355 Girls across all cohorts",
    trendKh: "+៨% ធៀបនឹងឆ្នាំមុន",
  },
  {
    id: "stat-teachers",
    labelKh: "លោកគ្រូ-អ្នកគ្រូ & បុគ្គលិក",
    labelEn: "Qualified Teachers & Staff",
    value: "២៦",
    iconName: "Users",
    descriptionKh: "គរុគ្រូមានគរុកោសល្យ និងបទពិសោធន៍ខ្ពស់",
    descriptionEn: "Certified primary pedagogues & mentors",
    trendKh: "១០០% មានសញ្ញាបត្រគរុកោសល្យ",
  },
  {
    id: "stat-classrooms",
    labelKh: "បន្ទប់រៀន & បណ្ណាល័យ",
    labelEn: "Classrooms & Learning Hubs",
    value: "១៦",
    iconName: "Building2",
    descriptionKh: "បន្ទប់សិក្សាបំពាក់សម្ភារៈឧបទេសទំនើប",
    descriptionEn: "Equipped with books, STEM kits & learning tools",
    trendKh: "រួមទាំងបណ្ណាល័យគំរូ ១ បន្ទប់",
  },
  {
    id: "stat-success",
    labelKh: "អត្រាឡើងថ្នាក់ & គុណភាព",
    labelEn: "Annual Promotion Pass Rate",
    value: "៩៩.៤%",
    iconName: "Award",
    descriptionKh: "អត្រាជាប់ឡើងថ្នាក់ និងបញ្ចប់បឋមសិក្សា",
    descriptionEn: "Outstanding achievement in national standards",
    trendKh: "ជាប់ចំណាត់ថ្នាក់សាលាល្អឆ្នើម",
  },
];

// ==========================================
// 3. BACKEND REST API ENDPOINTS
// ==========================================

// --- Health Check & System Status ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    school: "សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់",
    version: "2.0.0-fullstack",
    uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME.getTime()) / 1000),
  });
});

app.get("/api/system/status", (_req: Request, res: Response) => {
  const memUsage = process.memoryUsage();
  res.json({
    status: "online",
    serverStartTime: SERVER_START_TIME.toISOString(),
    uptimeSeconds: Math.floor((Date.now() - SERVER_START_TIME.getTime()) / 1000),
    environment: process.env.NODE_ENV || "development",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    metrics: {
      totalAdmissions: admissionsDb.length,
      pendingAdmissions: admissionsDb.filter((a) => a.status === "pending").length,
      approvedAdmissions: admissionsDb.filter((a) => a.status === "approved").length,
      totalAnnouncements: announcementsDb.length,
      totalGalleryPhotos: galleryDb.length,
      unreadMessages: contactMessagesDb.filter((m) => m.status === "unread").length,
      memoryHeapUsedMB: Math.round(memUsage.heapUsed / 1024 / 1024),
    },
    endpoints: [
      { method: "GET", path: "/api/health", description: "Health check" },
      { method: "GET", path: "/api/school/admissions", description: "List all admissions with filtering" },
      { method: "POST", path: "/api/school/admission", description: "Submit new student enrollment" },
      { method: "PATCH", path: "/api/school/admissions/:id", description: "Update admission status/remarks" },
      { method: "DELETE", path: "/api/school/admissions/:id", description: "Delete admission record" },
      { method: "GET", path: "/api/school/admissions/stats", description: "Admission analytics" },
      { method: "GET", path: "/api/school/announcements", description: "List school announcements" },
      { method: "POST", path: "/api/school/announcements", description: "Publish announcement" },
      { method: "DELETE", path: "/api/school/announcements/:id", description: "Remove announcement" },
      { method: "GET", path: "/api/school/gallery", description: "List gallery items" },
      { method: "POST", path: "/api/school/gallery", description: "Upload/add gallery photo" },
      { method: "GET", path: "/api/school/stats", description: "School dynamic statistics" },
      { method: "POST", path: "/api/school/contact", description: "Send parent message/inquiry" },
      { method: "GET", path: "/api/school/contact", description: "List parent inquiries" },
      { method: "POST", path: "/api/school/chat", description: "Gemini AI School Assistant API" },
    ],
  });
});

// --- Admissions API ---
app.get("/api/school/admissions", (req: Request, res: Response) => {
  const { status, grade, search } = req.query;
  let results = [...admissionsDb];

  if (status && typeof status === "string" && status !== "all") {
    results = results.filter((item) => item.status === status);
  }

  if (grade && typeof grade === "string" && grade !== "all") {
    results = results.filter((item) => item.gradeApplied.includes(grade));
  }

  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter(
      (item) =>
        item.studentName.toLowerCase().includes(q) ||
        item.parentName.toLowerCase().includes(q) ||
        item.phone.includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }

  // Sort by newest first
  results.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  res.json({
    total: results.length,
    data: results,
  });
});

app.get("/api/school/admissions/stats", (_req: Request, res: Response) => {
  const total = admissionsDb.length;
  const pending = admissionsDb.filter((a) => a.status === "pending").length;
  const approved = admissionsDb.filter((a) => a.status === "approved").length;
  const rejected = admissionsDb.filter((a) => a.status === "rejected").length;
  const contacted = admissionsDb.filter((a) => a.status === "contacted").length;

  const byGrade: Record<string, number> = {};
  admissionsDb.forEach((a) => {
    byGrade[a.gradeApplied] = (byGrade[a.gradeApplied] || 0) + 1;
  });

  const byGender: Record<string, number> = {
    ប្រុស: admissionsDb.filter((a) => a.gender === "ប្រុស").length,
    ស្រី: admissionsDb.filter((a) => a.gender === "ស្រី").length,
  };

  res.json({
    total,
    pending,
    approved,
    rejected,
    contacted,
    byGrade,
    byGender,
  });
});

app.post("/api/school/admission", (req: Request, res: Response) => {
  try {
    const { studentName, gender, dob, parentName, phone, telegram, gradeApplied, note } = req.body;
    if (!studentName || !parentName || !phone || !gradeApplied) {
      return res.status(400).json({ error: "Missing required fields (studentName, parentName, phone, gradeApplied)" });
    }

    const uniqueId = `ADM-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const newRecord: AdmissionRecord = {
      id: uniqueId,
      studentName: studentName.trim(),
      gender: gender || "មិនបានបញ្ជាក់",
      dob: dob || "",
      parentName: parentName.trim(),
      phone: phone.trim(),
      telegram: telegram?.trim() || "",
      gradeApplied: gradeApplied.trim(),
      note: note?.trim() || "",
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    admissionsDb.unshift(newRecord);

    return res.status(201).json({
      success: true,
      message: `ពាក្យចុះឈ្មោះរបស់សិស្ស «${studentName}» ត្រូវបានកត់ត្រាក្នុងប្រព័ន្ធជោគជ័យ!`,
      data: newRecord,
    });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to process admission", details: err.message });
  }
});

app.patch("/api/school/admissions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body;

  const recordIndex = admissionsDb.findIndex((a) => a.id === id);
  if (recordIndex === -1) {
    return res.status(404).json({ error: "Admission record not found" });
  }

  if (status) {
    admissionsDb[recordIndex].status = status;
  }
  if (adminRemarks !== undefined) {
    admissionsDb[recordIndex].adminRemarks = adminRemarks;
  }
  admissionsDb[recordIndex].reviewedAt = new Date().toISOString();

  return res.json({
    success: true,
    message: "ស្ថានភាពពាក្យចុះឈ្មោះត្រូវបានកែប្រែជោគជ័យ!",
    data: admissionsDb[recordIndex],
  });
});

app.delete("/api/school/admissions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const initialLength = admissionsDb.length;
  const filtered = admissionsDb.filter((a) => a.id !== id);

  if (filtered.length === initialLength) {
    return res.status(404).json({ error: "Record not found" });
  }

  admissionsDb.length = 0;
  admissionsDb.push(...filtered);

  return res.json({ success: true, message: "បានលុបទិន្នន័យចុះឈ្មោះរួចរាល់" });
});

// CSV Export Endpoint
app.get("/api/school/admissions/export", (_req: Request, res: Response) => {
  const header = "ID,Student Name,Gender,DOB,Parent Name,Phone,Telegram,Grade Applied,Status,Submitted At\n";
  const rows = admissionsDb
    .map(
      (a) =>
        `"${a.id}","${a.studentName}","${a.gender}","${a.dob}","${a.parentName}","${a.phone}","${a.telegram || ""}","${a.gradeApplied}","${a.status}","${a.submittedAt}"`
    )
    .join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="admissions_siem_nam_sandan.csv"');
  res.send("\uFEFF" + header + rows); // \uFEFF BOM for Excel Khmer text rendering
});

// --- Announcements API ---
app.get("/api/school/announcements", (_req: Request, res: Response) => {
  res.json({
    total: announcementsDb.length,
    data: announcementsDb,
  });
});

app.post("/api/school/announcements", (req: Request, res: Response) => {
  const { titleKh, titleEn, category, categoryKh, dateKh, excerptKh, contentKh, isImportant, image } = req.body;
  if (!titleKh || !contentKh) {
    return res.status(400).json({ error: "Title and content in Khmer are required" });
  }

  const newAnnouncement: AnnouncementRecord = {
    id: `news-${Date.now()}`,
    titleKh,
    titleEn: titleEn || "",
    category: category || "announcement",
    categoryKh: categoryKh || "សេចក្តីជូនដំណឹង",
    dateKh: dateKh || "ថ្ងៃនេះ",
    dateIso: new Date().toISOString().split("T")[0],
    excerptKh: excerptKh || contentKh.slice(0, 100) + "...",
    contentKh,
    isImportant: Boolean(isImportant),
    image: image || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80",
    createdAt: new Date().toISOString(),
  };

  announcementsDb.unshift(newAnnouncement);
  return res.status(201).json({ success: true, data: newAnnouncement });
});

app.delete("/api/school/announcements/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = announcementsDb.findIndex((n) => n.id === id);
  if (index === -1) return res.status(404).json({ error: "Announcement not found" });

  announcementsDb.splice(index, 1);
  return res.json({ success: true, message: "បានលុបសេចក្តីជូនដំណឹងជោគជ័យ" });
});

// --- Gallery API ---
app.get("/api/school/gallery", (_req: Request, res: Response) => {
  res.json({ total: galleryDb.length, data: galleryDb });
});

app.post("/api/school/gallery", (req: Request, res: Response) => {
  const { titleKh, titleEn, category, categoryKh, imageUrl, dateKh, descriptionKh } = req.body;
  if (!titleKh || !imageUrl) {
    return res.status(400).json({ error: "Title and image URL are required" });
  }

  const newPhoto: GalleryRecord = {
    id: `g-${Date.now()}`,
    titleKh,
    titleEn: titleEn || "",
    category: category || "assembly",
    categoryKh: categoryKh || "សកម្មភាពសាលា",
    imageUrl,
    dateKh: dateKh || "សីហា ២០២៦",
    descriptionKh: descriptionKh || "",
    createdAt: new Date().toISOString(),
  };

  galleryDb.unshift(newPhoto);
  return res.status(201).json({ success: true, data: newPhoto });
});

app.delete("/api/school/gallery/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const index = galleryDb.findIndex((g) => g.id === id);
  if (index === -1) return res.status(404).json({ error: "Photo not found" });

  galleryDb.splice(index, 1);
  return res.json({ success: true, message: "បានលុបរូបភាពរួចរាល់" });
});

// --- Stats API ---
app.get("/api/school/stats", (_req: Request, res: Response) => {
  res.json({ data: statsDb });
});

app.post("/api/school/stats", (req: Request, res: Response) => {
  const { stats } = req.body;
  if (Array.isArray(stats)) {
    statsDb.length = 0;
    statsDb.push(...stats);
    return res.json({ success: true, data: statsDb });
  }
  return res.status(400).json({ error: "Invalid stats array format" });
});

// --- Contact Messages API ---
app.get("/api/school/contact", (_req: Request, res: Response) => {
  res.json({ total: contactMessagesDb.length, data: contactMessagesDb });
});

app.post("/api/school/contact", (req: Request, res: Response) => {
  const { senderName, phone, email, subject, message } = req.body;
  if (!senderName || !phone || !message) {
    return res.status(400).json({ error: "Name, phone, and message are required" });
  }

  const newMsg: ContactMessageRecord = {
    id: `MSG-${Date.now().toString().slice(-4)}`,
    senderName: senderName.trim(),
    phone: phone.trim(),
    email: email?.trim() || "",
    subject: subject?.trim() || "សាកសួរព័ត៌មានទូទៅ",
    message: message.trim(),
    status: "unread",
    createdAt: new Date().toISOString(),
  };

  contactMessagesDb.unshift(newMsg);
  return res.status(201).json({
    success: true,
    message: "សាររបស់អ្នកត្រូវបានផ្ញើជូនរដ្ឋបាលសាលាជោគជ័យ! យើងនឹងឆ្លើយតបវិញក្នុងពេលឆាប់ៗ។",
    data: newMsg,
  });
});

app.patch("/api/school/contact/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const msg = contactMessagesDb.find((m) => m.id === id);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  if (status) msg.status = status;
  return res.json({ success: true, data: msg });
});

// --- Download Project ZIP API ---
app.get("/api/download-zip", (_req: Request, res: Response) => {
  const zipPath = path.join(process.cwd(), "siem-nam-sandan-school.zip");
  if (fs.existsSync(zipPath)) {
    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="siem-nam-sandan-primary-school-source.zip"');
    return res.sendFile(zipPath);
  }
  return res.status(404).json({ error: "Zip file not found" });
});

// --- Get Project Files for in-app Code Explorer ---
app.get("/api/project-files", (_req: Request, res: Response) => {
  try {
    const rootDir = process.cwd();
    const resultFiles: { path: string; name: string; content: string; size: number }[] = [];
    
    function scanDir(currentDir: string, relPrefix = "") {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        if (
          entry.name === "node_modules" ||
          entry.name === "dist" ||
          entry.name === ".git" ||
          entry.name.endsWith(".zip") ||
          entry.name.startsWith(".")
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, entry.name);
        const relPath = relPrefix ? `${relPrefix}/${entry.name}` : entry.name;

        if (entry.isDirectory()) {
          scanDir(fullPath, relPath);
        } else if (entry.isFile()) {
          const stats = fs.statSync(fullPath);
          if (stats.size < 500000) { // Limit to files < 500KB
            try {
              const content = fs.readFileSync(fullPath, "utf-8");
              resultFiles.push({
                path: relPath,
                name: entry.name,
                content,
                size: stats.size,
              });
            } catch (e) {
              // binary or unreadable
            }
          }
        }
      }
    }

    scanDir(rootDir);
    return res.json({ total: resultFiles.length, files: resultFiles });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// --- Gemini AI Assistant API with Reasoning & Context ---
app.post("/api/school/chat", async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getAiClient();

    // If Gemini key is not configured, reply with smart grounded knowledge
    if (!ai) {
      const lower = message.toLowerCase();
      let smartAnswer = `សូមស្វាគមន៍មកកាន់ សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់! ខ្ញុំជាជំនួយការ AI របស់សាលា។`;

      if (lower.includes("ចុះឈ្មោះ") || lower.includes("ចូលរៀន") || lower.includes("ឯកសារ")) {
        smartAnswer = `📋 **ព័ត៌មានចុះឈ្មោះចូលរៀន**៖\n- សាលាបើកទទួលពាក្យចុះឈ្មោះសិស្សថ្មីសម្រាប់ថ្នាក់មត្តេយ្យ (អាយុ ៥ ឆ្នាំ) និងថ្នាក់ទី១ (អាយុ ៦ ឆ្នាំឡើង) រហូតដល់ថ្នាក់ទី៦។\n- **ឯកសារតម្រូវ**៖ សំបុត្រកំណើតកុមារ (ច្បាប់ចម្លង) និងសៀវភៅគ្រួសារ/ស្នាក់នៅ។\n- លោកអ្នកអាចចុះឈ្មោះអនឡាញតាមប៊ូតុង «ចុះឈ្មោះចូលរៀន» នៅលើគេហទំព័រនេះផ្ទាល់!`;
      } else if (lower.includes("ម៉ោង") || lower.includes("ពេល") || lower.includes("កាលវិភាគ")) {
        smartAnswer = `⏰ **កាលវិភាគសិក្សា**៖\n- **វេនព្រឹក**៖ ៧:០០ ព្រឹក - ១១:០០ ព្រឹក (មានការតម្រង់ជួរ និងហាត់ប្រាណពេលព្រឹក ៦:៤៥ ព្រឹក)\n- **វេនរសៀល**៖ ១:០០ រសៀល - ៥:០០ ល្ងាច\n- សាលារៀនពីថ្ងៃចន្ទ ដល់ ថ្ងៃសៅរ៍។`;
      } else if (lower.includes("ខោអាវ") || lower.includes("ឯកសណ្ឋាន") || lower.includes("អាវ")) {
        smartAnswer = `👕 **ឯកសណ្ឋានសិស្ស**៖\n- **ឯកសណ្ឋានកីឡា**៖ អាវយឺតកីឡាពណ៌ក្រហម-ស (Maroon & White) សម្រាប់ថ្ងៃហាត់ប្រាណ និងកីឡា។\n- **ឯកសណ្ឋានធម្មតា**៖ អាវស ខោ/សំពត់ពណ៌ខៀវចាស់ សម្រាប់ម៉ោងសិក្សាទូទៅ។`;
      } else if (lower.includes("ទីតាំង") || lower.includes("នៅឯណា") || lower.includes("លេខទូរស័ព្ទ")) {
        smartAnswer = `📍 **ទីតាំង & ទំនាក់ទំនង**៖\n- ទីតាំង៖ ឃុំសណ្ដាន់ ស្រុកសណ្ដាន់ ខេត្តកំពង់ធំ\n- ទូរស័ព្ទ៖ 012 849 203 / 097 554 1122\n- អ៊ីមែល៖ siemnamsandan.school@gmail.com\n- Telegram៖ @SiemNamSandan_Admin`;
      } else {
        smartAnswer = `សូមស្វាគមន៍មកកាន់ **សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់**! ខ្ញុំជាជំនួយការ AI របស់សាលា។ លោកអ្នកអាចសាកសួរព័ត៌មានអំពី៖\n- ការចុះឈ្មោះចូលរៀនថ្នាក់មត្តេយ្យ ដល់ ថ្នាក់ទី៦\n- កាលវិភាគសិក្សា និងឯកសណ្ឋានសិស្ស\n- កម្មវិធីអប់រំកាយ សីលធម៌ គុណធម៌ខ្មែរ\n- កាលបរិច្ឆេទប្រឡង និងព្រឹត្តិការណ៍សាលា`;
      }

      return res.json({ reply: smartAnswer });
    }

    const systemInstruction = `
You are the official smart AI Assistant and Education Counselor for "សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់" (Siem Nam Sandan Primary School in Sandan District, Kampong Thom Province, Cambodia).
Your role:
1. Warmly and respectfully assist parents, students, teachers, and visitors in fluent, polite Khmer language.
2. Official School Knowledge:
   - Name: សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់ (Siem Nam Sandan Primary School)
   - Location: ឃុំសណ្ដាន់ ស្រុកសណ្ដាន់ ខេត្តកំពង់ធំ
   - Principal: លោក គឹម សុវណ្ណារ៉ា
   - Total Students: ៦៨៥ នាក់ (ប្រុស ៣៣០ នាក់ / ស្រី ៣៥៥ នាក់)
   - Teachers & Staff: ២៦ នាក់
   - Classrooms: ១៦ បន្ទប់ (រួមទាំងបណ្ណាល័យគំរូ)
   - Core Values: វិន័យ សីលធម៌ គុណភាព សុខភាព និងសាមគ្គីភាព
   - Uniforms: Dark red/maroon & white sports uniform for morning assembly/exercise; white shirt & dark navy bottom for regular classes.
   - Grades: Kindergarten (ថ្នាក់មត្តេយ្យសិក្សា) to Grade 6 (ថ្នាក់ទី៦).
   - Core Routine: Morning gymnastics exercise, national anthem & flag assembly, sompeah ethics, clean green campus, reading hours.
   - Sessions: Morning 7:00 AM - 11:00 AM | Afternoon 1:00 PM - 5:00 PM.
3. Tone: Respectful, warm, pedagogical, child-friendly, encouraging, and informative.
4. When students ask for homework guidance (Khmer orthography, math problem solving, general science), explain step-by-step in clear, easy-to-understand Khmer.
`;

    const formattedHistory = conversationHistory
      .slice(-6)
      .map((item: { role: string; text: string }) => `${item.role === "user" ? "សំណួរ" : "ចម្លើយ"}: ${item.text}`)
      .join("\n");

    const fullPrompt = `${formattedHistory ? `ប្រវត្តិសន្ទនាពីមុន:\n${formattedHistory}\n\n` : ""}សំណួរថ្មីពីអ្នកប្រើប្រាស់: ${message}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    const replyText = response.text || "សូមអភ័យទោស ខ្ញុំមិនអាចស្វែងរកចម្លើយបាននៅពេលនេះទេ។ សូមព្យាយាមម្តងទៀត។";

    return res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({
      error: "Error processing request",
      details: error.message || "Unknown error",
      fallbackReply: "សូមអភ័យទោស មានបញ្ហាបច្ចេកទេសមួយភ្លែត។ សូមសាកសួរម្តងទៀត ឬទាក់ទងការិយាល័យរដ្ឋបាលសាលាផ្ទាល់។",
    });
  }
});

// ==========================================
// 4. VITE MIDDLEWARE & STATIC ASSET SERVER
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Sieng Nam Sandan School Backend running on http://localhost:${PORT}`);
  });
}

startServer();
