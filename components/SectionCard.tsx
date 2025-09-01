import React from 'react';

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children, icon }) => {
  return (
    <div className="bg-gray-800 shadow-2xl rounded-xl p-6 md:p-8">
      <div className="flex items-center mb-6">
        {icon && <span className="text-sky-400 mr-3 text-2xl md:text-3xl">{icon}</span>}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
};

export default SectionCard;
