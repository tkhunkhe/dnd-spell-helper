'use client';

import { Spell } from '../types/spell';
import { useState, useMemo } from 'react';

interface SpellListProps {
  spells: Spell[];
}

export default function SpellList({ spells }: SpellListProps) {
  const [hoveredSpell, setHoveredSpell] = useState<Spell | null>(null);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Group spells by section
  const spellsBySection = useMemo(() => {
    const grouped = spells.reduce((acc, spell) => {
      const section = spell.section;
      if (!acc[section]) {
        acc[section] = [];
      }
      acc[section].push(spell);
      return acc;
    }, {} as Record<string, Spell[]>);

    // Sort sections and spells within sections
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([section, sectionSpells]) => ({
        section,
        spells: sectionSpells.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [spells]);

  const handleSpellClick = (spell: Spell) => {
    setSelectedSpell(spell === selectedSpell ? null : spell);
  };

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const expandAll = () => {
    const expanded = Object.fromEntries(spellsBySection.map(({ section }) => [section, false]));
    setCollapsedSections(expanded);
  };

  const collapseAll = () => {
    const collapsed = Object.fromEntries(spellsBySection.map(({ section }) => [section, true]));
    setCollapsedSections(collapsed);
  };

  // Display hovered spell if there is one, otherwise show selected spell
  const displaySpell = hoveredSpell || selectedSpell;

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      {/* Left panel - Spell names list */}
      <div className="w-1/4  overflow-y-auto">
        <div className="mb-2">
          <button 
            onClick={() => {
              const allCollapsed = Object.values(collapsedSections).every(value => value);
              if (allCollapsed) {
                expandAll();
              } else {
                collapseAll();
              }
            }} 
            className="text-sm text-blue-600 hover:underline"
          >
            {Object.values(collapsedSections).every(value => value) ? 'Expand All' : 'Collapse All'}
          </button>
        </div>
        <div className="space-y-2">
          {spellsBySection.map(({ section, spells }) => (
            <div key={section} className="bg-white rounded-lg p-2 shadow-md">
              <h3
                className="text-md font-semibold text-gray-700 p-1 cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection(section)}
              >
                <span>{section}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${collapsedSections[section] ? '' : 'rotate-180'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </h3>
              {!collapsedSections[section] && (
                <div className="divide-y divide-gray-300">
                  {spells.map((spell) => (
                    <div
                      key={spell.name}
                      className={`p-1 cursor-pointer transition
                        ${selectedSpell?.name === spell.name ? 'font-bold text-blue-600' : 'text-gray-800'}
                        ${hoveredSpell?.name === spell.name ? 'bg-blue-50' : ''}`}
                      onMouseEnter={() => setHoveredSpell(spell)}
                      onMouseLeave={() => setHoveredSpell(null)}
                      onClick={() => handleSpellClick(spell)}
                    >
                      <h2 className="text-sm">{spell.name}</h2>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Spell details */}
      <div className="w-3/4 overflow-y-auto">
        <div className="min-h-full">
          {displaySpell ? (
            <div className="p-4 bg-white rounded-lg shadow-md">
              <h2 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b sticky top-0 bg-white z-10">
                {displaySpell.name}
              </h2>
              <pre className="text-gray-600 whitespace-pre-wrap font-sans mb-4 text-sm">
                {displaySpell.content}
              </pre>
              <a 
                href={displaySpell.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm block sticky bottom-0 bg-white py-4"
              >
                {displaySpell.link}
              </a>
            </div>
          ) : (
            <div className="p-4 text-sm bg-white rounded-lg shadow-md text-gray-500 italic">
              Hover over a spell to see its details
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 