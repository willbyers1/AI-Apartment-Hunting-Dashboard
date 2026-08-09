import React, { useState } from 'react';
import { X, DollarSign, MapPin, Clock, Home, Dog, Sparkles, Check, AlertCircle } from 'lucide-react';
import { UserPreferences, PriorityWeight, PriorityWeights } from '../types';
import { MOCK_NEIGHBORHOODS } from '../data/mockListings';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onSave: (updated: UserPreferences) => void;
}

const PRIORITY_OPTIONS: { label: string; value: PriorityWeight; color: string }[] = [
  { label: 'Critical', value: 'CRITICAL', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40' },
  { label: 'High', value: 'HIGH', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
  { label: 'Medium', value: 'MEDIUM', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' },
  { label: 'Low', value: 'LOW', color: 'bg-slate-700/50 text-slate-400 border-slate-700' },
];

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSave,
}) => {
  const [form, setForm] = useState<UserPreferences>({ ...preferences });
  const [budgetError, setBudgetError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMinBudgetChange = (val: number) => {
    if (val > form.maxBudget) {
      setBudgetError('Minimum budget cannot exceed maximum budget');
    } else {
      setBudgetError(null);
    }
    setForm({ ...form, minBudget: val });
  };

  const handleMaxBudgetChange = (val: number) => {
    if (val < form.minBudget) {
      setBudgetError('Maximum budget cannot be less than minimum budget');
    } else {
      setBudgetError(null);
    }
    setForm({ ...form, maxBudget: val });
  };

  const toggleNeighborhood = (n: string) => {
    const exists = form.preferredNeighborhoods.includes(n);
    const updated = exists
      ? form.preferredNeighborhoods.filter((item) => item !== n)
      : [...form.preferredNeighborhoods, n];
    setForm({ ...form, preferredNeighborhoods: updated });
  };

  const handleWeightChange = (key: keyof PriorityWeights, weight: PriorityWeight) => {
    setForm({
      ...form,
      weights: {
        ...form.weights,
        [key]: weight,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.minBudget > form.maxBudget) {
      setBudgetError('Min budget must be less than or equal to Max budget');
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Housing Preference Profile</h2>
              <p className="text-xs text-zinc-400">Configure your budget, location target, and AI priority weights</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Module A1: Budget Control */}
          <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-zinc-200 flex items-center gap-2 text-xs uppercase tracking-wider">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Monthly Rent Budget Range
              </label>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                ${form.minBudget.toLocaleString()} - ${form.maxBudget.toLocaleString()} / mo
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Min Rent ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                  <input
                    type="number"
                    step={100}
                    min={500}
                    max={10000}
                    value={form.minBudget}
                    onChange={(e) => handleMinBudgetChange(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-zinc-100 focus:outline-none focus:border-emerald-500/80 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Max Rent ($)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                  <input
                    type="number"
                    step={100}
                    min={500}
                    max={15000}
                    value={form.maxBudget}
                    onChange={(e) => handleMaxBudgetChange(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 pl-7 pr-3 text-zinc-100 focus:outline-none focus:border-emerald-500/80 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Rent Range Sliders */}
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={1000}
                max={10000}
                step={100}
                value={form.maxBudget}
                onChange={(e) => handleMaxBudgetChange(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {budgetError && (
              <div className="flex items-center gap-1.5 text-rose-400 text-xs mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{budgetError}</span>
              </div>
            )}
          </div>

          {/* Module A2: Location & Commute */}
          <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <label className="font-semibold text-zinc-200 flex items-center gap-2 text-xs uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-400" />
              Target Neighborhoods & Commute
            </label>

            <div>
              <label className="text-xs text-zinc-400 mb-2 block">Select Preferred Neighborhoods</label>
              <div className="flex flex-wrap gap-2">
                {MOCK_NEIGHBORHOODS.map((n) => {
                  const selected = form.preferredNeighborhoods.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => toggleNeighborhood(n)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                        selected
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-emerald-400" />}
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  Workplace / College Address
                </label>
                <input
                  type="text"
                  value={form.workplaceAddress}
                  onChange={(e) => setForm({ ...form, workplaceAddress: e.target.value })}
                  placeholder="e.g., 500 Howard St, San Francisco, CA"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 focus:outline-none focus:border-emerald-500/80 text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Max Commute Target
                  </label>
                  <span className="text-xs font-bold text-emerald-400">{form.maxCommuteMinutes} mins</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={60}
                  step={5}
                  value={form.maxCommuteMinutes}
                  onChange={(e) => setForm({ ...form, maxCommuteMinutes: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>

          {/* Module A3: Property Specs & Amenities */}
          <div className="space-y-4 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <label className="font-semibold text-zinc-200 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Home className="w-4 h-4 text-emerald-400" />
              Minimum Specs & Requirements
            </label>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Bedrooms Min</label>
                <select
                  value={form.bedMin}
                  onChange={(e) => setForm({ ...form, bedMin: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500/80"
                >
                  <option value={0}>Studio / Any</option>
                  <option value={1}>1+ Bed</option>
                  <option value={2}>2+ Bed</option>
                  <option value={3}>3+ Bed</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Bathrooms Min</label>
                <select
                  value={form.bathMin}
                  onChange={(e) => setForm({ ...form, bathMin: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500/80"
                >
                  <option value={1}>1+ Bath</option>
                  <option value={2}>2+ Bath</option>
                  <option value={3}>3+ Bath</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-zinc-400 mb-1 block">Min SqFt</label>
                <input
                  type="number"
                  step={50}
                  value={form.minSqft}
                  onChange={(e) => setForm({ ...form, minSqft: Number(e.target.value) })}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-zinc-100 text-sm focus:outline-none focus:border-emerald-500/80"
                />
              </div>
            </div>

            {/* Checkbox Amenities */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={form.petsAllowedRequired}
                  onChange={(e) => setForm({ ...form, petsAllowedRequired: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                <Dog className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pet Friendly</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={form.inUnitLaundryRequired}
                  onChange={(e) => setForm({ ...form, inUnitLaundryRequired: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                <span>In-Unit Laundry</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={form.parkingRequired}
                  onChange={(e) => setForm({ ...form, parkingRequired: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                <span>Garage Parking</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-zinc-300 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 cursor-pointer hover:border-zinc-700">
                <input
                  type="checkbox"
                  checked={form.balconyRequired}
                  onChange={(e) => setForm({ ...form, balconyRequired: e.target.checked })}
                  className="rounded accent-emerald-500"
                />
                <span>Balcony/Patio</span>
              </label>
            </div>
          </div>

          {/* Module A4: Priority Weighting Matrix */}
          <div className="space-y-3 bg-zinc-950/60 p-4 rounded-xl border border-zinc-800">
            <label className="font-semibold text-zinc-200 flex items-center justify-between text-xs uppercase tracking-wider">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                AI Priority Weighting Matrix
              </span>
              <span className="text-[10px] font-normal text-zinc-500">Controls match score calculations</span>
            </label>

            <div className="space-y-2.5 pt-1">
              {[
                { key: 'budget' as const, label: 'Monthly Rent & Budget Strictness' },
                { key: 'commute' as const, label: 'Commute Duration & Distance' },
                { key: 'size' as const, label: 'Apartment SqFt & Bed/Bath Count' },
                { key: 'amenities' as const, label: 'Building & In-unit Amenities' },
                { key: 'petFriendly' as const, label: 'Pet Policies & Deposits' },
              ].map(({ key, label }) => (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="text-xs font-medium text-zinc-300">{label}</span>
                  <div className="flex items-center gap-1">
                    {PRIORITY_OPTIONS.map((opt) => {
                      const active = form.weights[key] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleWeightChange(key, opt.value)}
                          className={`px-2.5 py-1 rounded text-xs font-semibold border transition cursor-pointer ${
                            active
                              ? opt.color
                              : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              Save & Recalculate Matches
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
