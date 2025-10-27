import { Card, CardContent } from './ui/card';
import type { Country } from './CountryList';
import { Users, Building2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface CountryCardProps {
  country: Country;
  onClick: () => void;
}

export function CountryCard({ country, onClick }: CountryCardProps) {
  const capital = country.capital?.[0] || 'No capital';
  const population = country.population.toLocaleString('en-US');

  return (
    <Card 
      className="cursor-pointer overflow-hidden group border-slate-200 hover:border-blue-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Show details for ${country.name.common}`}
    >
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-slate-100 to-slate-200">
        <img
          src={country.flags.svg}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        <div className="absolute top-3 right-3">
          <Badge 
            variant="secondary" 
            className="bg-white/90 backdrop-blur-sm text-slate-900 border-white/50 shadow-lg"
          >
            {country.region}
          </Badge>
        </div>
      </div>

      <CardContent className="p-5">
        <h2 className="text-slate-900 mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {country.name.common}
        </h2>
        
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-slate-600 group/item">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 group-hover/item:bg-blue-100 transition-colors shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-500">Capital</p>
              <p className="text-slate-900 line-clamp-1">{capital}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-600 group/item">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50 text-green-600 group-hover/item:bg-green-100 transition-colors shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-500">Population</p>
              <div className="flex items-baseline gap-2">
                <p className="text-slate-900 truncate">{population}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

