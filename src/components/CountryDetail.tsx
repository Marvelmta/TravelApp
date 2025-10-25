// Flag override for specific countries
const customFlags: Record<string, string> = {
  Afghanistan: 'https://upload.wikimedia.org/wikipedia/commons/c/cd/Flag_of_Afghanistan_%282013%E2%80%932021%29.svg', 
};

import { useState, useEffect } from 'react';
import type { Country } from './CountryList';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Users, 
  Globe, 
  Languages, 
  DollarSign,
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  Clock
} from 'lucide-react';

interface CountryDetailProps {
  countryName: string;
  onBack: () => void;
}

interface WeatherData {
  temp: number;
  feels_like: number;
  humidity: number;
  description: string;
  icon: string;
  wind_speed: number;
  locationName?: string;
}


export function CountryDetail({ countryName, onBack }: CountryDetailProps) {
  const [country, setCountry] = useState<Country | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [userWeather, setUserWeather] = useState<WeatherData | null>(null);
  const [wikiIntro, setWikiIntro] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountryDetails();
  }, [countryName]);

  const fetchCountryDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      let countryResponse;
      let countryData;
      
      try {
        countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`,
        );
        
        if (countryResponse.ok) {
          countryData = await countryResponse.json();
        }
      } catch (e) {
        console.log('fullText search failed, trying partial match');
      }
      
      if (!countryData || countryData.length === 0) {
        countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}`,
        );
        
        if (!countryResponse.ok) {
          throw new Error('Could not fetch country data');
        }
        
        countryData = await countryResponse.json();
        
        const exactMatch = countryData.find(
          (c: Country) => c.name.common.toLowerCase() === countryName.toLowerCase()
        );
        
        if (exactMatch) {
          countryData = [exactMatch];
        }
      }

      if (!countryData || countryData.length === 0) {
        throw new Error('Country not found');
      }

      const countryInfo = countryData[0];
      setCountry(countryInfo);

      if (countryInfo.capital && countryInfo.capital[0]) {
        await fetchWeatherData(countryInfo.capital[0]);
      }

      await fetchWikipediaIntro(countryInfo.name.common);
    } catch (err) {
      console.error('Country fetch error:', err);
      setError(
        err instanceof Error ? err.message : 'An error occurred',
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherData = async (capital: string) => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&appid=${apiKey}&units=metric&lang=en`
      );

      if (response.ok) {
        const data = await response.json();
        const weatherData: WeatherData = {
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          wind_speed: Math.round(data.wind.speed * 10) / 10,
          locationName: data.name,
        };
        setWeather(weatherData);
      } else {
        setWeather(null);
      }
    } catch (error) {
      setWeather(null);
    }
  };

  // Fetch weather for user's current location
  const fetchUserWeather = async (lat: number, lon: number) => {
    try {
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=en`
      );
      if (response.ok) {
        const data = await response.json();
        const weatherData: WeatherData = {
          temp: Math.round(data.main.temp),
          feels_like: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          wind_speed: Math.round(data.wind.speed * 10) / 10,
          locationName: data.name,
        };
        setUserWeather(weatherData);
      } else {
        setUserWeather(null);
      }
    } catch (error) {
      setUserWeather(null);
    }
  };

  const fetchWikipediaIntro = async (countryName: string) => {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(countryName)}`,
      );
      if (response.ok) {
        const data = await response.json();
        setWikiIntro(
          data.extract || 'No information available from Wikipedia.'
        );
      } else {
        setWikiIntro('Could not fetch information from Wikipedia.');
      }
    } catch (err) {
      setWikiIntro('Could not fetch information from Wikipedia.');
    }
  };

  if (loading) {
    return (
      <LoadingSpinner message="Loading country information..." />
    );
  }

  if (error || !country) {
    return (
      <ErrorMessage
        message={error || 'Country not found'}
        onRetry={fetchCountryDetails}
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to list
        </Button>
      </ErrorMessage>
    );
  }

  const capital = country.capital?.[0] || 'No capital';
  const population = country.population.toLocaleString('en-US');
  const languages = country.languages
    ? Object.values(country.languages).join(', ')
    : 'No information';
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(', ')
    : 'No information';
  const subregion = country.subregion || 'No information';
  const timezones = country.timezones && country.timezones.length > 0
    ? country.timezones.join(', ')
    : 'No information';

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Back Button */}
      <Button
        onClick={onBack}
        variant="ghost"
        className="mb-6"
        aria-label="Back to country list"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to list
      </Button>

      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-full md:w-48 shrink-0">
            <img
              src={customFlags[country.name.common] || country.flags.svg}
              alt={
                country.flags.alt ||
                `Flag of ${country.name.common}`
              }
              className="w-full border border-slate-200 rounded-lg shadow-md"
            />
          </div>
          <div className="flex-1">
            <h1 className="text-slate-900 mb-2">
              {country.name.common}
            </h1>
            <p className="text-slate-600 mb-4">
              {country.name.official}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {country.region}
              </Badge>
              <Badge variant="outline">{subregion}</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Basic Facts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <p className="text-slate-600">Capital</p>
                  <p className="text-slate-900">{capital}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <p className="text-slate-600">Population</p>
                  <p className="text-slate-900">{population}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Languages className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <p className="text-slate-600">Languages</p>
                  <p className="text-slate-900">{languages}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                    <p className="text-slate-600">Currency</p>
                  <p className="text-slate-900">{currencies}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Globe className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-slate-600">Region</p>
                  <p className="text-slate-900">
                    {country.region}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-slate-600">Subregion</p>
                  <p className="text-slate-900">{subregion}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-slate-600">Timezone(s)</p>
                  <p className="text-slate-900">{timezones}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Card */}
        {weather && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="w-5 h-5" />
                  Weather in {capital}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-slate-900 mb-1">
                  {weather.temp}°C
                </div>
                <p className="text-slate-600">
                  {weather.description}
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Thermometer className="w-4 h-4" />
                    <span>Feels like</span>
                  </div>
                  <span className="text-slate-900">
                    {weather.feels_like}°C
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Droplets className="w-4 h-4" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-slate-900">
                    {weather.humidity}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Wind className="w-4 h-4" />
                    <span>Wind</span>
                  </div>
                  <span className="text-slate-900">
                    {weather.wind_speed} m/s
                  </span>
                </div>
              </div>

              <p className="text-slate-500 text-center mt-4">
                * Weather data from OpenWeather API
              </p>

              {/* Use my location button and user weather */}
              <div className="mt-6">
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (pos) => fetchUserWeather(pos.coords.latitude, pos.coords.longitude),
                        () => alert('Could not get your location.')
                      );
                    } else {
                      alert('Geolocation is not supported by your browser.');
                    }
                  }}
                >
                  Use my location
                </Button>
                {userWeather && (
                  <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-5 h-5" />
                      <span className="font-semibold">Weather at your location{userWeather.locationName ? ` (${userWeather.locationName})` : ''}:</span>
                    </div>
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <span className="text-slate-900 text-lg">{userWeather.temp}°C</span>
                        <span className="block text-slate-600">{userWeather.description}</span>
                      </div>
                      <div>
                        <span className="text-slate-900">Feels like: {userWeather.feels_like}°C</span>
                      </div>
                      <div>
                        <span className="text-slate-900">Humidity: {userWeather.humidity}%</span>
                      </div>
                      <div>
                        <span className="text-slate-900">Wind: {userWeather.wind_speed} m/s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Wikipedia Introduction */}
      {wikiIntro && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About {country.name.common}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-700 leading-relaxed mb-4">
              {wikiIntro}
            </p>
            <p className="text-slate-500">
              Source:{' '}
              <a
                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(country.name.common)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Wikipedia
              </a>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Images Section */}
      <CountryImages countryName={country.name.common} />
    </div>
  );
}

export function CountryImages({ countryName }: { countryName: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const accessKey = import.meta.env.VITE_UNSPLASH_API_KEY;

  useEffect(() => { loadImages(); }, [countryName]);

  const loadImages = async () => {
    setLoading(true);
    setError(null);
    try {
      if (accessKey) {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(countryName)}&orientation=landscape&per_page=8&client_id=${accessKey}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setImages(data.results.map((img: any) => img.urls.regular));
            setLoading(false);
            return;
          }
        }
      }
      setImages([]);
      setError('Images failed to load');
    } catch (err) {
      setImages([]);
      setError('Images failed to load');
    } finally {
      setLoading(false);
    }
  };


  const openModal = (image: string) => {
    const idx = images.indexOf(image);
    setModalIndex(idx >= 0 ? idx : 0);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalIndex(null);
  };

  const showPrev = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.stopPropagation();
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? images.length - 1 : prev - 1;
    });
  };

  const showNext = (e?: React.MouseEvent | KeyboardEvent) => {
    if (e) e.stopPropagation();
    setModalIndex((prev) => {
      if (prev === null) return null;
      return prev === images.length - 1 ? 0 : prev + 1;
    });
  };

  useEffect(() => {
    if (!modalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') showPrev(e);
      if (e.key === 'ArrowRight') showNext(e);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen, images.length]);


  if (loading) {
    return <LoadingSpinner message="Loading images..." />;
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Images from {countryName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Images from {countryName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="aspect-4/3 overflow-hidden rounded-lg bg-slate-200 cursor-pointer"
              onClick={() => openModal(image)}
              tabIndex={0}
              role="button"
              aria-label={`View image ${index + 1} in full size`}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') openModal(image);
              }}
            >
              <img
                src={image}
                alt={`Bild ${index + 1} från ${countryName}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        {modalOpen && modalIndex !== null && images[modalIndex] && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
          >
            {/* Left arrow button */}
            <button
              onClick={showPrev}
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/80 text-slate-700 shadow-lg rounded-full border border-slate-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Previous image"
              tabIndex={0}
            >
              <span className="text-2xl md:text-3xl">&#8592;</span>
            </button>
            {/* Image */}
            <img
              src={images[modalIndex]}
              alt="Fullsize image"
              className="max-w-full max-h-[90vh] rounded-lg shadow-lg cursor-pointer"
              onClick={closeModal}
            />
            {/* Right arrow button */}
            <button
              onClick={showNext}
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/80 text-slate-700 shadow-lg rounded-full border border-slate-200 hover:bg-blue-100 hover:text-blue-600 active:bg-blue-200 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Next image"
              tabIndex={0}
            >
              <span className="text-2xl md:text-3xl">&#8594;</span>
            </button>
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 bg-white/80 text-slate-700 shadow-lg rounded-full border border-slate-200 hover:bg-red-100 hover:text-red-600 active:bg-red-200 transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-red-400"
              aria-label="Close image"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

