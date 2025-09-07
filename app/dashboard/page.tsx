"use client";
import { useEffect, useMemo, useState } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Compartment = {
  id: string; code: string; gridX: number; gridY: number; chilled: boolean;
};
type Plan = {
  id: string; name: string;
};

type Item = {
  id: string;
  label: string;
  refType: "product" | "kit" | "container";
  refId: string;
};

function DraggableItem({ id, label }: { id: string; label: string }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="border rounded-lg px-3 py-2 bg-gray-50 hover:bg-gray-100 cursor-move">
      {label}
    </div>
  );
}

export default function DashboardPage() {
  const [compartments, setCompartments] = useState<Compartment[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [items, setItems] = useState<Item[]>([
    { id: "i1", label: "Water x6", refType: "product", refId: "water" },
    { id: "i2", label: "Snack Kit x4", refType: "kit", refId: "kit1" },
    { id: "i3", label: "Half Cart HC1", refType: "container", refId: "hc1" },
  ]);

  useEffect(() => {
    // Demo compartments (in a real app fetch from API)
    setCompartments([
      { id: "c1", code: "DWR-A", gridX: 3, gridY: 4, chilled: false },
      { id: "c2", code: "CHL-1", gridX: 2, gridY: 2, chilled: true },
    ]);
    setPlan({ id: "demo", name: "Demo A320 FWD Plan" });
  }, []);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const itemIds = useMemo(() => items.map(i => i.id), [items]);

  function onDragEnd(e: DragEndEvent) {
    // This demo does not implement grid snapping; treat list reordering
    const { active, over } = e;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }

  return (
    <main className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold">Plan: {plan?.name}</h2>
        <p className="text-gray-600">Drag items to organize; in a real plan you would drop into specific grid cells per compartment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold mb-2">Items</h3>
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <SortableContext items={itemIds} strategy={rectSortingStrategy}>
              <div className="space-y-2">
                {items.map(i => <DraggableItem key={i.id} id={i.id} label={i.label} />)}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <div className="md:col-span-2 space-y-6">
          {compartments.map(c => (
            <div key={c.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{c.code} {c.chilled ? "(chilled)" : ""}</h3>
                <span className="text-xs text-gray-500">Grid {c.gridX}×{c.gridY}</span>
              </div>
              <div className="grid gap-1"
                   style={{ gridTemplateColumns: `repeat(${c.gridX}, minmax(0, 1fr))` }}>
                {Array.from({ length: c.gridX * c.gridY }).map((_, idx) => (
                  <div key={idx} className="aspect-square border rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                    cell {idx+1}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
