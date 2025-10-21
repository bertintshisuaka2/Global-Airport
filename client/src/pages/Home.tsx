import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APP_TITLE } from "@/const";
import AirportMap from "@/components/AirportMap";
import WeatherDisplay from "@/components/WeatherDisplay";
import { Loader2, Search, MapPin, Plane } from "lucide-react";

export default function Home() {
  const [selectedContinent, setSelectedContinent] = useState<string>("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedAirportId, setSelectedAirportId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch continents
  const { data: continents, isLoading: continentsLoading } = trpc.airports.getContinents.useQuery();

  // Fetch countries for selected continent
  const { data: countries, isLoading: countriesLoading } = trpc.airports.getCountries.useQuery(
    { continent: selectedContinent },
    { enabled: !!selectedContinent }
  );

  // Fetch airports for selected country
  const { data: airports, isLoading: airportsLoading } = trpc.airports.getAirports.useQuery(
    { continent: selectedContinent, country: selectedCountry },
    { enabled: !!selectedContinent && !!selectedCountry }
  );

  // Fetch selected airport details
  const { data: selectedAirport } = trpc.airports.getAirportDetails.useQuery(
    { id: selectedAirportId },
    { enabled: !!selectedAirportId }
  );

  // Fetch weather for selected airport
  const { data: weather, isLoading: weatherLoading } = trpc.weather.getForecast.useQuery(
    {
      latitude: selectedAirport?.latitude || 0,
      longitude: selectedAirport?.longitude || 0,
    },
    { enabled: !!selectedAirport }
  );

  // Search airports
  const { data: searchResults } = trpc.airports.search.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: searchQuery.length >= 2 }
  );

  // Calculate map center and zoom
  const mapProps = useMemo(() => {
    if (selectedAirport) {
      return {
        center: [selectedAirport.latitude, selectedAirport.longitude] as [number, number],
        zoom: 10,
      };
    }
    if (airports && airports.length > 0) {
      const avgLat = airports.reduce((sum, a) => sum + a.latitude, 0) / airports.length;
      const avgLon = airports.reduce((sum, a) => sum + a.longitude, 0) / airports.length;
      return { center: [avgLat, avgLon] as [number, number], zoom: 5 };
    }
    return { center: [20, 0] as [number, number], zoom: 2 };
  }, [selectedAirport, airports]);

  const handleContinentChange = (value: string) => {
    setSelectedContinent(value);
    setSelectedCountry("");
    setSelectedAirportId("");
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedAirportId("");
  };

  const handleAirportSelect = (airportId: string) => {
    setSelectedAirportId(airportId);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Plane className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">{APP_TITLE}</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Explore international airports worldwide with real-time weather and location data
          </p>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Navigation */}
          <div className="space-y-4">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Search Airports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by name, city, or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchResults && searchResults.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                    {searchResults.map((airport) => (
                      <Button
                        key={airport.id}
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => {
                          handleAirportSelect(airport.id);
                          setSearchQuery("");
                        }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{airport.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {airport.municipality} • {airport.iata_code || airport.icao_code}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Browse by Location */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Browse by Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Continent Selector */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Continent</label>
                  <Select value={selectedContinent} onValueChange={handleContinentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select continent" />
                    </SelectTrigger>
                    <SelectContent>
                      {continentsLoading ? (
                        <div className="p-2 text-center">
                          <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                        </div>
                      ) : (
                        continents?.map((continent) => (
                          <SelectItem key={continent} value={continent}>
                            {continent}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Country Selector */}
                {selectedContinent && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Country</label>
                    <Select value={selectedCountry} onValueChange={handleCountryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countriesLoading ? (
                          <div className="p-2 text-center">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          </div>
                        ) : (
                          countries?.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Airport List */}
                {selectedCountry && airports && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Airports ({airports.length})
                    </label>
                    <div className="space-y-1 max-h-96 overflow-y-auto border rounded-md p-2">
                      {airportsLoading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </div>
                      ) : (
                        airports.map((airport) => (
                          <Button
                            key={airport.id}
                            variant={selectedAirportId === airport.id ? "secondary" : "ghost"}
                            className="w-full justify-start text-left h-auto py-2"
                            onClick={() => handleAirportSelect(airport.id)}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{airport.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {airport.municipality} • {airport.iata_code || airport.icao_code}
                              </div>
                            </div>
                          </Button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Map and Weather */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map */}
            <Card>
              <CardHeader>
                <CardTitle>Airport Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <AirportMap
                    airports={airports || []}
                    center={mapProps.center}
                    zoom={mapProps.zoom}
                    onAirportClick={(airport) => handleAirportSelect(airport.id)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Airport Details */}
            {selectedAirport && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedAirport.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedAirport.municipality && `${selectedAirport.municipality} • `}
                    {selectedAirport.iata_code && `IATA: ${selectedAirport.iata_code} • `}
                    {selectedAirport.icao_code && `ICAO: ${selectedAirport.icao_code}`}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Latitude:</span> {selectedAirport.latitude.toFixed(4)}
                    </div>
                    <div>
                      <span className="font-medium">Longitude:</span> {selectedAirport.longitude.toFixed(4)}
                    </div>
                    {selectedAirport.elevation_ft && (
                      <div>
                        <span className="font-medium">Elevation:</span> {selectedAirport.elevation_ft} ft
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Type:</span> {selectedAirport.type.replace("_", " ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weather Forecast */}
            {selectedAirport && weather && (
              <div>
                {weatherLoading ? (
                  <Card>
                    <CardContent className="py-12">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading weather data...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <WeatherDisplay weather={weather} />
                )}
              </div>
            )}

            {/* Welcome Message */}
            {!selectedAirport && (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="text-xl font-semibold mb-2">Welcome to {APP_TITLE}</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Select a continent and country from the sidebar, or use the search to explore
                    international airports around the world. View detailed weather forecasts and exact
                    locations on the map.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

