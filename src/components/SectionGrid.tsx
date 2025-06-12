import React from 'react';
import GridButton from './GridButton';

interface SectionGridProps {
  title: string;
  items: { icon: React.ReactNode; label: string }[];
}

const SectionGrid: React.FC<SectionGridProps> = ({ title, items }) => (
  <section className="mb-8">
    <div className="bg-cyan-900 text-white px-4 py-2 text-lg font-semibold rounded">
      {title}
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
      {items.map((item, idx) => (
        <GridButton key={idx} icon={item.icon} label={item.label} />
      ))}
    </div>
  </section>
);

export default SectionGrid;
