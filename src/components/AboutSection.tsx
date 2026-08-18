import React from 'react';
import { 
  BookOpen, 
  HeartHandshake, 
  Activity, 
  Trees, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Quote,
  ShieldCheck,
  Target
} from 'lucide-react';
import { SCHOOL_INFO, SCHOOL_PILLARS, schoolLogo } from '../data/schoolData';
import bannerAerial from '../assets/images/school_banner_aerial_1786954763197.jpg';

const pillarIconMap: Record<string, React.ElementType> = {
  BookOpen,
  HeartHandshake,
  Activity,
  Trees,
  Sparkles,
};

interface AboutSectionProps {
  onOpenAdmission: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenAdmission }) => {
  return (
    <section id="about" className="py-16 md:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4 text-blue-900" />
            <span>អំពីសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់</span>
          </div>
          <h2 className="font-moul text-2xl md:text-3xl text-blue-950 leading-snug mb-3">
            គ្រឹះនៃការអប់រំ សីលធម៌ និងអនាគតភ្លឺស្វាង
          </h2>
          <p className="text-sm md:text-base text-slate-600 font-kantumruy leading-relaxed">
            សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់ ប្តេជ្ញាចិត្តផ្តល់នូវការអប់រំបឋមប្រកបដោយគុណភាពខ្ពស់ 
            បណ្តុះចំណេះដឹងទូទៅ សីលធម៌ថ្លៃថ្នូរ វិន័យខ្ជាប់ខ្ជួន និងកាយសម្បទារឹងមាំដល់កុមារកម្ពុជា។
          </p>
        </div>

        {/* History, Vision & Principal's Message Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          
          {/* Left Column: School Campus Image & Quick Badges */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-slate-200 aspect-[4/3]">
              <img
                src={bannerAerial}
                alt="សាលាបឋមសិក្សាសៀងណាំសណ្ដាន់"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] bg-yellow-400 text-blue-950 px-2.5 py-0.5 rounded-md font-bold border border-yellow-500">
                  បរិវេណសាលាគំរូ
                </span>
                <h4 className="font-moul text-sm sm:text-base mt-1 text-white">
                  {SCHOOL_INFO.nameKh}
                </h4>
                <p className="text-xs text-slate-200 mt-0.5">
                  {SCHOOL_INFO.locationKh}
                </p>
              </div>
            </div>

            {/* Founded & Trust Badge */}
            <div className="mt-4 p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-blue-900 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-xs text-slate-500 font-medium">បង្កើតឡើងនៅឆ្នាំ</span>
                <p className="font-koulen text-xl text-blue-900">{SCHOOL_INFO.foundedYear}</p>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="text-xs text-slate-500 font-medium">កម្មវិធីសិក្សា</span>
                <p className="font-bold text-sm text-slate-800 font-battambang">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
              </div>
            </div>
          </div>

          {/* Right Column: Principal's Message & Core Values */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Principal Welcome Box */}
            <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 rounded-xl p-6 sm:p-8 text-white relative shadow-md border-t-4 border-yellow-400">
              <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-700/30 pointer-events-none" />
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 p-0.5 bg-white flex-shrink-0 shadow-xs">
                  <img
                    src={schoolLogo}
                    alt="School Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div>
                  <h3 className="font-moul text-base text-yellow-300">សារស្វាគមន៍របស់គណៈគ្រប់គ្រងសាលា</h3>
                  <span className="text-xs text-slate-300">លោកនាយកសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់</span>
                </div>
              </div>

              <blockquote className="text-sm sm:text-base text-slate-100 font-kantumruy font-normal leading-relaxed mb-6 italic">
                «បេសកកម្មចម្បងរបស់យើង គឺបង្កើតបរិយាកាសសិក្សាដ៏កក់ក្តៅ សុវត្ថិភាព និងសម្បូរបែប 
                ដើម្បីជួយកុមារគ្រប់រូបឱ្យអភិវឌ្ឍសមត្ថភាពភាសា គណិតវិទ្យា វិទ្យាសាស្ត្រ និងសីលធម៌ខ្ពស់ 
                ក្លាយជាកូនល្អ សិស្សល្អ និងពលរដ្ឋគំរូសម្រាប់សង្គមជាតិ។»
              </blockquote>

              <div className="pt-4 border-t border-blue-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-yellow-400 font-battambang">{SCHOOL_INFO.principalNameKh}</span>
                  <span className="text-xs text-slate-400">&bull; {SCHOOL_INFO.principalTitleKh}</span>
                </div>
                <button
                  onClick={onOpenAdmission}
                  className="px-3.5 py-1.5 rounded-md bg-yellow-400 hover:bg-yellow-300 text-blue-950 font-bold text-xs shadow-xs transition-colors cursor-pointer border border-yellow-500"
                >
                  ស្នើសុំចុះឈ្មោះចូលរៀន
                </button>
              </div>
            </div>

            {/* Vision & Mission Key Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-blue-900 shadow-xs">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-2 font-battambang">
                  <Target className="w-4 h-4 text-blue-900" />
                  <span>ទស្សនវិស័យ (Vision)</span>
                </div>
                <p className="text-xs text-slate-600 font-kantumruy leading-relaxed">
                  ក្លាយជាសាលាបឋមសិក្សាគំរូឈានមុខគេ ដែលផ្តល់ការអប់រំប្រកបដោយសមធម៌ បរិស្ថានសិក្សាស្អាតបៃតង និងគ្រឹះចំណេះដឹងរឹងមាំ។
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 border-l-4 border-l-yellow-400 shadow-xs">
                <div className="flex items-center gap-2 text-blue-950 font-bold text-sm mb-2 font-battambang">
                  <CheckCircle2 className="w-4 h-4 text-yellow-600" />
                  <span>បេសកកម្ម (Mission)</span>
                </div>
                <p className="text-xs text-slate-600 font-kantumruy leading-relaxed">
                  បង្រៀនឱ្យចេះអាន សរសេរ និងគិតលេខបានស្ទាត់ជំនាញ បណ្តុះទម្លាប់អាន ហាត់ប្រាណប្រចាំថ្ងៃ និងចេះរស់នៅប្រកបដោយសីលធម៌។
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 5 Core Pillars of Education */}
        <div className="mt-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
              គោលការណ៍គ្រឹះ
            </span>
            <h3 className="font-moul text-xl md:text-2xl text-blue-950 mt-2">
              សសរស្តម្ភទាំង ៥ នៃការអប់រំ
            </h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1 font-kantumruy">
              គោលការណ៍ស្នូលដែលសាលាបឋមសិក្សាសៀងណាំសណ្ដាន់អនុវត្តជារៀងរាល់ថ្ងៃ
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {SCHOOL_PILLARS.map((pillar) => {
              const Icon = pillarIconMap[pillar.iconName] || BookOpen;
              return (
                <div
                  key={pillar.id}
                  className="bg-white hover:bg-blue-50/40 rounded-xl p-5 border border-slate-200 border-t-4 border-t-blue-900 hover:border-t-yellow-400 hover:shadow-md transition-all duration-300 flex flex-col group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-koulen text-lg text-slate-400 group-hover:text-blue-900 transition-colors">
                      {pillar.number}
                    </span>
                    <div className="p-2.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 group-hover:bg-blue-900 group-hover:text-yellow-400 transition-all shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 font-battambang mb-2 group-hover:text-blue-900 transition-colors">
                    {pillar.titleKh}
                  </h4>

                  <p className="text-xs text-slate-600 font-kantumruy leading-relaxed flex-grow">
                    {pillar.descKh}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
