import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { GalleryItem } from "../types";

const empty = (): Omit<GalleryItem, "id"> => ({ url: "", category: "Festival", caption: "" });
const CATEGORIES = ["Festival", "Mandapam", "Programs", "Decoration", "Visarjan", "Other"];

export default function Gallery() {
  const { gallery, isAdmin, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState(empty());
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = filter === "All" ? gallery : gallery.filter(g => g.category === filter);

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(g: GalleryItem) { setEditing(g); setForm({ url: g.url, category: g.category, caption: g.caption }); setShowModal(true); }

  function save() {
    if (!form.url) return;
    if (editing) updateGalleryItem({ ...form, id: editing.id });
    else addGalleryItem(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">📸 Gallery</h1>
          <p className="text-orange-300/70 mt-1">Festival Moments & Memories</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Photo
          </button>
        )}
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {["All", ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === cat
                ? "text-black"
                : "text-orange-300 border border-orange-700/40 hover:border-orange-500/60"
            }`}
            style={filter === cat ? { background: "linear-gradient(135deg, #FF6B00, #FFD700)" } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map(g => (
          <div key={g.id} className="relative group rounded-xl overflow-hidden border border-orange-900/30 cursor-pointer" style={{ aspectRatio: "4/3" }}>
            <img
              src={g.url}
              alt={g.caption}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              onClick={() => setLightbox(g.url)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
              <p className="text-white text-xs font-medium">{g.caption}</p>
              <span className="text-orange-300 text-xs">{g.category}</span>
            </div>
            {isAdmin && (
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={e => { e.stopPropagation(); openEdit(g); }} className="w-7 h-7 rounded-full flex items-center justify-center bg-orange-900/80 text-orange-300 text-xs hover:bg-orange-800 transition-colors">✏️</button>
                <button onClick={e => { e.stopPropagation(); deleteGalleryItem(g.id); }} className="w-7 h-7 rounded-full flex items-center justify-center bg-red-900/80 text-red-300 text-xs hover:bg-red-800 transition-colors">🗑️</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-orange-400/50">No photos in this category</div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-full rounded-xl object-contain" style={{ maxHeight: "90vh" }} />
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors">✕</button>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Photo" : "Add Photo"} onClose={() => setShowModal(false)}>
          <Field label="Image URL"><input value={form.url} onChange={e => f("url", e.target.value)} placeholder="https://..." /></Field>
          <Field label="Category">
            <select value={form.category} onChange={e => f("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Caption"><input value={form.caption} onChange={e => f("caption", e.target.value)} placeholder="Brief description..." /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Photo"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}