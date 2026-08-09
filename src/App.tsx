import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { ListingCard } from './components/ListingCard';
import { MapView } from './components/MapView';
import { PreferencesModal } from './components/PreferencesModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { AIAuditModal } from './components/AIAuditModal';
import { AddListingModal } from './components/AddListingModal';
import { Listing, UserPreferences, AIAnalysis, FilterState } from './types';
import { MOCK_LISTINGS, INITIAL_USER_PREFERENCES } from './data/mockListings';
import { Scale, Sparkles, Sliders, Trash2, ChevronUp } from 'lucide-react';

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_USER_PREFERENCES);
  const [listings, setListings] = useState<Listing[]>([]);
  const [savedListingIds, setSavedListingIds] = useState<string[]>([]);
  const [comparedListingIds, setComparedListingIds] = useState<string[]>([]);
  const [aiAnalysesMap, setAiAnalysesMap] = useState<Record<string, AIAnalysis>>({});
  const [hoveredListingId, setHoveredListingId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [filters, setFilters] = useState<FilterState>({
    searchKeyword: '',
    minPrice: 0,
    maxPrice: 10000,
    neighborhoods: [],
    bedMin: 0,
    bathMin: 0,
    petsAllowed: false,
    inUnitLaundry: false,
    parking: false,
    maxCommute: 60,
    sortBy: 'match',
  });

  // Modals state
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [activeAuditListing, setActiveAuditListing] = useState<Listing | null>(null);
  const [isAuditLoading, setIsAuditLoading] = useState(false);

  // Fetch initial listings from Express API
  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await fetch('/api/listings');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setListings(json.data);
        } else {
          setListings(MOCK_LISTINGS);
        }
      } catch (e) {
        console.warn('Failed to fetch from /api/listings, loading mock data', e);
        setListings(MOCK_LISTINGS);
      }
    }
    fetchListings();
  }, []);

  // Filter & Sort listing logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        // Keyword Search
        if (filters.searchKeyword.trim()) {
          const kw = filters.searchKeyword.toLowerCase();
          const matchTitle = listing.title.toLowerCase().includes(kw);
          const matchAddress = listing.address.toLowerCase().includes(kw);
          const matchNeigh = listing.neighborhood.toLowerCase().includes(kw);
          const matchAmenity = listing.amenities.some((a) => a.toLowerCase().includes(kw));
          if (!matchTitle && !matchAddress && !matchNeigh && !matchAmenity) return false;
        }

        // Bedrooms
        if (filters.bedMin > 0 && listing.bedrooms < filters.bedMin) return false;

        // Toggles
        if (filters.petsAllowed && listing.petPolicy.toLowerCase().includes('no pets')) return false;
        if (filters.inUnitLaundry && !listing.amenities.includes('In-Unit Laundry')) return false;
        if (filters.parking && !listing.amenities.includes('Covered Parking') && !listing.parkingInfo.toLowerCase().includes('garage') && !listing.parkingInfo.toLowerCase().includes('reserved')) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.price - b.price;
        if (filters.sortBy === 'price_desc') return b.price - a.price;
        if (filters.sortBy === 'sqft') return b.sqft - a.sqft;

        // Default: Sort by Match Score
        const scoreA = aiAnalysesMap[a.id]?.matchScore ?? (85 - (a.price > preferences.maxBudget ? 15 : 0));
        const scoreB = aiAnalysesMap[b.id]?.matchScore ?? (85 - (b.price > preferences.maxBudget ? 15 : 0));
        return scoreB - scoreA;
      });
  }, [listings, filters, aiAnalysesMap, preferences]);

  // Handle Save / Bookmark
  const handleToggleSave = (id: string) => {
    setSavedListingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle Compare Toggle
  const handleToggleCompare = (id: string) => {
    setComparedListingIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 listings simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  // Run AI Audit endpoint
  const handleRunAudit = async (listing: Listing) => {
    setActiveAuditListing(listing);
    setIsAuditLoading(true);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing,
          preferences,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysesMap((prev) => ({
          ...prev,
          [listing.id]: json.data,
        }));
      }
    } catch (err) {
      console.error('Failed to trigger AI audit:', err);
    } finally {
      setIsAuditLoading(false);
    }
  };

  // Handle Add Custom Listing
  const handleAddListing = async (newListingData: Partial<Listing>) => {
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newListingData),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setListings((prev) => [json.data, ...prev]);
        handleRunAudit(json.data);
      }
    } catch (e) {
      console.error('Failed to add custom listing:', e);
    }
  };

  const comparedListings = useMemo(() => {
    return listings.filter((l) => comparedListingIds.includes(l.id));
  }, [listings, comparedListingIds]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-zinc-950">
      {/* App Navigation Header */}
      <Navbar
        preferences={preferences}
        onOpenPreferences={() => setIsPreferencesOpen(true)}
        onOpenAddListing={() => setIsAddListingOpen(true)}
        onOpenComparison={() => setIsComparisonOpen(true)}
        savedCount={savedListingIds.length}
        compareCount={comparedListingIds.length}
      />

      {/* Filter & Control Toolbar */}
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalResults={filteredListings.length}
      />

      {/* Main Dashboard Workspace (Split / Grid / Map) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        {/* Left Pane: Scrollable Listing Cards */}
        {(viewMode === 'split' || viewMode === 'grid') && (
          <div
            className={`space-y-4 overflow-y-auto pr-1 ${
              viewMode === 'grid'
                ? 'col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 space-y-0'
                : 'col-span-12 lg:col-span-7'
            }`}
          >
            {filteredListings.length === 0 ? (
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center space-y-3 my-auto col-span-full">
                <Sliders className="w-10 h-10 text-zinc-500 mx-auto" />
                <h3 className="text-lg font-bold text-zinc-200">No properties match your active filters</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Try broadening your target rent range, clearing specific amenity toggles, or selecting additional neighborhoods.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      searchKeyword: '',
                      minPrice: 0,
                      maxPrice: 10000,
                      neighborhoods: [],
                      bedMin: 0,
                      bathMin: 0,
                      petsAllowed: false,
                      inUnitLaundry: false,
                      parking: false,
                      maxCommute: 60,
                      sortBy: 'match',
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  aiAnalysis={aiAnalysesMap[listing.id]}
                  isSaved={savedListingIds.includes(listing.id)}
                  isCompared={comparedListingIds.includes(listing.id)}
                  isHovered={hoveredListingId === listing.id}
                  onToggleSave={handleToggleSave}
                  onToggleCompare={handleToggleCompare}
                  onRunAudit={handleRunAudit}
                  onHover={setHoveredListingId}
                />
              ))
            )}
          </div>
        )}

        {/* Right Pane: Interactive Map View */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`h-[calc(100vh-180px)] sticky top-20 rounded-2xl overflow-hidden shadow-2xl ${
              viewMode === 'map' ? 'col-span-12' : 'col-span-12 lg:col-span-5 hidden lg:block'
            }`}
          >
            <MapView
              listings={filteredListings}
              aiAnalysesMap={aiAnalysesMap}
              hoveredListingId={hoveredListingId}
              onHoverListing={setHoveredListingId}
              onRunAudit={handleRunAudit}
              onToggleCompare={handleToggleCompare}
              comparedListingIds={comparedListingIds}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar for Active Comparison Queue */}
      {comparedListingIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-zinc-900/95 border border-zinc-800 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 text-xs sm:text-sm text-zinc-100 animate-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold">
              <strong className="text-emerald-400 font-bold">{comparedListingIds.length}</strong> / 4 Properties Selected
            </span>
          </div>

          <div className="h-4 w-px bg-zinc-800" />

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition cursor-pointer"
          >
            <span>Launch Comparison</span>
            <ChevronUp className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={() => setComparedListingIds([])}
            className="text-zinc-400 hover:text-rose-400 p-1 rounded transition cursor-pointer"
            title="Clear compare selection"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals & Drawers */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        preferences={preferences}
        onSave={setPreferences}
      />

      <ComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        comparedListings={comparedListings}
        aiAnalysesMap={aiAnalysesMap}
        onRemoveFromCompare={handleToggleCompare}
        onClearAll={() => setComparedListingIds([])}
        onRunAudit={handleRunAudit}
      />

      <AIAuditModal
        isOpen={Boolean(activeAuditListing)}
        onClose={() => setActiveAuditListing(null)}
        listing={activeAuditListing}
        preferences={preferences}
        aiAnalysis={activeAuditListing ? aiAnalysesMap[activeAuditListing.id] : undefined}
        onRunAudit={handleRunAudit}
        isLoading={isAuditLoading}
      />

      <AddListingModal
        isOpen={isAddListingOpen}
        onClose={() => setIsAddListingOpen(false)}
        onAddListing={handleAddListing}
      />
    </div>
  );
}
