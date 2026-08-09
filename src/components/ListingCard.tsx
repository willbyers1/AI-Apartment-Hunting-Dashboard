import React, { useState } from 'react';
import { Heart, Scale, Sparkles, MapPin, Clock, Bed, Bath, Maximize2, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react';
import { Listing, AIAnalysis } from '../types';

interface ListingCardProps {
  listing: Listing;
  aiAnalysis?: AIAnalysis;
  isSaved: boolean;
  isCompared: boolean;
  isHovered: boolean;
  onToggleSave: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onRunAudit: (listing: Listing) => void;
  onHover: (id: string | null) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  aiAnalysis,
  isSaved,
  isCompared,
  isHovered,
  onToggleSave,
  onToggleCompare,
  onRunAudit,
  onHover,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = listing.images && listing.images.length > 0 
    ? listing.images 
    : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'];

  const matchScore = aiAnalysis?.matchScore ?? Math.round(85 - (listing.price > 3500 ? 12 : 0));
  
  // Score badge styling
  const scoreColor = matchScore >= 85 
    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
    : matchScore >= 70 
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
    : 'bg-rose-500/20 text-rose-300 border-rose-500/40';

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      id={`listing-card-${listing.id}`}
      onMouseEnter={() => onHover(listing.id)}
      onMouseLeave={() => onHover(null)}
      className={`bg-zinc-900 rounded-xl border transition-all duration-200 overflow-hidden flex flex-col group relative ${
        isHovered
          ? 'border-2 border-emerald-500/50 shadow-2xl shadow-emerald-950/20 scale-[1.01]'
          : 'border-zinc-800 hover:border-zinc-700'
      }`}
    >
      {/* Image Banner Carousel */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-zinc-950">
        <img
          src={images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-black/30" />

        {/* Carousel controls if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-950/70 text-zinc-200 hover:bg-zinc-900 transition opacity-0 group-hover:opacity-100 cursor-pointer border border-zinc-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-zinc-950/70 text-zinc-200 hover:bg-zinc-900 transition opacity-0 group-hover:opacity-100 cursor-pointer border border-zinc-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 right-3 flex gap-1">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 rounded-full transition-all ${
                    idx === currentImageIndex ? 'w-4 bg-emerald-400' : 'w-1 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {/* Match Score Badge */}
          <div className="px-2 py-0.5 bg-emerald-500 text-zinc-950 font-bold text-[10px] rounded uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-emerald-950/40">
            <Sparkles className="w-3 h-3" />
            <span>{matchScore}% Match</span>
          </div>

          {/* Red Flag indicator if high risk */}
          {aiAnalysis && aiAnalysis.redFlags.length > 0 && (
            <div className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] uppercase font-bold flex items-center gap-1 backdrop-blur-md">
              <ShieldAlert className="w-3 h-3 text-rose-400" />
              <span>{aiAnalysis.redFlags.length} Flag{aiAnalysis.redFlags.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Top Right Save Bookmark Button */}
        <button
          onClick={() => onToggleSave(listing.id)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-zinc-950/80 backdrop-blur-md hover:bg-zinc-900 text-zinc-200 transition cursor-pointer border border-zinc-800"
          title={isSaved ? 'Remove from saved' : 'Save listing'}
        >
          <Heart className={`w-4 h-4 ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-zinc-400'}`} />
        </button>

        {/* Bottom Floating Price */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-emerald-400 tracking-tight drop-shadow">
            ${listing.price.toLocaleString()}
          </span>
          <span className="text-xs text-zinc-400 font-normal">/mo</span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title & Address */}
          <h3 className="font-bold text-zinc-100 text-sm sm:text-base line-clamp-1 group-hover:text-emerald-400 transition">
            {listing.title}
          </h3>
          <p className="text-xs text-zinc-400 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{listing.address}, {listing.neighborhood}</span>
          </p>

          {/* Specs Grid Bar */}
          <div className="grid grid-cols-3 gap-2 my-3 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-300">
            <div className="flex flex-col items-center">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                <Bed className="w-3 h-3 text-emerald-400" /> Beds
              </span>
              <span className="font-bold text-zinc-200 mt-0.5">{listing.bedrooms} BR</span>
            </div>

            <div className="flex flex-col items-center border-x border-zinc-800">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                <Bath className="w-3 h-3 text-emerald-400" /> Baths
              </span>
              <span className="font-bold text-zinc-200 mt-0.5">{listing.bathrooms} BA</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-zinc-500 text-[10px] uppercase font-semibold flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-emerald-400" /> Size
              </span>
              <span className="font-bold text-zinc-200 mt-0.5">{listing.sqft} sqft</span>
            </div>
          </div>

          {/* Commute Badge & Price per sqft */}
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <Clock className="w-3 h-3" />
              ~{listing.commuteTimeMinutes ?? 18}m commute
            </span>
            <span className="text-zinc-500 text-[11px] font-semibold">${Math.round(listing.price / listing.sqft)}/sqft</span>
          </div>

          {/* Amenities Pills */}
          <div className="flex flex-wrap gap-1 mt-2">
            {listing.amenities.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-800">
                {amenity}
              </span>
            ))}
            {listing.amenities.length > 3 && (
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-500">
                +{listing.amenities.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2">
          {/* Compare Checkbox / Toggle Button */}
          <button
            onClick={() => onToggleCompare(listing.id)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1.5 transition cursor-pointer ${
              isCompared
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700/80'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{isCompared ? 'Comparing' : 'Compare'}</span>
          </button>

          {/* AI Audit Button */}
          <button
            onClick={() => onRunAudit(listing)}
            className="flex-1 py-1.5 px-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Audit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
