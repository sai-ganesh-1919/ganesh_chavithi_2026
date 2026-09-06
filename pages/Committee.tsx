import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Member } from "../types";

const empty = (): Omit<Member, "id"> => ({ name: "", photo: "", contact: "" });

export default function Committee() {
  const { members, isAdmin, addMember, updateMember, deleteMember } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [form, setForm] = useState(empty());

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(m: Member) { setEditing(m); setForm({ name: m.name, photo: m.photo, contact: m.contact }); setShowModal(true); }

  function save() {
    if (!form.name) return;
    if (editing) updateMember({ ...form, id: editing.id });
    else addMember(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">👥 Committee Members</h1>
          <p className="text-orange-300/70 mt-1">Utsav Samiti 2026 • {members.length} Members</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Member
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {members.map(m => (
          <div key={m.id} className="rounded-2xl overflow-hidden border border-orange-900/40 card-hover text-center" style={{ background: "#1A0400" }}>
            <div className="relative">
              <img
                src={m.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format"}
                alt={m.name}
                className="w-full h-36 object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format"; }}
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1A0400 0%, transparent 50%)" }} />
            </div>
            <div className="p-4 pt-2">
              <h3 className="font-semibold text-yellow-100 text-sm leading-tight mb-1">{m.name}</h3>
              {m.contact && (
                <a href={`tel:${m.contact}`} className="text-orange-400 text-xs hover:text-orange-300 transition-colors">
                  📞 {m.contact}
                </a>
              )}
              {isAdmin && (
                <div className="flex gap-2 justify-center mt-3">
                  <button onClick={() => openEdit(m)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️</button>
                  <button onClick={() => deleteMember(m.id)} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Member" : "Add Member"} onClose={() => setShowModal(false)}>
          <Field label="Full Name"><input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Member's full name" /></Field>
          <Field label="Photo URL"><input value={form.photo} onChange={e => f("photo", e.target.value)} placeholder="https://... (optional)" /></Field>
          <Field label="Contact Number"><input value={form.contact} onChange={e => f("contact", e.target.value)} placeholder="9848012345 (optional)" /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Member"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}