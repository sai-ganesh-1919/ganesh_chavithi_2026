import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Program, Member, Donation, Expense, GalleryItem, Video, Announcement, Volunteer } from "./types";

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

const defaultPrograms: Program[] = [
  { id: genId(), name: "Ganesh Pratishtha (Sthapana)", date: "2026-08-22", time: "06:00 AM", description: "Lord Ganesh idol installation with Vedic rituals and Panchanga Shravanam." },
  { id: genId(), name: "Morning Aarti & Abhishekam", date: "2026-08-22", time: "08:00 AM", description: "Daily morning aarti with Panchamrit Abhishekam. Open to all devotees." },
  { id: genId(), name: "Bhajan Sandhya", date: "2026-08-23", time: "06:30 PM", description: "Devotional bhajan program by local artists. Special Ganesh stotras and kirtans." },
  { id: genId(), name: "Cultural Programs - Day 1", date: "2026-08-24", time: "07:00 PM", description: "Classical dance and music performances by students of local cultural institutions." },
  { id: genId(), name: "Annadanam", date: "2026-08-25", time: "12:00 PM", description: "Free prasad distribution to all devotees. Pongal, pulihora, and laddu." },
  { id: genId(), name: "Harikatha", date: "2026-08-26", time: "07:00 PM", description: "Harikatha on Ganesh Mahima by Sri Venkata Ramaiah. Traditional storytelling." },
  { id: genId(), name: "Children Cultural Program", date: "2026-08-28", time: "05:00 PM", description: "Drawing, fancy dress, and skit competitions for children under 14." },
  { id: genId(), name: "Youth Talent Show", date: "2026-08-29", time: "07:00 PM", description: "Dance, singing, and drama performances by youth of the colony." },
  { id: genId(), name: "Mahila Sangeetam", date: "2026-08-30", time: "05:30 PM",  description: "Special music program by women devotees. Devotional songs and folk music." },
  { id: genId(), name: "Grand Final Night", date: "2026-08-31", time: "07:00 PM",  description: "Grand cultural night with celebrity performances and special fireworks display." },
  { id: genId(), name: "Visarjan (Nimajjanam)", date: "2026-09-01", time: "05:00 PM", venue: "Local Lake", description: "Ganesh idol immersion procession with dhol, tasha, and devotional singing through colony streets." },
];

const defaultMembers: Member[] = [
  { id: genId(), name: "P.Naga Srinu", photo: "https://i.ibb.co/hRJmNWBr/Whats-App-Image-2026-09-06-at-3-06-23-PM-1.jpg", contact: "9848012345" },
  { id: genId(), name: "A.Siddhardha", photo: "https://i.ibb.co/8LdCxpG7/Whats-App-Image-2026-09-06-at-2-40-25-PM.jpg", contact: "9848023456" },
  { id: genId(), name: "P.Sai Ganesh", photo: "https://i.ibb.co/Qv8rvX7g/Whats-App-Image-2026-09-06-at-3-06-17-PM.jpg", contact: "9848034567" },
  { id: genId(), name: "K.Pradeep", photo: "https://i.ibb.co/DP5mD23J/Whats-App-Image-2026-09-06-at-3-06-21-PM.jpg", contact: "9848045678" },
  { id: genId(), name: "P.Suresh", photo: "https://i.ibb.co/9HKbV4BG/Whats-App-Image-2026-09-06-at-3-06-18-PM.jpg", contact: "9848056789" },
  { id: genId(), name: "T.Surendra", photo: "https://i.ibb.co/yctRR6v4/Whats-App-Image-2026-09-06-at-3-06-22-PM.jpg", contact: "9848067890" },
  { id: genId(), name: "P.Sai Ranga", photo: "https://i.ibb.co/tTywD0Rx/Whats-App-Image-2026-09-06-at-3-06-23-PM.jpg", contact: "9848078901" },
  { id: genId(), name: "K.Phani Sai", photo: "https://i.ibb.co/G4yZ6Zsz/Whats-App-Image-2026-09-06-at-3-06-23-PM-2.jpg", contact: "9848089012" },
];

const defaultDonations: Donation[] = [
  { id: genId(), name: "Ravi Kumar Reddy", amount: 5000, date: "2026-08-01" },
  { id: genId(), name: "Srinivas Rao", amount: 3000, date: "2026-08-02" },
  { id: genId(), name: "Venkata Naidu", amount: 2500, date: "2026-08-03" },
  { id: genId(), name: "Suresh Babu", amount: 2000, date: "2026-08-04" },
  { id: genId(), name: "Ramesh Chandra", amount: 1500, date: "2026-08-05" },
  { id: genId(), name: "Padma Rao", amount: 1000, date: "2026-08-06" },
  { id: genId(), name: "Lakshmi Devi", amount: 2000, date: "2026-08-07" },
  { id: genId(), name: "Anita Sharma", amount: 500, date: "2026-08-08" },
  { id: genId(), name: "Krishna Murthy", amount: 3000, date: "2026-08-10" },
  { id: genId(), name: "Vijaya Lakshmi", amount: 1000, date: "2026-08-12" },
];

const defaultExpenses: Expense[] = [
  { id: genId(), name: "Ganesh Idol", amount: 8000, date: "2026-08-15", description: "Lord Ganesh clay idol from Vijayawada artisan" },
  { id: genId(), name: "Mandapam Decoration", amount: 5000, date: "2026-08-20", description: "Flowers, lights, and fabric decoration for mandapam" },
  { id: genId(), name: "Sound System", amount: 3000, date: "2026-08-21", description: "PA system and microphones rental for 10 days" },
  { id: genId(), name: "Prasad Materials", amount: 4000, date: "2026-08-22", description: "Laddu, modak, fruits, and other prasad items" },
  { id: genId(), name: "Printing & Banners", amount: 1500, date: "2026-08-19", description: "Event banners, flex boards, and invitation printing" },
  { id: genId(), name: "Cultural Program Expenses", amount: 2000, date: "2026-08-24", description: "Artist fees and stage decoration for cultural programs" },
];

const defaultGallery: GalleryItem[] = [
  { id: genId(), url: "https://images.unsplash.com/photo-1598209437948-3f0ae8a0e45d?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Lord Ganesh beautifully decorated with flowers" },
  { id: genId(), url: "https://images.unsplash.com/photo-1504783124764-46ceed8f15be?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Ganesh Chaturthi celebration with devotees" },
  { id: genId(), url: "https://images.unsplash.com/photo-1589463349208-95817c91f971?w=600&h=400&fit=crop&auto=format", category: "Decoration", caption: "Traditional festival decorations" },
  { id: genId(), url: "https://images.unsplash.com/photo-1642139161235-97e6f02a5bf5?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Ganesh idol during Chaturthi" },
  { id: genId(), url: "https://images.unsplash.com/photo-1699764681875-dd04ce36b1c3?w=600&h=400&fit=crop&auto=format", category: "Decoration", caption: "Marigold flower offerings" },
  { id: genId(), url: "https://images.unsplash.com/photo-1664990106113-5121900ed371?w=600&h=400&fit=crop&auto=format", category: "Programs", caption: "Cultural program at mandapam" },
];

const defaultVideos: Video[] = [
  { id: genId(), title: "Ganesh Chaturthi Celebration 2025", youtubeId: "MsHH3PSnfqs", description: "Full festival celebration highlights from last year" },
  { id: genId(), title: "Ganesh Aarti - Traditional", youtubeId: "FGlN_WtJbKk", description: "Morning Ganesh aarti with devotees" },
  { id: genId(), title: "Ganesh Visarjan Procession", youtubeId: "qyR3e9-R1bk", description: "Ganesh nimajjanam procession through colony" },
];

const defaultAnnouncements: Announcement[] = [
  { id: genId(), title: "Festival Program Schedule Released", content: "The complete program schedule for Lakshmipuram Ganesh Chaturthi 2026 has been released. Check the Programs section for full details. All events are at our mandapam unless specified.", date: "2026-08-15", pinned: true },
  { id: genId(), title: "Volunteer Registration Open", content: "We need enthusiastic volunteers to help organize the festival. Please register in the Volunteers section. We need help with prasad distribution, crowd management, decoration, and event coordination.", date: "2026-08-10", pinned: true },
  { id: genId(), title: "Chanda Collection Ongoing", content: "Chanda collection is in progress. You can contribute any amount towards our festival. Contact committee members or visit the mandapam office between 8AM - 8PM daily.", date: "2026-08-05", pinned: false },
  { id: genId(), title: "Parking Advisory", content: "Due to expected large crowds during Visarjan day, please use public transport or park at the designated area near the school ground. Heavy vehicles are not allowed inside colony lanes.", date: "2026-08-18", pinned: false },
];

const defaultVolunteers: Volunteer[] = [
  { id: genId(), name: "Mohan Rao", phone: "9848011111", availableTime: "Morning (6AM-12PM)", workInterested: "Prasad Distribution", status: "approved" },
  { id: genId(), name: "Priya Sharma", phone: "9848022222", availableTime: "Evening (4PM-10PM)", workInterested: "Decoration", status: "approved" },
  { id: genId(), name: "Kiran Kumar", phone: "9848033333", availableTime: "Full Day", workInterested: "Crowd Management", status: "pending" },
];

interface StoreState {
  programs: Program[];
  members: Member[];
  donations: Donation[];
  expenses: Expense[];
  gallery: GalleryItem[];
  videos: Video[];
  announcements: Announcement[];
  volunteers: Volunteer[];
  isAdmin: boolean;
}

interface StoreActions {
  login: (password: string) => boolean;
  logout: () => void;
  addProgram: (p: Omit<Program, "id">) => void;
  updateProgram: (p: Program) => void;
  deleteProgram: (id: string) => void;
  addMember: (m: Omit<Member, "id">) => void;
  updateMember: (m: Member) => void;
  deleteMember: (id: string) => void;
  addDonation: (d: Omit<Donation, "id">) => void;
  updateDonation: (d: Donation) => void;
  deleteDonation: (id: string) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  updateExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;
  addGalleryItem: (g: Omit<GalleryItem, "id">) => void;
  updateGalleryItem: (g: GalleryItem) => void;
  deleteGalleryItem: (id: string) => void;
  addVideo: (v: Omit<Video, "id">) => void;
  updateVideo: (v: Video) => void;
  deleteVideo: (id: string) => void;
  addAnnouncement: (a: Omit<Announcement, "id">) => void;
  updateAnnouncement: (a: Announcement) => void;
  deleteAnnouncement: (id: string) => void;
  addVolunteer: (v: Omit<Volunteer, "id">) => void;
  updateVolunteer: (v: Volunteer) => void;
  deleteVolunteer: (id: string) => void;
}

const STORAGE_KEY = "ganesh_app_data";
const ADMIN_PASSWORD = "Ganesh@2024";

function loadData(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...JSON.parse(raw), isAdmin: false };
    }
  } catch {}
  return {
    programs: defaultPrograms,
    members: defaultMembers,
    donations: defaultDonations,
    expenses: defaultExpenses,
    gallery: defaultGallery,
    videos: defaultVideos,
    announcements: defaultAnnouncements,
    volunteers: defaultVolunteers,
    isAdmin: false,
  };
}

const StoreContext = createContext<(StoreState & StoreActions) | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(loadData);

  useEffect(() => {
    const { isAdmin: _, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setState(s => ({ ...s, isAdmin: true }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState(s => ({ ...s, isAdmin: false }));
  }, []);

  const make = <T extends { id: string }>(key: keyof StoreState) => ({
    add: (item: Omit<T, "id">) => setState(s => ({ ...s, [key]: [...(s[key] as unknown as T[]), { ...item, id: genId() } as T] })),
    update: (item: T) => setState(s => ({ ...s, [key]: (s[key] as unknown as T[]).map((x: T) => x.id === item.id ? item : x) })),
    delete: (id: string) => setState(s => ({ ...s, [key]: (s[key] as unknown as T[]).filter((x: T) => x.id !== id) })),
  });

  const p = make<Program>("programs");
  const m = make<Member>("members");
  const d = make<Donation>("donations");
  const e = make<Expense>("expenses");
  const g = make<GalleryItem>("gallery");
  const v = make<Video>("videos");
  const an = make<Announcement>("announcements");
  const vol = make<Volunteer>("volunteers");

  return (
    <StoreContext.Provider value={{
      ...state,
      login, logout,
      addProgram: p.add, updateProgram: p.update, deleteProgram: p.delete,
      addMember: m.add, updateMember: m.update, deleteMember: m.delete,
      addDonation: d.add, updateDonation: d.update, deleteDonation: d.delete,
      addExpense: e.add, updateExpense: e.update, deleteExpense: e.delete,
      addGalleryItem: g.add, updateGalleryItem: g.update, deleteGalleryItem: g.delete,
      addVideo: v.add, updateVideo: v.update, deleteVideo: v.delete,
      addAnnouncement: an.add, updateAnnouncement: an.update, deleteAnnouncement: an.delete,
      addVolunteer: vol.add, updateVolunteer: vol.update, deleteVolunteer: vol.delete,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
