import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Expense } from "../types";

const empty = (): Omit<Expense, "id"> => ({ name: "", amount: 0, date: new Date().toISOString().split("T")[0], description: "" });

export default function Expenses() {
  const { expenses, donations, isAdmin, addExpense, updateExpense, deleteExpense } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form, setForm] = useState(empty());

  const totalChanda = donations.reduce((s, d) => s + d.amount, 0);
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
  const balance = totalChanda - totalExpenses;

  const sorted = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(e: Expense) { setEditing(e); setForm({ name: e.name, amount: e.amount, date: e.date, description: e.description }); setShowModal(true); }

  function save() {
    if (!form.name || !form.amount) return;
    if (editing) updateExpense({ ...form, id: editing.id });
    else addExpense(form);
    setShowModal(false);
  }

  function f(k: keyof typeof form, v: string | number) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">📊 Expenses</h1>
          <p className="text-orange-300/70 mt-1">Festival Budget Tracker 2026</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Expense
          </button>
        )}
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5 border border-green-800/50 text-center" style={{ background: "#0A1A0A" }}>
          <div className="text-2xl mb-1">💰</div>
          <div className="font-cinzel text-2xl font-bold text-green-400">₹{totalChanda.toLocaleString("en-IN")}</div>
          <div className="text-green-400/60 text-xs mt-1">Total Chanda</div>
        </div>
        <div className="rounded-2xl p-5 border border-red-800/50 text-center" style={{ background: "#1A0A0A" }}>
          <div className="text-2xl mb-1">📉</div>
          <div className="font-cinzel text-2xl font-bold text-red-400">₹{totalExpenses.toLocaleString("en-IN")}</div>
          <div className="text-red-400/60 text-xs mt-1">Total Expenses</div>
        </div>
        <div className={`rounded-2xl p-5 border text-center ${balance >= 0 ? "border-yellow-800/50" : "border-red-800/50"}`} style={{ background: balance >= 0 ? "#1A1400" : "#1A0A0A" }}>
          <div className="text-2xl mb-1">{balance >= 0 ? "✅" : "⚠️"}</div>
          <div className={`font-cinzel text-2xl font-bold ${balance >= 0 ? "gold-text" : "text-red-400"}`}>
            ₹{Math.abs(balance).toLocaleString("en-IN")}
          </div>
          <div className="text-orange-400/60 text-xs mt-1">{balance >= 0 ? "Balance Remaining" : "Deficit"}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="rounded-xl p-4 mb-8 border border-orange-900/30" style={{ background: "#1A0400" }}>
        <div className="flex justify-between text-sm text-orange-300/70 mb-2">
          <span>Budget Utilization</span>
          <span>{totalChanda > 0 ? Math.round((totalExpenses / totalChanda) * 100) : 0}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "#2A0800" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, totalChanda > 0 ? (totalExpenses / totalChanda) * 100 : 0)}%`,
              background: totalExpenses > totalChanda ? "#CC2200" : "linear-gradient(90deg, #FF6B00, #FFD700)"
            }}
          />
        </div>
      </div>

      {/* Expenses list */}
      <div className="space-y-3">
        {sorted.map(e => (
          <div key={e.id} className="rounded-xl border border-orange-900/30 p-5 card-hover flex items-start justify-between gap-4" style={{ background: "#1A0400" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-yellow-100">{e.name}</span>
                <span className="text-orange-300/50 text-xs">
                  {new Date(e.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </div>
              {e.description && <p className="text-orange-300/60 text-sm">{e.description}</p>}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="font-bold text-red-400 font-cinzel">₹{e.amount.toLocaleString("en-IN")}</span>
              {isAdmin && (
                <>
                  <button onClick={() => openEdit(e)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️</button>
                  <button onClick={() => deleteExpense(e.id)} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal title={editing ? "Edit Expense" : "Add Expense"} onClose={() => setShowModal(false)}>
          <Field label="Expense Name"><input value={form.name} onChange={e => f("name", e.target.value)} placeholder="e.g. Ganesh Idol" /></Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Amount (₹)"><input type="number" value={form.amount || ""} onChange={e => f("amount", Number(e.target.value))} placeholder="0" /></Field>
            <Field label="Date"><input type="date" value={form.date} onChange={e => f("date", e.target.value)} /></Field>
          </div>
          <Field label="Description"><textarea value={form.description} onChange={e => f("description", e.target.value)} rows={2} placeholder="Optional details..." /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Expense"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}