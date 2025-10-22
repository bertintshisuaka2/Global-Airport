/**
 * City-specific landmark photos mapping
 * Maps city names to their iconic landmark photos
 */

export const cityPhotoMap: Record<string, string> = {
  // DRC Cities
  "Kolwezi": "/kolwezi-mining.jpg",
  "Lubumbashi": "/lubumbashi-gecamines.jpg",
  "Kinshasa": "/kinshasa-boulevard.jpg",
  
  // France
  "Paris": "/paris-eiffel.jpg",
  "Roissy-en-France": "/paris-eiffel.jpg",
  
  // USA
  "New York": "/newyork-liberty.jpg",
  "Los Angeles": "/newyork-liberty.jpg",
  
  // UK
  "London": "/london-bigben.jpg",
  
  // Japan
  "Tokyo": "/tokyo-tower.jpg",
  
  // UAE
  "Dubai": "/dubai-burj.jpg",
  
  // Add more cities as needed
};

/**
 * Get photo for a city, with fallback to generic African landscapes
 */
export function getCityPhoto(city: string | null, airportId: string): string {
  if (!city) {
    // Fallback to rotating African photos
    return `/africa-${(parseInt(airportId) % 9) + 1}.${parseInt(airportId) % 9 === 4 ? 'webp' : 'jpg'}`;
  }
  
  // Normalize city name by extracting the main city name
  const normalizedCity = city.split('(')[0].trim().split(',')[0].trim();
  
  // Check if we have a specific photo for this city (exact match)
  let specificPhoto = cityPhotoMap[city];
  if (specificPhoto) {
    return specificPhoto;
  }
  
  // Check normalized city name
  specificPhoto = cityPhotoMap[normalizedCity];
  if (specificPhoto) {
    return specificPhoto;
  }
  
  // Check if city name contains any of our mapped cities
  for (const [mappedCity, photo] of Object.entries(cityPhotoMap)) {
    if (city.toLowerCase().includes(mappedCity.toLowerCase()) || 
        normalizedCity.toLowerCase().includes(mappedCity.toLowerCase())) {
      return photo;
    }
  }
  
  // Fallback to rotating African photos
  return `/africa-${(parseInt(airportId) % 9) + 1}.${parseInt(airportId) % 9 === 4 ? 'webp' : 'jpg'}`;
}

