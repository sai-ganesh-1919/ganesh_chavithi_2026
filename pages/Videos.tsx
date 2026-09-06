import { useState } from "react";
import { useStore } from "../store";
import Modal, { Field, ActionBtn } from "../components/Modal";
import type { Video } from "../types";

const empty = (): Omit<Video, "id"> => ({ title: "", youtubeId: "", description: "" });

export default function Videos() {
  const { videos, isAdmin, addVideo, updateVideo, deleteVideo } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState(empty());
  const [playing, setPlaying] = useState<string | null>(null);

  function openAdd() { setEditing(null); setForm(empty()); setShowModal(true); }
  function openEdit(v: Video) { setEditing(v); setForm({ title: v.title, youtubeId: v.youtubeId, description: v.description }); setShowModal(true); }

  function save() {
    if (!form.title || !form.youtubeId) return;
    const id = extractYoutubeId(form.youtubeId);
    if (editing) updateVideo({ ...form, youtubeId: id, id: editing.id });
    else addVideo({ ...form, youtubeId: id });
    setShowModal(false);
  }

  function extractYoutubeId(input: string) {
    const match = input.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
    return match ? match[1] : input;
  }

  function f(k: keyof typeof form, v: string) { setForm(prev => ({ ...prev, [k]: v })); }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cinzel text-3xl font-bold gold-text">🎥 Videos</h1>
          <p className="text-orange-300/70 mt-1">Festival Recordings & Programs</p>
        </div>
        {isAdmin && (
          <button onClick={openAdd} className="px-5 py-2 rounded-full text-black font-semibold text-sm hover:brightness-110 transition-all" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
            ➕ Add Video
          </button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {videos.map(v => (
          <div key={v.id} className="rounded-2xl border border-orange-900/40 overflow-hidden card-hover" style={{ background: "#1A0400" }}>
            <div className="relative" style={{ paddingBottom: "56.25%" }}>
              {playing === v.id ? (
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1`}
                  title={v.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  className="absolute inset-0 cursor-pointer group"
                  onClick={() => setPlaying(v.id)}
                >
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(13,2,0,0.5)" }}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-transform group-hover:scale-110" style={{ background: "linear-gradient(135deg, #FF6B00, #FFD700)" }}>
                      <svg viewBox="0 0 24 24" fill="black" className="w-7 h-7 ml-1"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-yellow-100 mb-1">{v.title}</h3>
                  {v.description && <p className="text-orange-300/60 text-sm">{v.description}</p>}
                </div>
                {isAdmin && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEdit(v)} className="px-3 py-1 rounded-lg text-xs bg-orange-900/40 text-orange-300 hover:bg-orange-900/70 transition-colors">✏️</button>
                    <button onClick={() => deleteVideo(v.id)} className="px-3 py-1 rounded-lg text-xs bg-red-900/40 text-red-300 hover:bg-red-900/70 transition-colors">🗑️</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {videos.length === 0 && (
        <div className="text-center py-16 text-orange-400/50">No videos added yet</div>
      )}

      {showModal && (
        <Modal title={editing ? "Edit Video" : "Add Video"} onClose={() => setShowModal(false)}>
          <Field label="Title"><input value={form.title} onChange={e => f("title", e.target.value)} placeholder="Video title" /></Field>
          <Field label="YouTube URL or ID"><input value={form.youtubeId} onChange={e => f("youtubeId", e.target.value)} placeholder="https://youtube.com/watch?v=... or video ID" /></Field>
          <Field label="Description"><textarea value={form.description} onChange={e => f("description", e.target.value)} rows={2} placeholder="Optional description..." /></Field>
          <div className="flex gap-3 pt-2">
            <ActionBtn onClick={save} variant="primary">{editing ? "Update" : "Add Video"}</ActionBtn>
            <ActionBtn onClick={() => setShowModal(false)} variant="ghost">Cancel</ActionBtn>
          </div>
        </Modal>
      )}
    </div>
  );
}