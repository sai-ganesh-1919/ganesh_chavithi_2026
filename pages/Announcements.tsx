import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Announcement } from "../types";

const empty = (): Omit<Announcement, "id"> => ({
  title: "", content: "", date: new Date().toISOString().split("T")[0], pinned: false
});

export default function Announcements() {
  const { announcements, isAdmin, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState(empty());

  const sorted = [...announcements].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(a: Announcement) { setEditing(a); setForm({ title: a.title, content: a.content, date: a.date, pinned: a.pinned }); setShowModal(true); }

  function save() {
    if (!form.title || !form.content) return;
    if (editing) updateAnnouncement({ ...form, id: editing.id });
    else addAnnouncement(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string | boolean) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">📢 Announcements</h1>
          <p className="text-orange-300/70 mt-1">Latest News & Updates</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sorted.map(a => (
          <div
            key={a.id}
            className={`rounded-2xl p-6 border card-hover ${a.pinned ? "border-yellow-600/50" : "border-orange-900/40"}`}
            style={{ background: a.pinned ? "#1F1200" : "#1A0400" }}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl mt-0.5 flex-shrink-0">{a.pinned ? "📌" : "📢"}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className={`font-semibold text-lg leading-tight ${a.pinned ? "text-yellow-300" : "text-yellow-100"}`}>{a.title}</h3>
                  {isAdmin && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateAnnouncement({ ...a, pinned: !a.pinned })}
                        className={`px-2 py-1 rounded-lg text-xs transition-colors ${a.pinned ? "bg-yellow-900/40 text-yellow-400" : "bg-orange-900/40 text-orange-400"} hover:opacity-80`}
                      >
                        {a.pinned ? "📌 Pinned" : "📍 Pin"}
                      </button>
                      <button onClick={() => openEdit(a)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️</button>
                      <button onClick={() => deleteAnnouncement(a.id)} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
                    </div>
                  )}
                </div>
                <p className="text-orange-200/80 text-sm leading-relaxed mb-3">{a.content}</p>
                <p className="text-orange-400/50 text-xs">
                  {new Date(a.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {announcements.length === 0 && (
        <div className="text-center py-16 text-orange-400/50">No announcements yet</div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Announcement" : "New Announcement"} onClose={() => setShowModal(false)}>
          <Field label="Title"><input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Announcement title" /></Field>
          <Field label="Content"><textarea value={form.content} onChange={e => f("content", e.target.value)} rows={4} placeholder="Full announcement text..." /></Field>
          <Field label="Date"><input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={e => f("pinned", e.target.checked)}
              className="w-4 h-4"
              style={{ width: "16px !important", padding: "0 !important" }}
            />
            <span className="text-orange-300 text-sm">📌 Pin this announcement</span>
          </label>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Post"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}