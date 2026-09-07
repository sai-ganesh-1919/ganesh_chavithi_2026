import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Donation } from "../types";

const empty = (): Omit<Donation, "id"> => ({ name: "", amount: 0, date: "" });

export default function Chanda() {
  const { donations, isAdmin, addDonation, updateDonation, deleteDonation } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Donation | null>(null);
  const [form, setForm] = useState(empty());
  const [search, setSearch] = useState("");

  const total = donations.reduce((s, d) => s + d.amount, 0);
  const filtered = donations
    .filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.amount - a.amount);

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(d: Donation) { setEditing(d); setForm({ name: d.name, amount: d.amount, date: d.date || "" }); setShowModal(true); }

  function save() {
    if (!form.name || !form.amount) return;
    if (editing) updateDonation({ ...form, id: editing.id });
    else addDonation(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string | number) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">💰 Chanda Collections</h1>
          <p className="text-orange-300/70 mt-1">Festival Donations 2026</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Donor
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="rounded-2xl p-6 border border-orange-900/40 text-center" style={{ background: "#1A0400" }}>
          <div className="text-3xl mb-1">🙏</div>
          <div className="font-cinzel text-3xl font-bold gold-text">{donations.length}</div>
          <div className="text-orange-300/70 text-sm mt-1">Total Donors</div>
        </div>
        <div className="rounded-2xl p-6 border border-orange-900/40 text-center" style={{ background: "#1A0400" }}>
          <div className="text-3xl mb-1">💵</div>
          <div className="font-cinzel text-3xl font-bold gold-text">₹{total.toLocaleString("en-IN")}</div>
          <div className="text-orange-300/70 text-sm mt-1">Total Collected</div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search donor name..."
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-orange-900/40 overflow-hidden" style={{ background: "#1A0400" }}>
        <div className="grid grid-cols-12 gap-2 px-5 py-3 text-xs font-semibold text-orange-400 uppercase tracking-wider border-b border-orange-900/30" style={{ background: "#2A0800" }}>
          <div className="col-span-1">#</div>
          <div className="col-span-5">Donor Name</div>
          <div className="col-span-3">Amount</div>
          <div className="col-span-2">Date</div>
          {isAdmin && <div className="col-span-1">Actions</div>}
        </div>
        {filtered.map((d, i) => (
          <div key={d.id} className="grid grid-cols-12 gap-2 px-5 py-3 items-center border-b border-orange-900/20 hover:bg-orange-900/10 transition-colors">
            <div className="col-span-1 text-orange-400/60 text-sm">{i + 1}</div>
            <div className="col-span-5 font-medium text-yellow-100 text-sm">{d.name}</div>
            <div className="col-span-3 font-semibold text-green-400 text-sm">₹{d.amount.toLocaleString("en-IN")}</div>
            <div className="col-span-2 text-orange-300/70 text-sm">
              {d.date ? new Date(d.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
            </div>
            {isAdmin && (
              <div className="col-span-1 flex gap-1">
                <button onClick={() => openEdit(d)} className="p-1 rounded text-orange-400 hover:text-orange-200 transition-colors text-xs">✏️</button>
                <button onClick={() => deleteDonation(d.id)} className="p-1 rounded text-red-400 hover:text-red-200 transition-colors text-xs">🗑️</button>
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-orange-400/50">No donors found</div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Donor" : "Add Donor"} onClose={() => setShowModal(false)}>
          <Field label="Donor Name"><input value={form.name} onChange={e => f("name", e.target.value)} placeholder="Full name" /></Field>
          <Field label="Amount (₹)"><input type="number" value={form.amount || ""} onChange={e => f("amount", Number(e.target.value))} placeholder="Enter amount" /></Field>
          <Field label="Date (optional)"><input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Donor"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}