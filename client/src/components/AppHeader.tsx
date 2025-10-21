export default function AppHeader() {
  return (
    <div className="relative w-full h-64 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/airport-header.jpg)' }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center justify-between">
        {/* Left side - Branding */}
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            Divalaser Software Solutions
          </h1>
          <p className="text-xl md:text-2xl text-white/90 drop-shadow-md">
            Software Engineer & Full Stack Developer
          </p>
        </div>

        {/* Right side - Profile Photo */}
        <div className="hidden md:flex items-center ml-8">
          <div className="relative">
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src="/bertin-avatar.jpg" 
                alt="Bertin Tshisuaka" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
              <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
                Bertin Tshisuaka
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Profile - Below header on small screens */}
      <div className="md:hidden absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-white">
            <img 
              src="/bertin-avatar.jpg" 
              alt="Bertin Tshisuaka" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
            <p className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              Bertin Tshisuaka
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

