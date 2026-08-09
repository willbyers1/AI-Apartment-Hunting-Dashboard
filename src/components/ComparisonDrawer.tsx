import React from 'react';
import { X, Scale, Trash2, CheckCircle2, XCircle, ShieldAlert, Sparkles, MapPin, DollarSign, Clock, Check } from 'lucide-react';
import { Listing, AIAnalysis } from '../types';

interface ComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  comparedListings: Listing[];
  aiAnalysesMap: Record<string, AIAnalysis>;
  onRemoveFromCompare: (id: string) => void;
  onClearAll: () => void;
  onRunAudit: (listing: Listing) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  isOpen,
  onClose,
  comparedListings,
  aiAnalysesMap,
  onRemoveFromCompare,
  onClearAll,
  onRunAudit,
}) => {
  if (!isOpen || comparedListings.length === 0) return null;

  // Calculate best and worst metrics across selected listings for visual delta highlighting
  const prices = comparedListings.map((l) => l.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const sqftRatios = comparedListings.map((l) => Math.round(l.price / l.sqft));
  const minSqftRatio = Math.min(...sqftRatios);
  const maxSqftRatio = Math.max(...sqftRatios);

  const commutes = comparedListings.map((l) => l.commuteTimeMinutes ?? 20);
  const minCommute = Math.min(...commutes);
  const maxCommute = Math.max(...commutes);

  const scores = comparedListings.map((l) => aiAnalysesMap[l.id]?.matchScore ?? 80);
  const maxScore = Math.max(...scores);

  // Common amenities to compare
  const ALL_AMENITIES = [
    'In-Unit Laundry',
    'Dishwasher',
    'Pet Friendly',
    'Pool',
    'Gym',
    'Balcony',
    'Elevator',
    'Fireplace',
    'Ev Charging',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-tight">
                Apartment Comparison Matrix
              </h2>
              <p className="text-xs text-zinc-400">
                Evaluating {comparedListings.length} property specs side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear Selection
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="p-3 text-[10px] font-bold text-zinc-500 w-44 uppercase tracking-widest bg-zinc-950/40 rounded-l-lg">
                    Property Feature
                  </th>
                  {comparedListings.map((listing) => {
                    const analysis = aiAnalysesMap[listing.id];
                    const score = analysis?.matchScore ?? 80;
                    return (
                      <th key={listing.id} className="p-3 w-64 align-top">
                        <div className="space-y-2 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 relative group">
                          <button
                            onClick={() => onRemoveFromCompare(listing.id)}
                            className="absolute top-2 right-2 text-zinc-500 hover:text-rose-400 p-1 rounded-full transition cursor-pointer"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-28 object-cover rounded-lg"
                          />
                          <h4 className="font-bold text-sm text-zinc-100 line-clamp-1">{listing.title}</h4>
                          <p className="text-xs text-zinc-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span className="truncate">{listing.neighborhood}</span>
                          </p>
                          <button
                            onClick={() => onRunAudit(listing)}
                            className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer shadow"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>AI Audit ({score}%)</span>
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/60 text-xs">
                {/* Match Score Row */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">AI Compatibility Match</td>
                  {comparedListings.map((l) => {
                    const score = aiAnalysesMap[l.id]?.matchScore ?? 80;
                    const isBest = score === maxScore && comparedListings.length > 1;
                    return (
                      <td key={l.id} className="p-3">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-bold text-xs border ${
                            isBest
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                              : score >= 75
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          {score}% Match {isBest && '★ Best Match'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Monthly Rent Row */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Monthly Rent ($)</td>
                  {comparedListings.map((l) => {
                    const isCheapest = l.price === minPrice && comparedListings.length > 1;
                    const isHighest = l.price === maxPrice && comparedListings.length > 1;
                    return (
                      <td key={l.id} className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-zinc-100">${l.price.toLocaleString()}</span>
                          {isCheapest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Lowest Rent
                            </span>
                          )}
                          {isHighest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                              Highest Rent
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>

                {/* $/SqFt Ratio */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Value Ratio ($/SqFt)</td>
                  {comparedListings.map((l) => {
                    const ratio = Math.round(l.price / l.sqft);
                    const isBestValue = ratio === minSqftRatio && comparedListings.length > 1;
                    return (
                      <td key={l.id} className="p-3">
                        <span className={`font-semibold ${isBestValue ? 'text-emerald-400 font-bold' : 'text-zinc-300'}`}>
                          ${ratio}/sqft {isBestValue && '⚡ Best Value'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Commute Duration */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Commute Time</td>
                  {comparedListings.map((l) => {
                    const time = l.commuteTimeMinutes ?? 20;
                    const isShortest = time === minCommute && comparedListings.length > 1;
                    return (
                      <td key={l.id} className="p-3">
                        <span className={`flex items-center gap-1 ${isShortest ? 'text-emerald-400 font-bold' : 'text-zinc-300'}`}>
                          <Clock className="w-3.5 h-3.5" />
                          ~{time} mins {isShortest && '(Fastest)'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Bedrooms & Bathrooms */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Layout & Size</td>
                  {comparedListings.map((l) => (
                    <td key={l.id} className="p-3 text-zinc-200">
                      {l.bedrooms} Bed, {l.bathrooms} Bath ({l.sqft} sqft)
                    </td>
                  ))}
                </tr>

                {/* Security Deposit */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Move-in Deposit</td>
                  {comparedListings.map((l) => {
                    const isHighDeposit = l.deposit > l.price * 1.5;
                    return (
                      <td key={l.id} className="p-3">
                        <span className={isHighDeposit ? 'text-rose-400 font-semibold' : 'text-zinc-300'}>
                          ${l.deposit.toLocaleString()} {isHighDeposit && '(High Deposit)'}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Lease Terms & Restrictions */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Lease Terms</td>
                  {comparedListings.map((l) => (
                    <td key={l.id} className="p-3 text-zinc-300 line-clamp-2" title={l.leaseTerms}>
                      {l.leaseTerms || 'Standard 12-month lease'}
                    </td>
                  ))}
                </tr>

                {/* Pet Policy */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Pet Policy</td>
                  {comparedListings.map((l) => {
                    const noPets = l.petPolicy.toLowerCase().includes('no pets');
                    return (
                      <td key={l.id} className="p-3">
                        <span className={noPets ? 'text-rose-400 font-semibold' : 'text-emerald-300'}>
                          {l.petPolicy}
                        </span>
                      </td>
                    );
                  })}
                </tr>

                {/* Included Utilities */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">Included Utilities</td>
                  {comparedListings.map((l) => (
                    <td key={l.id} className="p-3 text-zinc-300">
                      {l.utilitiesIncluded?.length ? l.utilitiesIncluded.join(', ') : 'Tenant pays all utilities'}
                    </td>
                  ))}
                </tr>

                {/* Red Flags Summary */}
                <tr>
                  <td className="p-3 font-semibold text-zinc-300 bg-zinc-950/30">AI Red Flag Alerts</td>
                  {comparedListings.map((l) => {
                    const flags = aiAnalysesMap[l.id]?.redFlags || [];
                    return (
                      <td key={l.id} className="p-3">
                        {flags.length > 0 ? (
                          <div className="flex items-center gap-1 text-rose-400 font-semibold">
                            <ShieldAlert className="w-4 h-4" />
                            <span>{flags.length} Flag{flags.length > 1 ? 's' : ''} detected</span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" /> No major flags
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Amenity Checklist Matrix */}
                {ALL_AMENITIES.map((amenity) => (
                  <tr key={amenity}>
                    <td className="p-3 text-zinc-400 bg-zinc-950/20">{amenity}</td>
                    {comparedListings.map((l) => {
                      const hasAmenity = l.amenities.includes(amenity);
                      return (
                        <td key={l.id} className="p-3">
                          {hasAmenity ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-zinc-600" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
