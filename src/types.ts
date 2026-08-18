export interface SlideItem {
  id: string;
  titleKh: string;
  titleEn: string;
  subtitleKh: string;
  subtitleEn: string;
  badgeKh: string;
  badgeEn: string;
  descriptionKh: string;
  descriptionEn: string;
  image: string;
  tag: string;
  highlightStats?: {
    number: string;
    labelKh: string;
  };
}

export interface SchoolStat {
  id: string;
  labelKh: string;
  labelEn: string;
  value: string;
  iconName: string;
  descriptionKh: string;
  descriptionEn: string;
  trendKh?: string;
}

export interface GradeItem {
  id: string;
  gradeNumber: string;
  titleKh: string;
  titleEn: string;
  ageRange: string;
  classCount: number;
  totalStudents: number;
  mainSubjectsKh: string[];
  descriptionKh: string;
  iconColor: string;
  badgeText: string;
}

export interface TeacherItem {
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

export interface NewsAnnouncement {
  id: string;
  titleKh: string;
  titleEn: string;
  category: 'announcement' | 'event' | 'academic' | 'activity';
  categoryKh: string;
  dateKh: string;
  dateIso: string;
  excerptKh: string;
  contentKh: string;
  isImportant?: boolean;
  image?: string;
}

export interface GalleryPhoto {
  id: string;
  titleKh: string;
  titleEn: string;
  category: 'assembly' | 'exercise' | 'classroom' | 'library' | 'sports' | 'environment';
  categoryKh: string;
  imageUrl: string;
  dateKh: string;
  descriptionKh: string;
}

export interface AdmissionInquiryForm {
  studentName: string;
  gender: string;
  dob: string;
  parentName: string;
  phone: string;
  telegram: string;
  gradeApplied: string;
  note: string;
}

export interface SchoolPillar {
  id: string;
  number: string;
  titleKh: string;
  titleEn: string;
  descKh: string;
  iconName: string;
  colorClass: string;
}
