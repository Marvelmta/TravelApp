import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "./SearchBar";
import { ContinentFilter } from "./ContinentFilter";
import { CountryCard } from "./CountryCard";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorMessage } from "./ErrorMessage";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface Country {
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  capitalInfo?: {
    latlng?: [number, number];
  };
  region: string;
  subregion?: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca3: string;
  languages?: { [key: string]: string };
  currencies?: {
    [key: string]: { name: string; symbol: string };
  };
  latlng?: [number, number];
  timezones?: string[];
}

const ITEMS_PER_PAGE = 12;

export function CountryList() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("region") || "All";
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCountries();

    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("query") || "";
    const regionParam =
      params.get("region") || localStorage.getItem("selectedRegion") || "All";
    const pageParam = parseInt(params.get("page") || "1", 10);

    setSearchQuery(queryParam);
    setSelectedRegion(regionParam);
    setCurrentPage(pageParam);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const regionParam = params.get("region") || "All";
      setSelectedRegion(regionParam);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let filtered = [...countries];

    if (selectedRegion !== "All") {
      filtered = filtered.filter((country) => {
        const region = country.region.toLowerCase();
        const selectedLower = selectedRegion.toLowerCase();

        if (selectedLower === "americas") {
          return region === "americas";
        } else if (selectedLower === "antarctic") {
          return region === "antarctic";
        }
        return region === selectedLower;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (country) =>
          country.name.common.toLowerCase().includes(query) ||
          country.name.official.toLowerCase().includes(query)
      );
    }

    setFilteredCountries(filtered);
  }, [countries, searchQuery, selectedRegion]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedRegion !== "All") params.set("region", selectedRegion);
    if (currentPage > 1) params.set("page", currentPage.toString());

    const newUrl = params.toString() ? `?${params.toString()}` : "/";
    window.history.replaceState({}, "", newUrl);
  }, [searchQuery, selectedRegion, currentPage]);

  const fetchCountries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        "https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,cca3,languages,currencies,capitalInfo"
      );

      if (!response.ok) {
        throw new Error("Kunde inte hämta länderdata");
      }

      const data = await response.json();
      const sorted = data.sort((a: Country, b: Country) =>
        a.name.common.localeCompare(b.name.common)
      );
      setCountries(sorted);
      setFilteredCountries(sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ett fel uppstod");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  const handleRetry = () => {
    fetchCountries();
  };

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCountries = filteredCountries.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Laddar länder..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search for country..."
        />

        <ContinentFilter
          selected={selectedRegion}
          onChange={handleRegionChange}
        />
      </div>

      {/* Results Info */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {currentCountries.length} of {filteredCountries.length}{" "}
          countries
          {searchQuery && ` for "${searchQuery}"`}
          {selectedRegion !== "All" && ` in ${selectedRegion}`}
        </p>
      </div>

      {/* Countries Grid */}
      {currentCountries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-600">
            No countries found. Try a different search or filter.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentCountries.map((country) => {
              const lat =
                country.capitalInfo?.latlng?.[0] || country.latlng?.[0];
              const lng =
                country.capitalInfo?.latlng?.[1] || country.latlng?.[1];
              const coords =
                lat !== undefined && lng !== undefined
                  ? `?lat=${lat}&lng=${lng}`
                  : "";
              return (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  onClick={() =>
                    navigate(
                      `/country/${encodeURIComponent(
                        country.name.common
                      )}${coords}`
                    )
                  }
                />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={goToPrevPage}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <span className="text-slate-700">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
