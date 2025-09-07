"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { publishPlan, savePlacement, removePlacement, createPlanIfMissing } from "../server/client";
import { useSearchParams } from "next/navigation";

type Item = { id: string; code: string; widthMm: number; heightMm: number; };
type Placement = { id: string; xMm: number; yMm: number; rotateDeg: number; itemId: string };

const GRID_MM = 10;
const PX_PER_MM = 0.5; // 2mm == 1px

export default function DesignerPage() {
  const params = useSearchParams();
  const planId = params.get("planId") ?? null;
  const [station, setStation] = useState({ widthMm: 900, heightMm: 600 });
  const [items, setItems] = useState<Item[]>([
    { id: "drawer", code: "ATLAS Drawer", widthMm: 405, heightMm: 100 },
    { id: "half", code: "ATLAS Half Insert", widthMm: 205, heightMm: 100 }
  ]);
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    createPlanIfMissing(planId || undefined).then(() => {});
  }, [planId]);

  const onDrop = (e: React.MouseEvent, item: Item) => {
    const rect = (e.target as SVGElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xMm = Math.round((x / PX_PER_MM) / GRID_MM) * GRID_MM;
    const yMm = Math.round((y / PX_PER_MM) / GRID_MM) * GRID_MM;
    const pl = { id: crypto.randomUUID(), xMm, yMm, rotateDeg: 0, itemId: item.id };
    setPlacements(p => [...p, pl]);
    savePlacement(planId || undefined, pl);
  };

  const rotateSelected = () => {
    if (!selected) return;
    setPlacements(p => p.map(pl => pl.id === selected ? { ...pl, rotateDeg: (pl.rotateDeg + 90) % 360 } : pl));
  };

  const deleteSelected = () => {
    if (!selected) return;
    const pl = placements.find(p => p.id === selected);
    setPlacements(p => p.filter(x => x.id !== selected));
    if (pl) removePlacement(planId || undefined, pl.id);
    setSelected(null);
  };

  const publish = async () => {
    await publishPlan(planId || undefined);
    alert("Published! Open the plan and copy the share link.");
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="border rounded p-4 bg-white">
        <h2>Catalog</h2>
        {items.map(i => (
          <button className="btn outline" key={i.id} onClick={(e) => onDrop(e as any, i)} style={{display: 'block', marginBottom: '.5rem'}}>
            Add {i.code}
          </button>
        ))}
        <div style={{marginTop: '1rem'}}>
          <button className="btn" onClick={rotateSelected}>Rotate (R)</button>{' '}
          <button className="btn outline" onClick={deleteSelected}>Delete</button>
        </div>
        <div style={{marginTop: '1rem'}}>
          <button className="btn" onClick={publish}>Publish Plan</button>
        </div>
        <p className="small" style={{marginTop:'.5rem'}}>Click inside the canvas to place components. Click a shape to select.</p>
      </div>
      <div className="border rounded p-4 bg-white">
        <h2>Station — {station.widthMm}×{station.heightMm} mm</h2>
        <svg
          width={station.widthMm * PX_PER_MM}
          height={station.heightMm * PX_PER_MM}
          style={{ border: '1px solid #ddd', background: '#fff' }}
          onClick={(e) => {}}
        >
          {/* Grid */}
          {Array.from({length: Math.floor(station.widthMm / GRID_MM)}).map((_, ix) => (
            <line key={'vx'+ix} x1={ix*GRID_MM*PX_PER_MM} y1={0} x2={ix*GRID_MM*PX_PER_MM} y2={station.heightMm*PX_PER_MM} stroke="#f1f5f9" />
          ))}
          {Array.from({length: Math.floor(station.heightMm / GRID_MM)}).map((_, iy) => (
            <line key={'hz'+iy} x1={0} y1={iy*GRID_MM*PX_PER_MM} x2={station.widthMm*PX_PER_MM} y2={iy*GRID_MM*PX_PER_MM} stroke="#f1f5f9" />
          ))}

          {/* Placements */}
          {placements.map(pl => {
            const item = items.find(i => i.id === pl.itemId)!;
            const w = item.widthMm * PX_PER_MM;
            const h = item.heightMm * PX_PER_MM;
            const cx = pl.xMm * PX_PER_MM;
            const cy = pl.yMm * PX_PER_MM;
            return (
              <g key={pl.id} transform={`translate(${cx},${cy}) rotate(${pl.rotateDeg})`} onClick={(e) => { e.stopPropagation(); setSelected(pl.id); }}>
                <rect width={w} height={h} fill={selected === pl.id ? "#e0f2fe" : "none"} stroke="#0f172a" />
                <text x={4} y={14} fontSize="10">{item.code}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
