import React from 'react';
import { Search, Dog, Shirt, Car, LayoutGrid, Map as MapIcon, Columns, ArrowUpDown } from 'lucide-react';
import { FilterState } from '../types';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  viewMode: 'split' | 'grid' | 'map';
  onViewModeChange: (mode: 'split' | 'grid' | 'map') => void;
  totalResults: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  viewMode,
  onViewModeChange,
  totalResults,
}) => {
  return (
    <div className="bg-zinc-950/80 border-b border-zinc-800 px-4 py-3 text-zinc-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search & Inputs Group */}
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Keyword Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search location, neighborhood, specs..."
              value={filters.searchKeyword}
              onChange={(e) => onFilterChange({ ...filters, searchKeyword: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-9 pr-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          {/* Bedrooms Filter */}
          <select
            value={filters.bedMin}
            onChange={(e) => onFilterChange({ ...filters, bedMin: Number(e.target.value) })}
            className="bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 px-3 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500/80 cursor-pointer"
          >
            <option value={0}>All Beds</option>
            <option value={1}>1+ Bed</option>
            <option value={2}>2+ Bed</option>
            <option value={3}>3+ Bed</option>
          </select>

          {/* Quick Toggle Buttons */}
          <button
            onClick={() => onFilterChange({ ...filters, petsAllowed: !filters.petsAllowed })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
              filters.petsAllowed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Dog className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pets</span>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, inUnitLaundry: !filters.inUnitLaundry })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
              filters.inUnitLaundry
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Laundry</span>
          </button>

          <button
            onClick={() => onFilterChange({ ...filters, parking: !filters.parking })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
              filters.parking
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parking</span>
          </button>
        </div>

        {/* Right side: Sorting & View Mode Toggle */}
        <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-800">
          {/* Results count indicator */}
          <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">
            <strong className="text-zinc-200 font-bold">{totalResults}</strong> Listings
          </span>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
              className="bg-transparent text-xs text-zinc-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="match" className="bg-zinc-900">Sort by Match</option>
              <option value="price_asc" className="bg-zinc-900">Price: Low to High</option>
              <option value="price_desc" className="bg-zinc-900">Price: High to Low</option>
              <option value="sqft" className="bg-zinc-900">Largest SqFt</option>
            </select>
          </div>

          {/* View Switcher (Desktop Split / Grid / Map) */}
          <div className="flex items-center bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs">
            <button
              onClick={() => onViewModeChange('split')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition cursor-pointer ${
                viewMode === 'split' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Split View (Cards + Map)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Split</span>
            </button>

            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Grid View Only"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={() => onViewModeChange('map')}
              className={`px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold transition cursor-pointer ${
                viewMode === 'map' ? 'bg-zinc-800 text-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Full Screen Map"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
