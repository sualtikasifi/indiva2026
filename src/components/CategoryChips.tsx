import { CATEGORIES } from '../constants/categories';

export default function CategoryChips({
  selected, onSelect,
}: { selected: string; onSelect: (cat: string) => void }) {
  const all = ['Tümü', ...CATEGORIES];
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      {all.map(cat => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
            selected === cat ? 'bg-orange text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
