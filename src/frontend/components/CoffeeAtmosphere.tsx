import React from 'react';

/**
 * Editorial Academic Foundation Canvas
 * Provides a quiet, physical paper-like texture and subtle architectural hairline guides
 * without generic AI floating glowing orbs or particle blurs.
 */
export const CoffeeAtmosphere: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#FAF7F2]"
    >
      {/* Subtle top academic ambient wash in rich wine */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] opacity-60 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(91, 30, 49, 0.055) 0%, rgba(158, 123, 68, 0.025) 50%, transparent 100%)'
        }}
      />

      {/* Architectural vertical hairline registration rules (Editorial Grid) */}
      <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between opacity-35">
        <div className="w-px h-full bg-gradient-to-b from-[#E2D8CA] via-[#EFE8DD] to-transparent" />
        <div className="hidden lg:block w-px h-full bg-gradient-to-b from-[#E2D8CA] via-[#EFE8DD] to-transparent" />
        <div className="hidden md:block w-px h-full bg-gradient-to-b from-[#E2D8CA] via-[#EFE8DD] to-transparent" />
        <div className="w-px h-full bg-gradient-to-b from-[#E2D8CA] via-[#EFE8DD] to-transparent" />
      </div>

      {/* Subtle paper grain tactile texture */}
      <div
        className="absolute inset-0 opacity-[0.028] pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
};

export const SignatureWineCreamBackground = CoffeeAtmosphere;
