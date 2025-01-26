'use client';

import { Spell } from '../types/spell';
import { useState } from 'react';

interface SpellListProps {
  spells: Spell[];
}

export default function SpellList({ spells }: SpellListProps) {
  const [hoveredSpell, setHoveredSpell] = useState<Spell | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);

  const handleSpellClick = (spell: Spell) => {
    setSelectedSpell(spell === selectedSpell ? null : spell);
  };

  // Display hovered spell if there is one, otherwise show selected spell
  const displaySpell = hoveredSpell || selectedSpell;

  return (
    <div className="flex gap-6">
      {/* Left panel - Spell names list */}
      <div className="w-1/4">
        <div className="grid gap-2">
          {spells.map((spell) => (
            <div
              key={spell.name}
              className={`p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer
                ${selectedSpell?.name === spell.name ? 'bg-blue-100 border-blue-300' : ''}
                ${hoveredSpell?.name === spell.name ? 'bg-blue-50 border-blue-200' : ''}`}
              onMouseEnter={() => setHoveredSpell(spell)}
              onMouseLeave={() => setHoveredSpell(null)}
              onClick={() => handleSpellClick(spell)}
            >
              <h2 className="text-lg font-medium text-gray-800">{spell.name}</h2>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Spell details */}
      <div className="w-3/4">
        <div className="sticky top-8">
          {displaySpell ? (
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b">
                {displaySpell.name}
              </h2>
              <pre className="text-gray-600 whitespace-pre-wrap font-sans mb-4">
                {displaySpell.content}
              </pre>
              {displaySpell.link && (
                <a 
                  href={displaySpell.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                >
                  {displaySpell.link}
                </a>
              )}
            </div>
          ) : (
            <div className="p-6 bg-white rounded-lg shadow-md text-gray-500 italic">
              Hover over a spell to see its details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 