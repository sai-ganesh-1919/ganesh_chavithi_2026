import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Program } from "../types";

const emptyProgram = (): Omit<Program, "id"> => ({
  name: "", date: "", time: "", venue: "", description: ""
});

export default function Programs() {
  const { programs, isAdmin, addProgram, updateProgram, deleteProgram } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState(emptyProgram());

  const sorted = [...programs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function openAdd() {
    setEditing(null);
    setForm(emptyProgram());
    setShowModal(true);
  }

  function openEdit(p: Program) {
    setEditing(p);
    setForm({ name: p.name, date: p.date, time: p.time, venue: p.venue || "", description: p.description });
    setShowModal(true);
  }

  function save() {
    if (!form.name || !form.date) return;
    if (editing) updateProgram({ ...form, id: editing.id });
    else addProgram(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string) {
    setForm(prev => ({ ...prev, [k]: v }));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">📅 Programs</h1>
          <p className="text-orange-300/70 mt-1">Ganesh Chaturthi 2026 • Complete Schedule</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm transition-all hover:brightness-110" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Program
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sorted.map((p, i) => (
          <div key={p.id} className="rounded-xl border border-orange-900/40 overflow-hidden card-hover" style={{ background: "#1A0400" }}>
            <div className="flex flex-col md:flex-row">
              <div className="flex-shrink-0 flex flex-col items-center justify-center p-4 md:w-24 border-b md:border-b-0 md:border-r border-orange-900/30" style={{ background: "#2A0800" }}>
                <span className="font-cinzel text-2xl font-bold text-orange-400">
                  {new Date(p.date).toLocaleDateString("en-IN", { day: "numeric" })}
                </span>
                <span className="text-orange-300/60 text-xs">
                  {new Date(p.date).toLocaleDateString("en-IN", { month: "short" })}
                </span>
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-cinzel text-yellow-200 font-semibold text-base">{p.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-orange-900/50 text-orange-300">#{i + 1}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-orange-300/80 mb-2">
                      <span>🕐 {p.time}</span>
                      {p.venue && <span>📍 {p.venue}</span>}
                    </div>
                    {p.description && <p className="text-orange-200/60 text-sm leading-relaxed">{p.description}</p>}
                  </div>
                  {isAdmin && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(p)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️ Edit</button>
                      <button onClick={() => deleteProgram(p.id)} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Program" : "Add Program"} onClose={() => setShowModal(false)}>
          <Field label="Program Name"><input value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. Morning Aarti" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date"><input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></Field>
            <Field label="Time"><input value={form.time} onChange={e => f("time", e.target.value)} placeholder="e.g. 06:00 AM" /></Field>
          </div>
          <Field label="Venue (optional)"><input value={form.venue} onChange={e => f("venue", e.target.value)} placeholder="e.g. Local Lake (leave blank if none)" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={e => f("description", e.target.value)} rows={3} placeholder="Program details..." /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Program"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}