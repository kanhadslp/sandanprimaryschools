import React from 'react';
import { GraduationCap, Users, Building2, Award } from 'lucide-react';
import { SCHOOL_STATS } from '../data/schoolData';

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Users,
  Building2,
  Award,
};

export const QuickStats: React.FC = () => {
  return (
    <section className="relative -mt-4 z-20 max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCHOOL_STATS.map((stat, idx) => {
          const Icon = iconMap[stat.iconName] || Award;
          return (
            <div
              key={stat.id}
              id={`stat-card-${stat.id}`}
              className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md border border-slate-200 border-l-4 border-l-blue-900 hover:border-l-yellow-400 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-900 border border-blue-100 group-hover:bg-blue-900 group-hover:text-yellow-400 transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                {stat.trendKh && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-yellow-100 text-blue-950 border border-yellow-300">
                    {stat.trendKh}
                  </span>
                )}
              </div>

              <div>
                <span className="block font-koulen text-3xl text-slate-900 group-hover:text-blue-900 transition-colors">
                  {stat.value}
                </span>
                <h3 className="text-sm font-bold text-slate-800 font-battambang mt-0.5">
                  {stat.labelKh}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-kantumruy font-normal leading-relaxed">
                  {stat.descriptionKh}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
