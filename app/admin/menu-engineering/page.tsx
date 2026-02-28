'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import { CATERING_PRODUCTS } from '@/lib/products';
import { DINE_IN_MENU, type DineInMenuSection, type DineInMenuItem } from '@/lib/dine-in-menu';
import { getCardSize, shouldShowBadge, getBadgeText } from '@/lib/menu-engineering';
import Badge from '@/components/ui/Badge';
import type {
  CateringProduct,
  MenuClassification,
  VisualWeight,
  MenuEngineeringData,
  EventType,
  ProductPricing,
} from '@/lib/types';

// ── Constants ────────────────────────────────────────────────────────────────

type MenuTab = 'catering' | 'dine-in';
const CLASSIFICATIONS: MenuClassification[] = ['STAR', 'PUZZLE', 'PLOWHORSE', 'DOG'];
const VISUAL_WEIGHTS: VisualWeight[] = ['high', 'medium', 'low'];
const CATEGORIES: EventType[] = ['appetizers', 'entrees', 'sides'];

const CLS: Record<MenuClassification, { bg: string; text: string; border: string; accent: string; hint: string }> = {
  STAR:      { bg: 'bg-amber-50',    text: 'text-amber-900',   border: 'border-amber-300', accent: 'bg-amber-400',   hint: 'High profit + high popularity' },
  PUZZLE:    { bg: 'bg-sky-50',      text: 'text-sky-900',     border: 'border-sky-300',   accent: 'bg-sky-400',     hint: 'High profit + low popularity' },
  PLOWHORSE: { bg: 'bg-emerald-50',  text: 'text-emerald-900', border: 'border-emerald-300', accent: 'bg-emerald-400', hint: 'Low profit + high popularity' },
  DOG:       { bg: 'bg-red-50',      text: 'text-red-900',     border: 'border-red-300',   accent: 'bg-red-400',     hint: 'Low profit + low popularity' },
};

const ICON: Record<MenuClassification, string> = {
  STAR: '\u2B50', PUZZLE: '\uD83E\uDDE9', PLOWHORSE: '\uD83D\uDC34', DOG: '\uD83D\uDC36',
};

// ── Types ────────────────────────────────────────────────────────────────────

interface CateringEdits {
  title: string;
  description: string;
  image: string;
  pricing: ProductPricing;
  menuEngineering: MenuEngineeringData;
}

interface DineInItemEdits {
  name: string;
  description: string;
  price: string;
  classification: MenuClassification | '';
  visualWeight: VisualWeight | '';
  image: string;
}

interface DineInSectionEdits {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  items: DineInItemEdits[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function defaultEngineering(): MenuEngineeringData {
  return {
    classification: 'PLOWHORSE', foodCost: null, salesRank: null, placementPriority: null,
    visualWeight: 'medium', descriptionStrategy: 'maintain', badgeText: null,
    enhancedDescription: null, salesVelocity7d: null, salesVelocity30d: null,
    trendDirection: null, lastClassifiedAt: null,
  };
}

function buildCateringEdits(): Record<string, CateringEdits> {
  const map: Record<string, CateringEdits> = {};
  for (const p of CATERING_PRODUCTS) {
    map[p.id] = {
      title: p.title, description: p.description, image: p.image,
      pricing: JSON.parse(JSON.stringify(p.pricing)),
      menuEngineering: { ...(p.menuEngineering ?? defaultEngineering()) },
    };
  }
  return map;
}

function buildDineInEdits(): DineInSectionEdits[] {
  return DINE_IN_MENU.map(section => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle ?? '',
    image: section.image ?? '',
    items: section.items.map(item => ({
      name: item.name,
      description: item.description ?? '',
      price: item.price ?? '',
      classification: (item.classification ?? '') as MenuClassification | '',
      visualWeight: (item.visualWeight ?? '') as VisualWeight | '',
      image: item.image ?? '',
    })),
  }));
}

function priceSummary(pricing: ProductPricing): string {
  if (pricing.type === 'pan') {
    const h = pricing.sizes.find(s => s.size === 'half');
    const f = pricing.sizes.find(s => s.size === 'full');
    return `$${h?.price ?? '?'} / $${f?.price ?? '?'}`;
  }
  if (pricing.type === 'per-each') return `$${pricing.priceEach}`;
  if (pricing.type === 'per-person') return `$${pricing.pricePerPerson}/pp`;
  if (pricing.type === 'per-dozen') return `$${pricing.pricePerDozen}/dz`;
  if (pricing.type === 'per-container') return `$${pricing.pricePerContainer}`;
  return '';
}

// ── Shared Components ────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">{children}</label>;
}

function ClassPill({ classification }: { classification: MenuClassification }) {
  const s = CLS[classification];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${s.bg} ${s.text} border ${s.border}`}>
      <span className={`w-2 h-2 rounded-full ${s.accent}`} />
      {ICON[classification]} {classification}
    </span>
  );
}

function ImageUploader({ currentImage, onImageChange }: { currentImage: string; onImageChange: (path: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/admin/upload-image', { method: 'POST', body: form });
      const data = await res.json();
      if (data.success) onImageChange(data.path);
    } catch { /* ignore */ }
    setUploading(false);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative border-2 border-gray-200">
        {currentImage ? (
          <Image src={currentImage} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
        )}
      </div>
      <div className="flex-1 space-y-1.5">
        <input type="text" value={currentImage} onChange={e => onImageChange(e.target.value)}
          placeholder="/images/menu/filename.jpg"
          className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg text-xs font-mono text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className={`text-[11px] font-semibold px-3 py-1 rounded-md border transition-colors ${
            uploading ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
          }`}>
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>
    </div>
  );
}

function ClassificationPicker({ value, onChange, compact }: { value: MenuClassification | ''; onChange: (v: MenuClassification | '') => void; compact?: boolean }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button onClick={() => onChange('')}
        className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
          value === '' ? 'bg-gray-200 text-gray-700 border-gray-300' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
        }`}>None</button>
      {CLASSIFICATIONS.map(cls => {
        const cs = CLS[cls];
        const active = value === cls;
        return (
          <button key={cls} onClick={() => onChange(cls)}
            className={`flex items-center gap-1 ${compact ? 'px-2 py-1' : 'px-2.5 py-1.5'} rounded-md text-xs font-semibold border-2 transition-all ${
              active ? `${cs.bg} ${cs.text} ${cs.border}` : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
            }`}>
            {ICON[cls]} {cls}
          </button>
        );
      })}
    </div>
  );
}

function WeightPicker({ value, onChange }: { value: VisualWeight | ''; onChange: (v: VisualWeight | '') => void }) {
  return (
    <div className="flex gap-1.5">
      <button onClick={() => onChange('')}
        className={`px-2 py-1 rounded-md text-xs font-medium border transition-all ${
          value === '' ? 'bg-gray-200 text-gray-700 border-gray-300' : 'bg-white text-gray-400 border-gray-200'
        }`}>None</button>
      {VISUAL_WEIGHTS.map(w => (
        <button key={w} onClick={() => onChange(w)}
          className={`px-3 py-1 rounded-md text-xs font-medium border-2 transition-all ${
            value === w ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
          }`}>{w.charAt(0).toUpperCase() + w.slice(1)}</button>
      ))}
    </div>
  );
}

// ── Pricing Editor ───────────────────────────────────────────────────────────

function PricingEditor({ pricing, onChange }: { pricing: ProductPricing; onChange: (p: ProductPricing) => void }) {
  if (pricing.type === 'pan') {
    const half = pricing.sizes.find(s => s.size === 'half')!;
    const full = pricing.sizes.find(s => s.size === 'full')!;
    const updateSize = (size: 'half' | 'full', field: string, value: number) => {
      onChange({ ...pricing, sizes: pricing.sizes.map(s => s.size === size ? { ...s, [field]: value } : s) });
    };
    return (
      <div className="grid grid-cols-2 gap-3">
        {[{ label: 'Half Pan', data: half, size: 'half' as const }, { label: 'Full Pan', data: full, size: 'full' as const }].map(({ label, data, size }) => (
          <div key={size}>
            <label className="text-[10px] text-gray-400 font-medium">{label} Price</label>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-gray-400 text-sm">$</span>
              <input type="number" value={data.price} step="0.01"
                onChange={e => updateSize(size, 'price', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
            </div>
            <div className="flex gap-1 mt-1">
              <div className="flex-1">
                <label className="text-[9px] text-gray-400">Serves min</label>
                <input type="number" value={data.servesMin}
                  onChange={e => updateSize(size, 'servesMin', parseInt(e.target.value) || 0)}
                  className="w-full px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
              <div className="flex-1">
                <label className="text-[9px] text-gray-400">Serves max</label>
                <input type="number" value={data.servesMax}
                  onChange={e => updateSize(size, 'servesMax', parseInt(e.target.value) || 0)}
                  className="w-full px-1.5 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-400" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  if (pricing.type === 'per-each') {
    return (
      <div>
        <label className="text-[10px] text-gray-400 font-medium">Price Each</label>
        <div className="flex items-center gap-1 mt-0.5">
          <span className="text-gray-400 text-sm">$</span>
          <input type="number" value={pricing.priceEach} step="0.01"
            onChange={e => onChange({ ...pricing, priceEach: parseFloat(e.target.value) || 0 })}
            className="w-32 px-2 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
        </div>
      </div>
    );
  }
  return <p className="text-xs text-gray-400">Pricing type: {pricing.type}</p>;
}

// ── Add Item Types ───────────────────────────────────────────────────────────

type AddItemGroup = 'catering' | 'dine-in';
type AddItemPricingType = 'pan' | 'per-each';

interface AddItemForm {
  group: AddItemGroup;
  // Catering fields
  title: string;
  description: string;
  image: string;
  category: EventType;
  pricingType: AddItemPricingType;
  halfPrice: string;
  fullPrice: string;
  halfServesMin: string;
  halfServesMax: string;
  fullServesMin: string;
  fullServesMax: string;
  priceEach: string;
  // Dine-in fields
  dineInName: string;
  dineInDescription: string;
  dineInPrice: string;
  dineInSection: string;
}

function emptyAddForm(): AddItemForm {
  return {
    group: 'catering',
    title: '', description: '', image: '', category: 'entrees',
    pricingType: 'pan',
    halfPrice: '', fullPrice: '',
    halfServesMin: '10', halfServesMax: '15', fullServesMin: '20', fullServesMax: '30',
    priceEach: '',
    dineInName: '', dineInDescription: '', dineInPrice: '', dineInSection: 'appetizers',
  };
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function MenuManagement() {
  const [tab, setTab] = useState<MenuTab>('catering');
  const [cateringEdits, setCateringEdits] = useState<Record<string, CateringEdits>>(buildCateringEdits);
  const [dineInEdits, setDineInEdits] = useState<DineInSectionEdits[]>(buildDineInEdits);
  const [filterCategory, setFilterCategory] = useState<EventType | 'all'>('all');
  const [filterClass, setFilterClass] = useState<MenuClassification | 'all'>('all');
  const [search, setSearch] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedDineInSection, setExpandedDineInSection] = useState<string | null>(null);
  const [expandedDineInItem, setExpandedDineInItem] = useState<string | null>(null);

  // Add item state
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<AddItemForm>(emptyAddForm);
  const [addingState, setAddingState] = useState<'idle' | 'adding' | 'added' | 'error'>('idle');
  const [addError, setAddError] = useState('');

  // ── Catering state ──

  const filteredProducts = useMemo(() => {
    let products = CATERING_PRODUCTS;
    if (filterCategory !== 'all') products = products.filter(p => p.categories.includes(filterCategory));
    if (filterClass !== 'all') products = products.filter(p => (cateringEdits[p.id]?.menuEngineering.classification ?? 'PLOWHORSE') === filterClass);
    if (search.trim()) {
      const q = search.toLowerCase();
      products = products.filter(p => cateringEdits[p.id]?.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
    }
    return products;
  }, [filterCategory, filterClass, search, cateringEdits]);

  const counts = useMemo(() => {
    const c: Record<MenuClassification, number> = { STAR: 0, PUZZLE: 0, PLOWHORSE: 0, DOG: 0 };
    for (const id in cateringEdits) c[cateringEdits[id].menuEngineering.classification]++;
    return c;
  }, [cateringEdits]);

  function updateCatering(id: string, patch: Partial<CateringEdits>) {
    setCateringEdits(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }
  function updateEngineering(id: string, patch: Partial<MenuEngineeringData>) {
    setCateringEdits(prev => ({
      ...prev,
      [id]: { ...prev[id], menuEngineering: { ...prev[id].menuEngineering, ...patch } },
    }));
  }

  // ── Dine-in state ──

  const filteredDineInSections = useMemo(() => {
    if (!search.trim()) return dineInEdits;
    const q = search.toLowerCase();
    return dineInEdits.map(s => ({
      ...s,
      items: s.items.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)),
    })).filter(s => s.items.length > 0 || s.title.toLowerCase().includes(q));
  }, [dineInEdits, search]);

  function updateDineInItem(sectionId: string, itemIdx: number, patch: Partial<DineInItemEdits>) {
    setDineInEdits(prev => prev.map(s => {
      if (s.id !== sectionId) return s;
      const items = [...s.items];
      items[itemIdx] = { ...items[itemIdx], ...patch };
      return { ...s, items };
    }));
  }

  // ── Save ──

  async function saveAll() {
    setSaveState('saving');
    try {
      if (tab === 'catering') {
        const res = await fetch('/api/admin/update-menu-engineering', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cateringEdits),
        });
        const data = await res.json();
        setSaveState(data.success ? 'saved' : 'error');
      } else {
        // Convert edits back to API format
        const payload = dineInEdits.map(s => ({
          id: s.id, title: s.title, subtitle: s.subtitle || undefined, image: s.image || undefined,
          items: s.items.map(i => ({
            name: i.name,
            description: i.description || undefined,
            price: i.price || undefined,
            classification: i.classification || undefined,
            visualWeight: i.visualWeight || undefined,
            image: i.image || undefined,
          })),
        }));
        const res = await fetch('/api/admin/update-dine-in-menu', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setSaveState(data.success ? 'saved' : 'error');
      }
      setTimeout(() => setSaveState('idle'), 2500);
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  }

  // ── Add new item ──

  async function addNewItem() {
    setAddingState('adding');
    setAddError('');
    try {
      if (addForm.group === 'catering') {
        const id = slugify(addForm.title);
        if (!addForm.title.trim()) { setAddError('Title is required'); setAddingState('idle'); return; }
        const payload = {
          id,
          title: addForm.title.trim(),
          description: addForm.description.trim(),
          image: addForm.image.trim() || '/images/menu/placeholder.jpg',
          categories: [addForm.category],
          pricingType: addForm.pricingType,
          ...(addForm.pricingType === 'pan' ? {
            halfPrice: parseFloat(addForm.halfPrice) || 0,
            fullPrice: parseFloat(addForm.fullPrice) || 0,
            halfServesMin: parseInt(addForm.halfServesMin) || 10,
            halfServesMax: parseInt(addForm.halfServesMax) || 15,
            fullServesMin: parseInt(addForm.fullServesMin) || 20,
            fullServesMax: parseInt(addForm.fullServesMax) || 30,
          } : {
            priceEach: parseFloat(addForm.priceEach) || 0,
          }),
        };
        const res = await fetch('/api/admin/add-catering-product', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!data.success) { setAddError(data.error || 'Failed to add'); setAddingState('error'); setTimeout(() => setAddingState('idle'), 3000); return; }
        // Add to local state
        const newPricing: ProductPricing = addForm.pricingType === 'pan'
          ? { type: 'pan', sizes: [
              { size: 'half', price: parseFloat(addForm.halfPrice) || 0, servesMin: parseInt(addForm.halfServesMin) || 10, servesMax: parseInt(addForm.halfServesMax) || 15 },
              { size: 'full', price: parseFloat(addForm.fullPrice) || 0, servesMin: parseInt(addForm.fullServesMin) || 20, servesMax: parseInt(addForm.fullServesMax) || 30 },
            ]}
          : { type: 'per-each', priceEach: parseFloat(addForm.priceEach) || 0 };
        setCateringEdits(prev => ({
          ...prev,
          [id]: {
            title: payload.title,
            description: payload.description,
            image: payload.image,
            pricing: newPricing,
            menuEngineering: defaultEngineering(),
          },
        }));
      } else {
        // Dine-in: add item to the selected section in local state
        if (!addForm.dineInName.trim()) { setAddError('Name is required'); setAddingState('idle'); return; }
        setDineInEdits(prev => prev.map(s => {
          if (s.id !== addForm.dineInSection) return s;
          return {
            ...s,
            items: [...s.items, {
              name: addForm.dineInName.trim(),
              description: addForm.dineInDescription.trim(),
              price: addForm.dineInPrice.trim(),
              classification: '' as MenuClassification | '',
              visualWeight: '' as VisualWeight | '',
              image: '',
            }],
          };
        }));
      }

      setAddingState('added');
      setTimeout(() => {
        setShowAddForm(false);
        setAddForm(emptyAddForm());
        setAddingState('idle');
      }, 1500);
    } catch {
      setAddError('Something went wrong');
      setAddingState('error');
      setTimeout(() => setAddingState('idle'), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* ─── Header ─── */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Menu Management</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {tab === 'catering' ? `${filteredProducts.length} of ${CATERING_PRODUCTS.length} catering items` : `${dineInEdits.reduce((n, s) => n + s.items.length, 0)} dine-in items across ${dineInEdits.length} sections`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setShowAddForm(!showAddForm); setAddForm(emptyAddForm()); setAddError(''); }}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  showAddForm
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 shadow-lg shadow-emerald-200'
                }`}>
                {showAddForm ? 'Cancel' : '+ Add New Item'}
              </button>
              <button onClick={saveAll} disabled={saveState === 'saving'}
                className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                  saveState === 'saved' ? 'bg-green-500 text-white scale-105'
                  : saveState === 'error' ? 'bg-red-500 text-white'
                  : saveState === 'saving' ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200'
                }`}>
                {saveState === 'saving' ? 'Saving...' : saveState === 'saved' ? 'Saved!' : saveState === 'error' ? 'Failed' : 'Save All Changes'}
              </button>
            </div>
          </div>

          {/* Menu type tabs */}
          <div className="flex gap-1 mb-3">
            {([['catering', 'Catering Menu'], ['dine-in', 'Dine-In Menu']] as const).map(([key, label]) => (
              <button key={key} onClick={() => { setTab(key); setSearch(''); setExpandedId(null); setExpandedDineInSection(null); setExpandedDineInItem(null); }}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  tab === key ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200'
                }`}>
                {label}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            {tab === 'catering' && (
              <>
                <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                  {(['all', ...CATEGORIES] as const).map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        filterCategory === cat ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}>
                      {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
                  {(['all', ...CLASSIFICATIONS] as const).map(cls => (
                    <button key={cls} onClick={() => setFilterClass(cls)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        filterClass === cls ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'
                      }`}>
                      {cls === 'all' ? 'All Types' : `${ICON[cls]} ${cls}`}
                    </button>
                  ))}
                </div>
              </>
            )}
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 w-44 bg-white" />
          </div>
        </div>
      </div>

      {/* ─── ADD NEW ITEM FORM ─── */}
      {showAddForm && (
        <div className="max-w-6xl mx-auto px-4 pt-4">
          <div className="bg-white rounded-xl shadow-md border-2 border-emerald-200 overflow-hidden">
            <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-200">
              <h3 className="font-bold text-sm text-emerald-900">Add New Menu Item</h3>
            </div>
            <div className="px-5 py-4 space-y-4">
              {/* Group selector */}
              <div>
                <SectionLabel>Assign to Menu</SectionLabel>
                <div className="flex gap-2">
                  {([['catering', 'Catering Menu'], ['dine-in', 'Dine-In Menu']] as const).map(([key, label]) => (
                    <button key={key}
                      onClick={() => setAddForm(prev => ({ ...prev, group: key }))}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                        addForm.group === key
                          ? 'bg-gray-900 text-white border-gray-900'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                      }`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catering form */}
              {addForm.group === 'catering' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-3">
                    <div>
                      <SectionLabel>Title</SectionLabel>
                      <input type="text" value={addForm.title} placeholder="e.g. Chicken Enchiladas"
                        onChange={e => setAddForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                    </div>
                    <div>
                      <SectionLabel>Category</SectionLabel>
                      <select value={addForm.category}
                        onChange={e => setAddForm(prev => ({ ...prev, category: e.target.value as EventType }))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white">
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Description</SectionLabel>
                    <textarea value={addForm.description} rows={2} placeholder="Describe the item..."
                      onChange={e => setAddForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-y" />
                  </div>
                  <div>
                    <SectionLabel>Image</SectionLabel>
                    <ImageUploader currentImage={addForm.image}
                      onImageChange={path => setAddForm(prev => ({ ...prev, image: path }))} />
                  </div>
                  <div>
                    <SectionLabel>Pricing Type</SectionLabel>
                    <div className="flex gap-2 mb-3">
                      {([['pan', 'Half / Full Pan'], ['per-each', 'Per Each']] as const).map(([key, label]) => (
                        <button key={key}
                          onClick={() => setAddForm(prev => ({ ...prev, pricingType: key }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                            addForm.pricingType === key
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                          }`}>
                          {label}
                        </button>
                      ))}
                    </div>
                    {addForm.pricingType === 'pan' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-gray-400 font-medium">Half Pan Price</label>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-gray-400 text-sm">$</span>
                            <input type="number" value={addForm.halfPrice} step="0.01" placeholder="0.00"
                              onChange={e => setAddForm(prev => ({ ...prev, halfPrice: e.target.value }))}
                              className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 font-medium">Full Pan Price</label>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-gray-400 text-sm">$</span>
                            <input type="number" value={addForm.fullPrice} step="0.01" placeholder="0.00"
                              onChange={e => setAddForm(prev => ({ ...prev, fullPrice: e.target.value }))}
                              className="w-full px-2 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="text-[10px] text-gray-400 font-medium">Price Each</label>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className="text-gray-400 text-sm">$</span>
                          <input type="number" value={addForm.priceEach} step="0.01" placeholder="0.00"
                            onChange={e => setAddForm(prev => ({ ...prev, priceEach: e.target.value }))}
                            className="w-32 px-2 py-1.5 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Dine-in form */}
              {addForm.group === 'dine-in' && (
                <div className="space-y-4">
                  <div>
                    <SectionLabel>Section</SectionLabel>
                    <select value={addForm.dineInSection}
                      onChange={e => setAddForm(prev => ({ ...prev, dineInSection: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent bg-white">
                      {dineInEdits.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                    <div>
                      <SectionLabel>Name</SectionLabel>
                      <input type="text" value={addForm.dineInName} placeholder="e.g. Chicken Enchilada"
                        onChange={e => setAddForm(prev => ({ ...prev, dineInName: e.target.value }))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                    </div>
                    <div>
                      <SectionLabel>Price</SectionLabel>
                      <input type="text" value={addForm.dineInPrice} placeholder="e.g. 14"
                        onChange={e => setAddForm(prev => ({ ...prev, dineInPrice: e.target.value }))}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent" />
                    </div>
                  </div>
                  <div>
                    <SectionLabel>Description</SectionLabel>
                    <textarea value={addForm.dineInDescription} rows={2} placeholder="Optional description..."
                      onChange={e => setAddForm(prev => ({ ...prev, dineInDescription: e.target.value }))}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-y" />
                  </div>
                </div>
              )}

              {/* Error */}
              {addError && (
                <p className="text-sm text-red-600 font-medium">{addError}</p>
              )}

              {/* Submit */}
              <div className="flex items-center gap-3 pt-2">
                <button onClick={addNewItem} disabled={addingState === 'adding'}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all ${
                    addingState === 'added' ? 'bg-green-500 text-white'
                    : addingState === 'error' ? 'bg-red-500 text-white'
                    : addingState === 'adding' ? 'bg-gray-400 text-white cursor-wait'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95'
                  }`}>
                  {addingState === 'adding' ? 'Adding...'
                    : addingState === 'added' ? 'Added!'
                    : addingState === 'error' ? 'Failed'
                    : addForm.group === 'catering' ? 'Add to Catering Menu' : 'Add to Dine-In Menu'}
                </button>
                {addForm.group === 'dine-in' && (
                  <p className="text-[11px] text-gray-400">Dine-in items are added locally. Click &ldquo;Save All Changes&rdquo; to write to file.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── CATERING TAB ─── */}
      {tab === 'catering' && (
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-2">
          {filteredProducts.map(product => {
            const e = cateringEdits[product.id];
            if (!e) return null;
            const eng = e.menuEngineering;
            const preview = { ...product, title: e.title, description: e.description, image: e.image, pricing: e.pricing, menuEngineering: eng };
            const cardSize = getCardSize(preview);
            const showBadge = shouldShowBadge(preview);
            const badgeText = getBadgeText(preview);
            const isExpanded = expandedId === product.id;
            const style = CLS[eng.classification];

            return (
              <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50/80 transition-colors border-l-4 ${style.border}`}
                  onClick={() => setExpandedId(isExpanded ? null : product.id)}>
                  <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                    <Image src={e.image} alt={e.title} fill className="object-cover" sizes="44px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-gray-900 truncate">{e.title}</h3>
                    <p className="text-[11px] text-gray-400">
                      {product.categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' / ')}
                      <span className="mx-1.5 text-gray-300">|</span>
                      <span className="font-semibold text-gray-600">{priceSummary(e.pricing)}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ClassPill classification={eng.classification} />
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 bg-gray-50 px-4 py-5">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6">
                      <div className="space-y-5">
                        {/* Product Info */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Product Info</h4>
                          <div>
                            <SectionLabel>Title</SectionLabel>
                            <input type="text" value={e.title}
                              onChange={ev => updateCatering(product.id, { title: ev.target.value })}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                          </div>
                          <div>
                            <SectionLabel>Description</SectionLabel>
                            <textarea value={e.description} rows={3}
                              onChange={ev => updateCatering(product.id, { description: ev.target.value })}
                              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y" />
                          </div>
                          <div>
                            <SectionLabel>Image</SectionLabel>
                            <ImageUploader currentImage={e.image}
                              onImageChange={path => updateCatering(product.id, { image: path })} />
                          </div>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
                            Pricing <span className="ml-2 text-gray-400 font-normal normal-case">({e.pricing.type})</span>
                          </h4>
                          <PricingEditor pricing={e.pricing} onChange={p => updateCatering(product.id, { pricing: p })} />
                        </div>

                        {/* Menu Engineering */}
                        <div className={`rounded-lg border-2 p-4 space-y-4 ${style.border} ${style.bg}`}>
                          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Menu Engineering</h4>
                          <div>
                            <SectionLabel>Classification</SectionLabel>
                            <div className="flex flex-wrap gap-2">
                              {CLASSIFICATIONS.map(cls => {
                                const cs = CLS[cls]; const active = eng.classification === cls;
                                return (
                                  <button key={cls} onClick={() => updateEngineering(product.id, { classification: cls })}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold border-2 transition-all ${
                                      active ? `${cs.bg} ${cs.text} ${cs.border} shadow-sm` : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
                                    }`}>
                                    <span className={`w-3 h-3 rounded-full ${active ? cs.accent : 'bg-gray-200'}`} />
                                    {ICON[cls]} {cls}
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">{style.hint}</p>
                          </div>
                          <div>
                            <SectionLabel>Visual Weight</SectionLabel>
                            <div className="flex gap-2">
                              {VISUAL_WEIGHTS.map(w => (
                                <button key={w} onClick={() => updateEngineering(product.id, { visualWeight: w })}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                                    eng.visualWeight === w ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                  }`}>{w.charAt(0).toUpperCase() + w.slice(1)}</button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <SectionLabel>Badge Text</SectionLabel>
                            <input type="text" value={eng.badgeText ?? ''}
                              onChange={ev => updateEngineering(product.id, { badgeText: ev.target.value || null })}
                              placeholder="e.g. Crowd Favorite, Chef's Pick"
                              className="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm w-full max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white" />
                            {!showBadge && eng.badgeText && (
                              <p className="text-[10px] text-amber-600 mt-1">Badge only shows for STAR and PUZZLE</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Preview */}
                      <div className="lg:sticky lg:top-32 self-start">
                        <SectionLabel>Card Preview</SectionLabel>
                        <div className={`border-2 rounded-xl overflow-hidden bg-white shadow-sm ${style.border}`}>
                          <div className={`relative ${cardSize === 'hero' ? 'h-32' : cardSize === 'large' ? 'h-24' : cardSize === 'compact' ? 'h-14' : 'h-20'}`}>
                            <Image src={e.image} alt="" fill className="object-cover" sizes="220px" />
                            {showBadge && badgeText && (
                              <div className="absolute top-2 left-2">
                                <Badge variant={eng.classification === 'STAR' ? 'star' : 'puzzle'} className="!text-[10px] !px-2 !py-0.5 shadow-sm">{badgeText}</Badge>
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <p className={`font-semibold leading-tight ${cardSize === 'hero' ? 'text-base' : cardSize === 'compact' ? 'text-[11px]' : 'text-sm'}`}>{e.title}</p>
                            <p className={`text-gray-400 mt-1 leading-snug ${cardSize === 'compact' ? 'text-[9px] line-clamp-1' : 'text-[11px] line-clamp-2'}`}>{e.description}</p>
                            <p className="text-sm font-bold text-gray-900 mt-2">{priceSummary(e.pricing)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredProducts.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No items match.</div>}
        </div>
      )}

      {/* ─── DINE-IN TAB ─── */}
      {tab === 'dine-in' && (
        <div className="max-w-6xl mx-auto px-4 py-4 space-y-3">
          {filteredDineInSections.map(section => {
            const isSectionOpen = expandedDineInSection === section.id;
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Section header */}
                <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-pepe-orange"
                  onClick={() => setExpandedDineInSection(isSectionOpen ? null : section.id)}>
                  {section.image && (
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 relative">
                      <Image src={section.image} alt={section.title} fill className="object-cover" sizes="44px" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-gray-900">{section.title}</h3>
                    <p className="text-[11px] text-gray-400">{section.items.length} items{section.subtitle ? ` \u00b7 ${section.subtitle.slice(0, 60)}...` : ''}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {section.items.some(i => i.classification) && (
                      <div className="flex gap-1">
                        {CLASSIFICATIONS.filter(cls => section.items.some(i => i.classification === cls)).map(cls => (
                          <span key={cls} className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${CLS[cls].bg} ${CLS[cls].text}`}>
                            {ICON[cls]}{section.items.filter(i => i.classification === cls).length}
                          </span>
                        ))}
                      </div>
                    )}
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${isSectionOpen ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Section items */}
                {isSectionOpen && (
                  <div className="border-t border-gray-100">
                    {section.items.map((item, idx) => {
                      const itemKey = `${section.id}-${idx}`;
                      const isItemOpen = expandedDineInItem === itemKey;
                      const itemStyle = item.classification ? CLS[item.classification as MenuClassification] : null;

                      return (
                        <div key={idx} className={`border-b border-gray-100 last:border-b-0 ${isItemOpen ? 'bg-gray-50' : ''}`}>
                          {/* Item row */}
                          <div className={`flex items-center gap-3 px-6 py-2.5 cursor-pointer hover:bg-gray-50 transition-colors ${itemStyle ? `border-l-4 ${itemStyle.border}` : 'border-l-4 border-transparent'}`}
                            onClick={() => setExpandedDineInItem(isItemOpen ? null : itemKey)}>
                            {item.image && (
                              <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 shrink-0 relative">
                                <Image src={item.image} alt="" fill className="object-cover" sizes="32px" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <span className="text-sm font-medium text-gray-900">{item.name}</span>
                              {item.description && <span className="text-[11px] text-gray-400 ml-2 truncate">{item.description.slice(0, 50)}{item.description.length > 50 ? '...' : ''}</span>}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {item.price && <span className="text-sm font-semibold text-gray-700">${item.price}</span>}
                              {item.classification && <ClassPill classification={item.classification as MenuClassification} />}
                              <svg className={`w-3.5 h-3.5 text-gray-300 transition-transform ${isItemOpen ? 'rotate-180' : ''}`}
                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>

                          {/* Item editor */}
                          {isItemOpen && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 space-y-3">
                              <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-3">
                                <div>
                                  <SectionLabel>Name</SectionLabel>
                                  <input type="text" value={item.name}
                                    onChange={ev => updateDineInItem(section.id, idx, { name: ev.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                                </div>
                                <div>
                                  <SectionLabel>Price</SectionLabel>
                                  <input type="text" value={item.price}
                                    onChange={ev => updateDineInItem(section.id, idx, { price: ev.target.value })}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" />
                                </div>
                              </div>
                              <div>
                                <SectionLabel>Description</SectionLabel>
                                <textarea value={item.description} rows={2}
                                  onChange={ev => updateDineInItem(section.id, idx, { description: ev.target.value })}
                                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-y" />
                              </div>
                              <div>
                                <SectionLabel>Image</SectionLabel>
                                <ImageUploader currentImage={item.image}
                                  onImageChange={path => updateDineInItem(section.id, idx, { image: path })} />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                  <SectionLabel>Classification</SectionLabel>
                                  <ClassificationPicker value={item.classification} compact
                                    onChange={v => updateDineInItem(section.id, idx, { classification: v })} />
                                </div>
                                <div>
                                  <SectionLabel>Visual Weight</SectionLabel>
                                  <WeightPicker value={item.visualWeight}
                                    onChange={v => updateDineInItem(section.id, idx, { visualWeight: v })} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          {filteredDineInSections.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No sections match.</div>}
        </div>
      )}

      {/* ─── Bottom Bar ─── */}
      {tab === 'catering' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
          <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex gap-3">
              {CLASSIFICATIONS.map(cls => {
                const s = CLS[cls];
                return (
                  <button key={cls} onClick={() => setFilterClass(filterClass === cls ? 'all' : cls)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      filterClass === cls ? `${s.bg} ${s.text} ${s.border} ring-1 ring-current` : `${s.bg} ${s.text} ${s.border} hover:opacity-80`
                    }`}>
                    {ICON[cls]} <span className="font-bold text-sm">{counts[cls]}</span>
                    <span className="hidden sm:inline">{cls}</span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs text-gray-400">{Object.values(counts).reduce((a, b) => a + b, 0)} items</span>
          </div>
        </div>
      )}
    </div>
  );
}
