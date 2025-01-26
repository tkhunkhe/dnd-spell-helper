import { getSpells } from '../utils/spellParser';
import SpellList from '../components/SpellList';

// This is already static by default in App Router
export const dynamic = 'force-static';

export default async function Home() {
  const spells = getSpells();

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">D&D Spell Helper</h1>
        <SpellList spells={spells} />
      </div>
    </main>
  );
} 