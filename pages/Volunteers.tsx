import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Volunteer } from "../types";

const empty = (): Omit<Volunteer, "id"> => ({
  name: "", phone: "", availableTime: "", workInterested: "", status: "pending"
});

const TIMES = ["Morning (6AM-12PM)", "Afternoon (12PM-6PM)", "Evening (4PM-10PM)", "Full Day", "Weekends Only"];
const WORK_TYPES = ["Prasad Distribution", "Decoration", "Crowd Management", "Event Coordination", "Photography", "Kitchen/Cooking", "Security", "Other"];

export default function Volunteers() {
  const { volunteers, isAdmin, addVolunteer, updateVolunteer, deleteVolunteer } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Volunteer | null>(null);
  const [form, setForm] = useState(empty());
  const [submitted, setSubmitted] = useState(false);

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(v: Volunteer) { setEditing(v); setForm({ name: v.name, phone: v.phone, availableTime: v.availableTime, workInterested: v.workInterested, status: v.status }); setShowModal(true); }

  function save() {
    if (!form.name || !form.phone) return;
    if (editing) updateVolunteer({ ...form, id: editing.id });
    else {
      addVolunteer(form);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  const approved = volunteers.filter(v => v.status === "approved");
  const pending = volunteers.filter(v => v.status === "pending");

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">🙏 Volunteers</h1>
          <p className="text-orange-300/70 mt-1">Join hands to serve Lord Ganesh</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add
          </button>
        )}
      </div>

      {/* Register CTA for public */}
      {!isAdmin && (
        <div className="rounded-2xl p-6 mb-8 text-center border border-orange-500/40" style={{ background: "linear-gradient(135deg, #1A0400, #2A0800)" }}>
          <div className="text-4xl mb-3">🕉️</div>
          <h2 className="font-cinzel text-xl font-bold gold-text mb-2">Seva is the highest devotion</h2>
          <p className="text-orange-300/80 text-sm mb-5">Register as a volunteer and be part of this divine celebration. Every helping hand makes the festival better.</p>
          <button onClick={() => { setForm(empty()); setShowModal(true); }} className="px-8 py-3 rounded-full text-black font-semibold hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            Register as Volunteer
          </button>
          {submitted && <p className="text-green-400 text-sm mt-3">✅ Thank you! Your registration has been submitted.</p>}
        </div>
      )}

      {/* Volunteer lists */}
      {isAdmin ? (
        <>
          {pending.length > 0 && (
            <div className="mb-8">
              <h2 className="font-semibold text-orange-300 mb-3">⏳ Pending Approval ({pending.length})</h2>
              <div className="space-y-3">
                {pending.map(v => <VolCard key={v.id} v={v} isAdmin={isAdmin} onEdit={openEdit} onDelete={() => deleteVolunteer(v.id)} onApprove={() => updateVolunteer({ ...v, status: "approved" })} />)}
              </div>
            </div>
          )}
          <div>
            <h2 className="font-semibold text-green-400 mb-3">✅ Approved Volunteers ({approved.length})</h2>
            <div className="space-y-3">
              {approved.map(v => <VolCard key={v.id} v={v} isAdmin={isAdmin} onEdit={openEdit} onDelete={() => deleteVolunteer(v.id)} />)}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h2 className="font-semibold text-orange-300 mb-4">Our Volunteers ({approved.length})</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {approved.map(v => (
              <div key={v.id} className="rounded-xl border border-orange-900/30 p-4" style={{ background: "#1A0400" }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: "#2A0800" }}>👤</div>
                  <div>
                    <div className="font-semibold text-yellow-100">{v.name}</div>
                    <div className="text-orange-400 text-xs">{v.workInterested}</div>
                  </div>
                </div>
                <div className="text-orange-300/60 text-xs">⏰ {v.availableTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Volunteer" : "Volunteer Registration"} onClose={() => setShowModal(false)}>
          <Field label="Full Name"><input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Your name" /></Field>
          <Field label="Phone Number"><input value={form.phone} onChange={e => f("phone", e.target.value)} placeholder="10-digit mobile number" /></Field>
          <Field label="Available Time">
            <select value={form.availableTime} onChange={e => f("availableTime", e.target.value)}>
              <option value="">Select time slot...</option>
              {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Work Interested In">
            <select value={form.workInterested} onChange={e => f("workInterested", e.target.value)}>
              <option value="">Select work type...</option>
              {WORK_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </Field>
          {isAdmin && (
            <Field label="Status">
              <select value={form.status} onChange={e => f("status", e.target.value)}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
              </select>
            </Field>
          )}
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Submit Registration"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}

function VolCard({ v, isAdmin, onEdit, onDelete, onApprove }: {
  v: Volunteer;
  isAdmin: boolean;
  onEdit: (v: Volunteer) => void;
  onDelete: () => void;
  onApprove?: () => void;
}) {
  return (
    <div className="rounded-xl border border-orange-900/30 p-4 flex items-center justify-between gap-4" style={{ background: "#1A0400" }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0" style={{ background: "#2A0800" }}>👤</div>
        <div>
          <div className="font-semibold text-yellow-100 text-sm">{v.name}</div>
          <div className="text-orange-300/70 text-xs">📞 {v.phone}</div>
          <div className="text-orange-400/60 text-xs">{v.workInterested} • {v.availableTime}</div>
        </div>
      </div>
      {isAdmin && (
        <div className="flex gap-2 flex-shrink-0">
          {onApprove && <button onClick={onApprove} className="px-3 py-1 rounded-lg text-xs bg-green-900/40 text-green-400 hover:bg-green-900/70 transition-colors">✅ Approve</button>}
          <button onClick={() => onEdit(v)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️</button>
          <button onClick={onDelete} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
        </div>
      )}
    </div>
  );
}