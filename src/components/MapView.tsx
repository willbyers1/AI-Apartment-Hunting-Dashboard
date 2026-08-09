import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Globe } from 'lucide-react';
import { Listing, AIAnalysis } from '../types';

interface MapViewProps {
  listings: Listing[];
  aiAnalysesMap: Record<string, AIAnalysis>;
  hoveredListingId: string | null;
  onHoverListing: (id: string | null) => void;
  onRunAudit: (listing: Listing) => void;
  onToggleCompare: (id: string) => void;
  comparedListingIds: string[];
}

export const MapView: React.FC<MapViewProps> = ({
  listings,
  aiAnalysesMap,
  hoveredListingId,
  onHoverListing,
  onRunAudit,
  onToggleCompare,
  comparedListingIds,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default to SF San Francisco center or first listing
      const initialLat = listings.length > 0 ? listings[0].lat : 37.7749;
      const initialLng = listings.length > 0 ? listings[0].lng : -122.4194;

      // Restrict map boundaries strictly to United States and Canada
      const northAmericaBounds = L.latLngBounds([
        [15.0, -178.0], // Southwest (Hawaii/Southern US)
        [75.0, -50.0],  // Northeast (Northern Canada/Alaska)
      ]);

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        maxBounds: northAmericaBounds,
        maxBoundsViscosity: 1.0,
        minZoom: 3,
        maxZoom: 19,
      }).setView([initialLat, initialLng], 12);

      // Add dark matter tile layer bounded to US & Canada
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        minZoom: 3,
        subdomains: 'abcd',
        bounds: northAmericaBounds,
      }).addTo(map);

      // Add zoom control to top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: L.Marker) => m.remove());
    markersRef.current = {};

    if (listings.length === 0) return;

    const bounds = L.latLngBounds([]);

    listings.forEach((listing) => {
      const matchScore = aiAnalysesMap[listing.id]?.matchScore ?? Math.round(85 - (listing.price > 3500 ? 12 : 0));
      const isHovered = hoveredListingId === listing.id;

      let colorClass = 'bg-emerald-500 text-zinc-950 font-bold border-emerald-400';
      if (matchScore < 70) {
        colorClass = 'bg-rose-500 text-zinc-950 font-bold border-rose-400';
      } else if (matchScore < 85) {
        colorClass = 'bg-amber-500 text-zinc-950 font-bold border-amber-400';
      }

      const iconHtml = `
        <div class="relative group cursor-pointer flex flex-col items-center">
          <div class="px-2.5 py-1 rounded-lg text-xs font-bold shadow-xl border transition-all duration-200 flex items-center gap-1 ${colorClass} ${
            isHovered ? 'scale-125 z-50 ring-4 ring-emerald-500/50' : ''
          }">
            <span>$${listing.price.toLocaleString()}</span>
          </div>
          <div class="w-2 h-2 bg-emerald-500 rotate-45 -mt-1"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-map-pin',
        iconSize: [85, 36],
        iconAnchor: [42, 36],
      });

      const marker = L.marker([listing.lat, listing.lng], { icon: customIcon }).addTo(map);

      // Popup Content
      const popupHtml = `
        <div class="p-2 max-w-[220px] font-sans bg-zinc-900 text-zinc-100 rounded-lg border border-zinc-800">
          <img src="${listing.images?.[0] || ''}" class="w-full h-24 object-cover rounded mb-2" />
          <h4 class="font-bold text-xs line-clamp-1 text-zinc-100">${listing.title}</h4>
          <p class="text-[11px] text-zinc-400">${listing.address}</p>
          <div class="mt-1 flex items-center justify-between font-semibold text-xs text-emerald-400">
            <span>$${listing.price}/mo</span>
            <span>${listing.bedrooms}BR / ${listing.bathrooms}BA</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('mouseover', () => {
        onHoverListing(listing.id);
      });

      marker.on('mouseout', () => {
        onHoverListing(null);
      });

      marker.on('click', () => {
        const cardEl = document.getElementById(`listing-card-${listing.id}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });

      markersRef.current[listing.id] = marker;
      bounds.extend([listing.lat, listing.lng]);
    });

    if (listings.length > 0 && map) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [listings, aiAnalysesMap, hoveredListingId, comparedListingIds]);

  return (
    <div className="relative w-full h-full min-h-[400px] bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Map Boundary Restriction Badge */}
      <div className="absolute top-4 left-4 z-[400] bg-zinc-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-200 flex items-center gap-2 shadow-2xl">
        <Globe className="w-4 h-4 text-emerald-400" />
        <span>Region: United States & Canada Only</span>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-6 right-6 z-[400] bg-zinc-900/90 backdrop-blur-md p-4 rounded-xl border border-zinc-800 text-xs text-zinc-300 shadow-2xl space-y-2">
        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Map Legend</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-xs text-zinc-300">High Match (&gt;85%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-xs text-zinc-300">Moderate Match (70-84%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <span className="text-xs text-zinc-300">Lower Match (&lt;70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
