import { Button } from './ui/button';

interface ContinentFilterProps {
  selected: string;
  onChange: (continent: string) => void;
}

const continents = [
  { value: 'All', label: 'All' },
  { value: 'Africa', label: 'Africa' },
  { value: 'Americas', label: 'Americas' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Oceania', label: 'Oceania' },
  { value: 'Antarctic', label: 'Antarctic' },
];

export function ContinentFilter({ selected, onChange }: ContinentFilterProps) {
  return (
    <nav aria-label="Filter by continent">
      <div className="flex flex-wrap gap-2">
        {continents.map(continent => (
          <Button
            key={continent.value}
            variant={selected === continent.value ? 'default' : 'outline'}
            onClick={() => onChange(continent.value)}
            className="transition-all"
            aria-pressed={selected === continent.value}
            aria-label={`Filter by ${continent.label}`}
          >
            {continent.label}
          </Button>
        ))}
      </div>
    </nav>
  );
}
