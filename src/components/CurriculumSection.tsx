import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle, 
  Calendar, 
  Sparkles, 
  GraduationCap, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { GRADE_LEVELS } from '../data/schoolData';
import classroomImg from '../assets/images/school_classroom_study_1786954844921.jpg';
import libraryImg from '../assets/images/school_library_reading_1786954860755.jpg';

export const CurriculumSection: React.FC<{ onOpenAdmission: () => void }> = ({ onOpenAdmission }) => {
  const [selectedGradeId, setSelectedGradeId] = useState<string>('grade-1');

  const activeGrade = GRADE_LEVELS.find((g) => g.id === selectedGradeId) || GRADE_LEVELS[1];

  const dailySchedule = [
    { timeKh: '៦:៤៥ - ៧:០០ ព្រឹក', titleKh: 'សិស្សមកដល់សាលា & ត្រៀមខ្លួន', descKh: 'រៀបចំកាតាប និងសម្ភារៈសិក្សា' },
    { timeKh: '៧:០០ - ៧:៣០ ព្រឹក', titleKh: 'គោរពទង់ជាតិ & ហាត់ប្រាណកាយសម្បទា', descKh: 'តម្រង់ជួរ គោរពទង់ជាតិ សំពះគំនាប់ និងហាត់ប្រាណរាល់ព្រឹក' },
    { timeKh: '៧:៣០ - ៩:១៥ ព្រឹក', titleKh: 'ម៉ោងសិក្សាទី១ & ទី២', descKh: 'ភាសាខ្មែរ (អក្សរផ្ចង់ វេយ្យាករណ៍ និងការអាន)' },
    { timeKh: '៩:១៥ - ៩:៤៥ ព្រឹក', titleKh: 'ម៉ោងលម្ហែកាយ & អាហារពេលព្រឹក', descKh: 'លេងកីឡា ល្បែងអប់រំ និងអនាម័យទឹកស្អាត' },
    { timeKh: '៩:៤៥ - ១១:០០ ព្រឹក', titleKh: 'ម៉ោងសិក្សាទី៣ & ទី៤', descKh: 'គណិតវិទ្យា វិទ្យាសាស្ត្រ ឬអប់រំកាយ' },
    { timeKh: '១:០០ - ៥:០០ ល្ងាច', titleKh: 'វេនរសៀល (សម្រាប់ថ្នាក់វេនទី២)', descKh: 'អនុវត្តកម្មវិធីសិក្សាពេញលេញតាមកម្រិតថ្នាក់' },
  ];

  return (
    <section id="curriculum" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-3">
            <BookOpen className="w-4 h-4 text-blue-900" />
            <span>កម្មវិធីសិក្សាជាតិ & ថ្នាក់រៀន</span>
          </div>
          <h2 className="font-moul text-2xl md:text-3xl text-blue-950 leading-snug mb-3">
            ថ្នាក់សិក្សាពី មត្តេយ្យ ដល់ ថ្នាក់ទី៦
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-kantumruy leading-relaxed">
            អនុវត្តតាមស្តង់ដារកម្មវិធីសិក្សាគោលរបស់ក្រសួងអប់រំ យុវជន និងកីឡា 
            ដោយរួមបញ្ចូលវិធីសាស្ត្របង្រៀនទំនើប និងការយកចិត្តទុកដាក់ខ្ពស់លើសិស្សម្នាក់ៗ។
          </p>
        </div>

        {/* Grade Tabs Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 justify-start lg:justify-center scrollbar-none">
          {GRADE_LEVELS.map((grade) => {
            const isSelected = grade.id === selectedGradeId;
            return (
              <button
                key={grade.id}
                id={`btn-tab-${grade.id}`}
                onClick={() => setSelectedGradeId(grade.id)}
                className={`px-4 py-2.5 rounded-md font-battambang text-xs md:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-yellow-300 shadow-md border-b-2 border-yellow-400'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span>{grade.titleKh}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-bold ${
                  isSelected ? 'bg-yellow-400 text-blue-950' : 'bg-slate-100 text-slate-500'
                }`}>
                  {grade.totalStudents} នាក់
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Grade Detail Card */}
        <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 border border-slate-200 border-t-4 border-t-blue-900 shadow-sm mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-xs font-bold">
                  {activeGrade.badgeText}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {activeGrade.ageRange}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  {activeGrade.classCount} បន្ទប់ថ្នាក់ &bull; {activeGrade.totalStudents} នាក់
                </span>
              </div>

              <div>
                <h3 className="font-moul text-xl sm:text-2xl text-blue-950 mb-2">
                  {activeGrade.titleKh}
                </h3>
                <p className="text-sm text-slate-600 font-kantumruy leading-relaxed">
                  {activeGrade.descriptionKh}
                </p>
              </div>

              {/* Subjects List */}
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">
                  មុខវិជ្ជាគោល & សកម្មភាពសំខាន់ៗ
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeGrade.mainSubjectsKh.map((subject, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center gap-2.5"
                    >
                      <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-900 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-slate-800 font-battambang">
                        {subject}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admission CTA */}
              <div className="pt-3 flex items-center gap-4">
                <button
                  onClick={onOpenAdmission}
                  className="px-5 py-2.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-2 cursor-pointer border border-yellow-500"
                >
                  <span>ចុះឈ្មោះចូលរៀនថ្នាក់នេះ</span>
                  <ChevronRight className="w-4 h-4 text-blue-950" />
                </button>
              </div>
            </div>

            {/* Right Side: Learning Atmosphere Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden shadow-md border-2 border-slate-200 aspect-[4/3]">
                <img
                  src={classroomImg}
                  alt="បន្ទប់រៀនសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] bg-yellow-400 text-blue-950 px-2 py-0.5 rounded-md font-bold border border-yellow-500">
                    បរិយាកាសក្នុងថ្នាក់
                  </span>
                  <p className="text-xs text-slate-100 mt-1 font-kantumruy font-light">
                    ការបង្រៀនដោយយកចិត្តទុកដាក់ និងភាពរួសរាយរាក់ទាក់
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Daily School Timetable & Routine */}
        <div className="bg-white rounded-xl p-6 sm:p-8 md:p-10 border border-slate-200 border-t-4 border-t-blue-900 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-yellow-100 text-blue-950 border border-yellow-300 text-xs font-bold mb-2">
                <Calendar className="w-3.5 h-3.5 text-blue-900" />
                <span>កាលវិភាគប្រចាំថ្ងៃ</span>
              </div>
              <h3 className="font-moul text-lg sm:text-xl text-blue-950">
                កាលវិភាគសិក្សា & របៀបរៀបរយប្រចាំថ្ងៃ
              </h3>
            </div>
            <p className="text-xs md:text-sm text-slate-500 max-w-md font-kantumruy">
              ការបែងចែកពេលវេលាប្រកបដោយតុល្យភាព រវាងការសិក្សាចំណេះដឹង ការហាត់ប្រាណកាយសម្បទា និងការអានសៀវភៅ។
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailySchedule.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 border-l-4 border-l-blue-900 hover:border-l-yellow-400 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 border border-blue-200">
                      {item.timeKh}
                    </span>
                    <span className="text-xs font-koulen text-slate-400">#{idx + 1}</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 font-battambang mb-1">
                    {item.titleKh}
                  </h4>
                  <p className="text-xs text-slate-600 font-kantumruy leading-relaxed">
                    {item.descKh}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
