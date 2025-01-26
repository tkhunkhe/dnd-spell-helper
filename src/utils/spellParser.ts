import fs from 'fs';
import path from 'path';

interface SpellData {
  name: string;
  content: string;
  link?: string;
}

export function parseSpellFile(content: string): SpellData {
  const lines = content.split('\n');
  const name = lines[0].trim();
  
  // Check if the last non-empty line is a URL
  const lastLine = lines[lines.length - 1].trim();
  let link: string | undefined;
  let contentLines = lines.slice(1);
  
  if (lastLine.startsWith('http')) {
    link = lastLine;
    contentLines = lines.slice(1, -1); // Exclude first and last lines
  }
  
  return {
    name,
    content: contentLines.join('\n').trim(),
    link
  };
}

export function getSpells(): SpellData[] {
  const spellsDir = path.join(process.cwd(), 'public', 'spells');
  const spellFiles = fs.readdirSync(spellsDir);
  
  return spellFiles
    .filter(file => file.endsWith('.txt'))
    .map(file => {
      const filePath = path.join(spellsDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      return parseSpellFile(content);
    });
} 