export interface WeatherData {
  current: {
    time: string;
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
    precipitationProbability: number[];
    windSpeedMax: number[];
  };
}

export async function getWeatherForecast(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  
  url.searchParams.set("latitude", latitude.toString());
  url.searchParams.set("longitude", longitude.toString());
  url.searchParams.set("current", "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max,wind_speed_10m_max");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return {
    current: {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      weatherCode: data.current.weather_code,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      humidity: data.current.relative_humidity_2m,
    },
    daily: {
      time: data.daily.time,
      temperatureMax: data.daily.temperature_2m_max,
      temperatureMin: data.daily.temperature_2m_min,
      weatherCode: data.daily.weather_code,
      precipitationProbability: data.daily.precipitation_probability_max,
      windSpeedMax: data.daily.wind_speed_10m_max,
    },
  };
}

// Weather code descriptions based on WMO codes
export function getWeatherDescription(code: number): string {
  const descriptions: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  
  return descriptions[code] || "Unknown";
}

export function getWeatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌫️";
  if (code <= 57) return "🌧️";
  if (code <= 67) return "🌧️";
  if (code <= 77) return "🌨️";
  if (code <= 82) return "🌧️";
  if (code <= 86) return "🌨️";
  if (code >= 95) return "⛈️";
  return "🌤️";
}

