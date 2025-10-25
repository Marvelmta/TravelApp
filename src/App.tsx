
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { CountryList } from './components/CountryList';
import { CountryDetail } from './components/CountryDetail';
import { MapPinned } from 'lucide-react';


function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="relative bg-linear-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <MapPinned className="w-8 h-8 text-blue-400" />
            <h1 className="text-white text-2xl font-semibold">World Explorer</h1>
          </div>
          <p className="text-slate-300 text-center">Discover the countries of the World</p>
          <div className="w-32 h-px bg-linear-to-r from-transparent via-slate-500 to-transparent my-2" />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route path="/country/:countryName" element={<CountryDetailWrapper />} />
        </Routes>
      </main>
      <footer className="relative mt-16 bg-linear-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap justify-center gap-2 text-slate-400">
              <span>Data from</span>
              <span className="text-blue-400">REST Countries API</span>
              <span>•</span>
              <span className="text-blue-400">OpenWeather</span>
              <span>•</span>
              <span className="text-blue-400">Unsplash</span>
              <span>•</span>
              <span className="text-blue-400">Wikipedia</span>
            </div>
            
            <div className="w-32 h-px bg-linear-to-r from-transparent via-slate-600 to-transparent" />
            
            <p className="text-slate-500 text-center">
              © 2025 Marcel Cios • World Explorer
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function CountryDetailWrapper() {
  const navigate = useNavigate();
  const { countryName } = useParams();
  return (
    <CountryDetail 
      countryName={countryName || ''}
      onBack={() => navigate('/')} 
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
