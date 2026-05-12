"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Image as ImageIcon, BarChart3, LayoutGrid, Loader2 } from "lucide-react";

interface Asset {
  id: number;
  url: string;
  caption: string | null;
  month: number;
  yearId: number;
}

interface GalleryProps {
  yearId?: number;
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Gallery = ({ yearId }: GalleryProps) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"grid" | "chart">("grid");

  useEffect(() => {
    if (!yearId) return;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/year/id/${yearId}/assets`);
        if (!res.ok) throw new Error("Failed to fetch assets");
        const data = await res.json();
        setAssets(data);
      } catch (err) {
        console.error("Error fetching gallery assets:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [yearId]);

  const chartData = useMemo(() => {
    const counts = new Array(12).fill(0);
    assets.forEach((asset) => {
      if (asset.month >= 1 && asset.month <= 12) {
        counts[asset.month - 1]++;
      }
    });
    return counts.map((count, index) => ({
      name: MONTH_NAMES[index],
      count,
    }));
  }, [assets]);

  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
        <p className="text-slate-400 font-medium">Loading gallery...</p>
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <ImageIcon className="h-12 w-12 text-slate-200 mb-4" />
        <p className="text-slate-400 font-medium">No assets found for this year.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-800">Media Gallery</h3>
        </div>
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            onClick={() => setView("grid")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all rounded-md ${
              view === "grid" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Grid
          </button>
          <button
            onClick={() => setView("chart")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all rounded-md ${
              view === "chart" 
                ? "bg-white text-blue-600 shadow-sm" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Activity
          </button>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((asset) => (
            <div key={asset.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-slate-50 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
              <img 
                src={asset.url} 
                alt={asset.caption || "Gallery item"} 
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-1">
                  {MONTH_NAMES[asset.month - 1]}
                </span>
                <p className="text-sm text-white font-medium line-clamp-2">{asset.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[400px] w-full rounded-2xl bg-white p-6 shadow-inner border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={32}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.count > 0 ? '#2563eb' : '#e2e8f0'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
            Media distribution by month
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
