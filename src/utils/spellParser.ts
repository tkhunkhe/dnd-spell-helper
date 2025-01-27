import fs from 'fs';
import path from 'path';

interface SpellData {
  name: string;
  content: string;
  section: string;
  link: string;
}

export function parseSpellFile(content: string, section: string, filename: string): SpellData {
  const lines = content.split('\n');
  const name = lines[0].trim();
  const contentLines = lines.slice(1);
  
  // Generate link from filename
  const spellPath = filename.replace('.txt', '').toLowerCase();
  const link = `https://dnd5e.wikidot.com/spell:${spellPath}`;
  
  return {
    name,
    content: contentLines.join('\n').trim(),
    section,
    link
  };
}

export function getSpells(): SpellData[] {
  const spellsDir = path.join(process.cwd(), 'public', 'spells');
  const entries = fs.readdirSync(spellsDir, { withFileTypes: true });
  
  const spells: SpellData[] = [];
  
  // Handle both direct files and directories
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Handle spells in subdirectories
      const sectionPath = path.join(spellsDir, entry.name);
      const sectionFiles = fs.readdirSync(sectionPath);
      
      for (const file of sectionFiles) {
        if (file.endsWith('.txt')) {
          const filePath = path.join(sectionPath, file);
          const content = fs.readFileSync(filePath, 'utf8');
          spells.push(parseSpellFile(content, entry.name, file));
        }
      }
    } else if (entry.isFile() && entry.name.endsWith('.txt')) {
      // Handle spells directly in spells directory
      const filePath = path.join(spellsDir, entry.name);
      const content = fs.readFileSync(filePath, 'utf8');
      spells.push(parseSpellFile(content, 'General', entry.name));
    }
  }
  
  return spells;
} 