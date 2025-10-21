import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeatherData {
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

interface WeatherDisplayProps {
  weather: WeatherData;
}

function getWeatherIcon(code: number): string {
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

function getWeatherDescription(code: number): string {
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
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] || "Unknown";
}

export default function WeatherDisplay({ weather }: WeatherDisplayProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-4">
      {/* Current Weather */}
      <Card>
        <CardHeader>
          <CardTitle>Current Weather</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-6xl">{getWeatherIcon(weather.current.weatherCode)}</div>
            <div className="flex-1">
              <div className="text-4xl font-bold">{Math.round(weather.current.temperature)}°C</div>
              <div className="text-lg text-muted-foreground">
                {getWeatherDescription(weather.current.weatherCode)}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>💨 Wind: {Math.round(weather.current.windSpeed)} km/h</div>
              <div>💧 Humidity: {weather.current.humidity}%</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            {weather.daily.time.map((date, index) => (
              <div
                key={date}
                className="flex flex-col items-center p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="text-sm font-medium mb-2">{formatDate(date)}</div>
                <div className="text-3xl mb-2">{getWeatherIcon(weather.daily.weatherCode[index])}</div>
                <div className="text-sm font-semibold">
                  {Math.round(weather.daily.temperatureMax[index])}°
                </div>
                <div className="text-xs text-muted-foreground">
                  {Math.round(weather.daily.temperatureMin[index])}°
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  💧 {weather.daily.precipitationProbability[index]}%
                </div>
                <div className="text-xs text-muted-foreground">
                  💨 {Math.round(weather.daily.windSpeedMax[index])} km/h
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

