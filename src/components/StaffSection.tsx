import React from 'react';
import { Users, Award, BookOpen, Heart, Sparkles } from 'lucide-react';
import { TEACHERS_LIST } from '../data/schoolData';

export const StaffSection: React.FC = () => {
  return (
    <section id="staff" className="py-16 md:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-3">
            <Users className="w-4 h-4 text-blue-900" />
            <span>គណៈគ្រប់គ្រង & គ្រូបង្រៀន</span>
          </div>
          <h2 className="font-moul text-2xl md:text-3xl text-blue-950 leading-snug mb-3">
            លោកគ្រូ-អ្នកគ្រូ ប្រកបដោយគរុកោសល្យខ្ពស់
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-kantumruy leading-relaxed">
            ក្រុមគ្រូបង្រៀនដែលមានការប្តេជ្ញាចិត្តខ្ពស់ សេចក្តីស្រឡាញ់ចំពោះកុមារ និងបទពិសោធន៍បង្រៀនជាច្រើនឆ្នាំ។
          </p>
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEACHERS_LIST.map((teacher) => (
            <div
              key={teacher.id}
              className="bg-white rounded-xl p-6 border border-slate-200 border-t-4 border-t-blue-900 hover:border-t-yellow-400 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-blue-900 p-0.5 bg-slate-100 flex-shrink-0 group-hover:border-yellow-400 transition-colors">
                    <img
                      src={teacher.photoUrl}
                      alt={teacher.nameKh}
                      className="w-full h-full object-cover rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 font-battambang group-hover:text-blue-900 transition-colors">
                      {teacher.nameKh}
                    </h3>
                    <span className="inline-block text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-sm border border-blue-100 mt-0.5">
                      {teacher.roleKh}
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-kantumruy">
                      {teacher.gradeOrSubjectKh}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border-l-2 border-l-yellow-400 border-y border-r border-slate-100 text-xs text-slate-600 italic font-kantumruy font-normal leading-relaxed mb-4">
                  {teacher.quoteKh}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 font-medium">
                  <Award className="w-3.5 h-3.5 text-yellow-600" />
                  បទពិសោធន៍ {teacher.experienceYears} ឆ្នាំ
                </span>
                {teacher.honorTitleKh && (
                  <span className="text-[10px] bg-yellow-100 text-blue-950 px-2 py-0.5 rounded-sm font-bold border border-yellow-300">
                    {teacher.honorTitleKh}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
