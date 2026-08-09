import React, { useState } from 'react';
import { X, PlusCircle, Building, DollarSign, MapPin, Check } from 'lucide-react';
import { Listing } from '../types';

interface AddListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddListing: (listing: Partial<Listing>) => void;
}

export const AddListingModal: React.FC<AddListingModalProps> = ({
  isOpen,
  onClose,
  onAddListing,
}) => {
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('Mission District');
  const [city, setCity] = useState('San Francisco');
  const [price, setPrice] = useState(3000);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [sqft, setSqft] = useState(700);
  const [deposit, setDeposit] = useState(3000);
  const [description, setDescription] = useState('');
  const [leaseTerms, setLeaseTerms] = useState('12-month lease');
  const [imageUrl, setImageUrl] = useState('');
  const [petPolicy, setPetPolicy] = useState('Pets allowed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !address || !price) return;

    onAddListing({
      title,
      address,
      neighborhood,
      city,
      price: Number(price),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      sqft: Number(sqft),
      deposit: Number(deposit),
      description,
      leaseTerms,
      images: imageUrl ? [imageUrl] : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80'],
      petPolicy,
      lat: 37.7749 + (Math.random() - 0.5) * 0.05,
      lng: -122.4194 + (Math.random() - 0.5) * 0.05,
      amenities: ['Dishwasher', 'In-Unit Laundry', 'Pet Friendly'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-zinc-950 flex items-center justify-center font-bold shadow-md shadow-emerald-500/20">
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100 uppercase tracking-tight">Add Custom Listing</h2>
              <p className="text-xs text-zinc-400">Input any rental listing to run AI red flag audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm flex-1">
          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Listing Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Sunny 1BR Loft on Valencia"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Monthly Rent ($)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Security Deposit ($)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Address</label>
              <input
                type="text"
                required
                placeholder="742 Valencia St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Neighborhood</label>
              <input
                type="text"
                required
                placeholder="Mission District"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Bedrooms</label>
              <input
                type="number"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">Bathrooms</label>
              <input
                type="number"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
            <div>
              <label className="text-xs text-zinc-400 mb-1 block">SqFt</label>
              <input
                type="number"
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Listing Description & Disclosures</label>
            <textarea
              rows={3}
              placeholder="Paste description or lease disclosures here for AI red flag auditing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div>
            <label className="text-xs text-zinc-400 mb-1 block">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-emerald-500/80"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Check className="w-4 h-4 stroke-[3]" /> Add Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
