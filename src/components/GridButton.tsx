import React from 'react';

interface GridButtonProps {
  icon: React.ReactNode;
  label: string;
}

const GridButton: React.FC<GridButtonProps> = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center border rounded-lg p-4 shadow hover:shadow-md transition">
    <div className="text-4xl mb-2">{icon}</div>
    <span className="text-sm font-medium text-center">{label}</span>
  </button>
);

export default GridButton;
