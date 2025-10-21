import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface Airport {
  id: string;
  ident: string;
  type: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation_ft: number | null;
  continent: string;
  iso_country: string;
  iso_region: string;
  municipality: string | null;
  scheduled_service: string;
  iata_code: string | null;
  icao_code: string | null;
}

export interface Country {
  id: string;
  code: string;
  name: string;
  continent: string;
}

export interface Region {
  id: string;
  code: string;
  local_code: string;
  name: string;
  continent: string;
  iso_country: string;
}

interface AirportsByContinent {
  [continent: string]: {
    [country: string]: Airport[];
  };
}

let airportsCache: Airport[] | null = null;
let countriesCache: Country[] | null = null;
let regionsCache: Region[] | null = null;
let airportsByContinentCache: AirportsByContinent | null = null;

function loadCSV<T>(filename: string): T[] {
  const filePath = path.join(__dirname, "data", filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`CSV file not found: ${filePath}`);
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
    cast_date: false,
  });
}

export function getAirports(): Airport[] {
  if (!airportsCache) {
    const rawData = loadCSV<any>("airports.csv");
    // Filter for medium and large airports only (international airports)
    airportsCache = rawData
      .filter((row: any) => 
        (row.type === "large_airport" || row.type === "medium_airport") &&
        row.latitude_deg && 
        row.longitude_deg &&
        row.continent
      )
      .map((row: any) => ({
        id: String(row.id),
        ident: row.ident,
        type: row.type,
        name: row.name,
        latitude: parseFloat(row.latitude_deg),
        longitude: parseFloat(row.longitude_deg),
        elevation_ft: row.elevation_ft ? parseInt(row.elevation_ft) : null,
        continent: row.continent,
        iso_country: row.iso_country,
        iso_region: row.iso_region,
        municipality: row.municipality || null,
        scheduled_service: row.scheduled_service,
        iata_code: row.iata_code || null,
        icao_code: row.gps_code || row.icao_code || null,
      }));
  }
  return airportsCache;
}

export function getCountries(): Country[] {
  if (!countriesCache) {
    const rawData = loadCSV<any>("countries.csv");
    countriesCache = rawData.map((row: any) => ({
      id: row.id,
      code: row.code,
      name: row.name,
      continent: row.continent,
    }));
  }
  return countriesCache;
}

export function getRegions(): Region[] {
  if (!regionsCache) {
    const rawData = loadCSV<any>("regions.csv");
    regionsCache = rawData.map((row: any) => ({
      id: row.id,
      code: row.code,
      local_code: row.local_code,
      name: row.name,
      continent: row.continent,
      iso_country: row.iso_country,
    }));
  }
  return regionsCache;
}

export function getAirportsByContinent(): AirportsByContinent {
  if (!airportsByContinentCache) {
    const airports = getAirports();
    const countries = getCountries();
    
    const countryMap = new Map(countries.map(c => [c.code, c.name]));
    
    const organized: AirportsByContinent = {};
    
    for (const airport of airports) {
      const continent = airport.continent;
      const countryCode = airport.iso_country;
      const countryName = countryMap.get(countryCode) || countryCode;
      
      if (!organized[continent]) {
        organized[continent] = {};
      }
      
      if (!organized[continent][countryName]) {
        organized[continent][countryName] = [];
      }
      
      organized[continent][countryName].push(airport);
    }
    
    // Sort airports within each country by name
    for (const continent in organized) {
      for (const country in organized[continent]) {
        organized[continent][country].sort((a, b) => a.name.localeCompare(b.name));
      }
    }
    
    airportsByContinentCache = organized;
  }
  
  return airportsByContinentCache;
}

export function getContinents(): string[] {
  const data = getAirportsByContinent();
  return Object.keys(data).sort();
}

export function getCountriesByContinent(continent: string): string[] {
  const data = getAirportsByContinent();
  return data[continent] ? Object.keys(data[continent]).sort() : [];
}

export function getAirportsByCountry(continent: string, country: string): Airport[] {
  const data = getAirportsByContinent();
  return data[continent]?.[country] || [];
}

export function getAirportById(id: string): Airport | undefined {
  const airports = getAirports();
  return airports.find(a => String(a.id) === String(id) || a.ident === id);
}

export function searchAirports(query: string, limit: number = 50): Airport[] {
  const airports = getAirports();
  const lowerQuery = query.toLowerCase();
  
  return airports
    .filter(airport => 
      airport.name.toLowerCase().includes(lowerQuery) ||
      airport.municipality?.toLowerCase().includes(lowerQuery) ||
      airport.iata_code?.toLowerCase() === lowerQuery ||
      airport.icao_code?.toLowerCase() === lowerQuery
    )
    .slice(0, limit);
}

