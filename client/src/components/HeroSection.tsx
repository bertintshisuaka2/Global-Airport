import { Plane } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="relative w-full h-80 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/airport-hero.jpg)' }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Plane className="h-12 w-12 text-white drop-shadow-lg" />
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Global Airports Weather & Location
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-white/95 drop-shadow-md max-w-3xl">
          Explore international airports worldwide with real-time weather and location data
        </p>
      </div>
    </div>
  );
}

