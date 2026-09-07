import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import type {
  Program,
  Member,
  Donation,
  Expense,
  GalleryItem,
  Video,
  Announcement,
  Volunteer,
} from "./types";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================================================
   ID
========================================================= */

function genId() {
  return Math.random().toString(36).slice(2, 10);
}

/* =========================================================
   DEFAULT DATA
========================================================= */

const defaultPrograms: Program[] = [
  { id: "program1", name: "Ganesh Pratishtha (Sthapana)", date: "2026-08-22", time: "06:00 AM", description: "Lord Ganesh idol installation with Vedic rituals and Panchanga Shravanam." },
  { id: "program2", name: "Morning Aarti & Abhishekam", date: "2026-08-22", time: "08:00 AM", description: "Daily morning aarti with Panchamrit Abhishekam. Open to all devotees." },
  { id: "program3", name: "Bhajan Sandhya", date: "2026-08-23", time: "06:30 PM", description: "Devotional bhajan program by local artists. Special Ganesh stotras and kirtans." },
  { id: "program4", name: "Cultural Programs - Day 1", date: "2026-08-24", time: "07:00 PM", description: "Classical dance and music performances by students of local cultural institutions." },
  { id: "program5", name: "Annadanam", date: "2026-08-25", time: "12:00 PM", description: "Free Annadanam at the temple premises. Pongal, pulihora, laddu and prasadam will be distributed to all devotees." },
  { id: "program6", name: "Harikatha", date: "2026-08-26", time: "07:00 PM", description: "Harikatha on Ganesh Mahima by Sri Venkata Ramaiah. Traditional storytelling." },
  { id: "program7", name: "Children Cultural Program", date: "2026-08-28", time: "05:00 PM", description: "Drawing, fancy dress, and skit competitions for children under 14." },
  { id: "program8", name: "Youth Talent Show", date: "2026-08-29", time: "07:00 PM", description: "Dance, singing, and drama performances by youth of the colony." },
  { id: "program9", name: "Orchestra", date: "2026-08-30", time: "05:30 PM", description: "Special orchestra and devotional music program by women devotees." },
  { id: "program10", name: "Grand Final Night", date: "2026-08-31", time: "07:00 PM", description: "Grand cultural night with special performances and celebrations." },
  { id: "program11", name: "Visarjan (Nimajjanam) - Grand Ooregimpu", date: "2026-09-01", time: "05:00 PM", venue: "Lakshmipuram Vinayakuni Mandapam", description: "Sri Ganesh Swamy vari grand Visarjan Ooregimpu with Teenmaar dappulu, DJ, fireworks, disco lights and dancers. The procession will take place with devotional songs and celebrations through Lakshmipuram." },
];

/* =========================================================
   DEFAULT MEMBERS
========================================================= */

const defaultMembers: Member[] = [
  { id: "member1", name: "P.Naga Srinu", photo: "https://i.ibb.co/hRJmNWBr/Whats-App-Image-2026-09-06-at-3-06-23-PM-1.jpg", contact: "9848012345" },
  { id: "member2", name: "A.Siddhardha", photo: "https://i.ibb.co/8LdCxpG7/Whats-App-Image-2026-09-06-at-2-40-25-PM.jpg", contact: "9848023456" },
  { id: "member3", name: "P.Sai Ganesh", photo: "https://i.ibb.co/Qv8rvX7g/Whats-App-Image-2026-09-06-at-3-06-17-PM.jpg", contact: "9848034567" },
  { id: "member4", name: "K.Pradeep", photo: "https://i.ibb.co/DP5mD23J/Whats-App-Image-2026-09-06-at-3-06-21-PM.jpg", contact: "9848045678" },
  { id: "member5", name: "P.Suresh", photo: "https://i.ibb.co/9HKbV4BG/Whats-App-Image-2026-09-06-at-3-06-18-PM.jpg", contact: "9848056789" },
  { id: "member6", name: "T.Surendra", photo: "https://i.ibb.co/yctRR6v4/Whats-App-Image-2026-09-06-at-3-06-22-PM.jpg", contact: "9848067890" },
  { id: "member7", name: "P.Sai Ranga", photo: "https://i.ibb.co/tTywD0Rx/Whats-App-Image-2026-09-06-at-3-06-23-PM.jpg", contact: "9848078901" },
  { id: "member8", name: "K.Phani Sai", photo: "https://i.ibb.co/G4yZ6Zsz/Whats-App-Image-2026-09-06-at-3-06-23-PM-2.jpg", contact: "9848089012" },
];

/* =========================================================
   DEFAULT DONATIONS
========================================================= */

const defaultDonations: Donation[] = [
  { id: "donation1", name: "Ravi Kumar Reddy", amount: 5000, date: "2026-08-01" },
  { id: "donation2", name: "Srinivas Rao", amount: 3000, date: "2026-08-02" },
  { id: "donation3", name: "Venkata Naidu", amount: 2500, date: "2026-08-03" },
  { id: "donation4", name: "Suresh Babu", amount: 2000, date: "2026-08-04" },
  { id: "donation5", name: "Ramesh Chandra", amount: 1500, date: "2026-08-05" },
  { id: "donation6", name: "Padma Rao", amount: 1000, date: "2026-08-06" },
  { id: "donation7", name: "Lakshmi Devi", amount: 2000, date: "2026-08-07" },
  { id: "donation8", name: "Anita Sharma", amount: 500, date: "2026-08-08" },
  { id: "donation9", name: "Krishna Murthy", amount: 3000, date: "2026-08-10" },
  { id: "donation10", name: "Vijaya Lakshmi", amount: 1000, date: "2026-08-12" },
];

/* =========================================================
   DEFAULT EXPENSES
========================================================= */

const defaultExpenses: Expense[] = [
  { id: "expense1", name: "Ganesh Idol", amount: 8000, date: "2026-08-15", description: "Lord Ganesh clay idol from Vijayawada artisan" },
  { id: "expense2", name: "Mandapam Decoration", amount: 5000, date: "2026-08-20", description: "Flowers, lights, and fabric decoration for mandapam" },
  { id: "expense3", name: "Sound System", amount: 3000, date: "2026-08-21", description: "PA system and microphones rental for 10 days" },
  { id: "expense4", name: "Prasad Materials", amount: 4000, date: "2026-08-22", description: "Laddu, modak, fruits, and other prasad items" },
  { id: "expense5", name: "Printing & Banners", amount: 1500, date: "2026-08-19", description: "Event banners, flex boards, and invitation printing" },
  { id: "expense6", name: "Cultural Program Expenses", amount: 2000, date: "2026-08-24", description: "Artist fees and stage decoration for cultural programs" },
];

/* =========================================================
   DEFAULT GALLERY
========================================================= */

const defaultGallery: GalleryItem[] = [
  { id: "gallery1", url: "https://images.unsplash.com/photo-1598209437948-3f0ae8a0e45d?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Lord Ganesh beautifully decorated with flowers" },
  { id: "gallery2", url: "https://images.unsplash.com/photo-1504783124764-46ceed8f15be?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Ganesh Chaturthi celebration with devotees" },
  { id: "gallery3", url: "https://images.unsplash.com/photo-1589463349208-95817c91f971?w=600&h=400&fit=crop&auto=format", category: "Decoration", caption: "Traditional festival decorations" },
  { id: "gallery4", url: "https://images.unsplash.com/photo-1642139161235-97e6f02a5bf5?w=600&h=400&fit=crop&auto=format", category: "Festival", caption: "Ganesh idol during Chaturthi" },
  { id: "gallery5", url: "https://images.unsplash.com/photo-1699764681875-dd04ce36b1c3?w=600&h=400&fit=crop&auto=format", category: "Decoration", caption: "Marigold flower offerings" },
  { id: "gallery6", url: "https://images.unsplash.com/photo-1664990106113-5121900ed371?w=600&h=400&fit=crop&auto=format", category: "Programs", caption: "Cultural program at mandapam" },
];

/* =========================================================
   DEFAULT VIDEOS
========================================================= */

const defaultVideos: Video[] = [
  { id: "video1", title: "Ganesh Chaturthi Celebration 2025", youtubeId: "MsHH3PSnfqs", description: "Full festival celebration highlights from last year" },
  { id: "video2", title: "Ganesh Aarti - Traditional", youtubeId: "FGlN_WtJbKk", description: "Morning Ganesh aarti with devotees" },
  { id: "video3", title: "Ganesh Visarjan Procession", youtubeId: "qyR3e9-R1bk", description: "Ganesh nimajjanam procession through colony" },
];

/* =========================================================
   DEFAULT ANNOUNCEMENTS
========================================================= */

const defaultAnnouncements: Announcement[] = [
  { id: "announcement1", title: "Festival Program Schedule Released", content: "The complete program schedule for Lakshmipuram Ganesh Chaturthi 2026 has been released.", date: "2026-08-15", pinned: true },
  { id: "announcement2", title: "Volunteer Registration Open", content: "We need enthusiastic volunteers to help organize the festival.", date: "2026-08-10", pinned: true },
  { id: "announcement3", title: "Chanda Collection Ongoing", content: "Chanda collection is in progress. You can contribute any amount towards our festival.", date: "2026-08-05", pinned: false },
  { id: "announcement4", title: "Parking Advisory", content: "Please use the designated parking area during festival events.", date: "2026-08-18", pinned: false },
];

/* =========================================================
   DEFAULT VOLUNTEERS
========================================================= */

const defaultVolunteers: Volunteer[] = [
  { id: "volunteer1", name: "Mohan Rao", phone: "9848011111", availableTime: "Morning (6AM-12PM)", workInterested: "Prasad Distribution", status: "approved" },
  { id: "volunteer2", name: "Priya Sharma", phone: "9848022222", availableTime: "Evening (4PM-10PM)", workInterested: "Decoration", status: "approved" },
  { id: "volunteer3", name: "Kiran Kumar", phone: "9848033333", availableTime: "Full Day", workInterested: "Crowd Management", status: "pending" },
];

/* =========================================================
   STORE TYPES
========================================================= */

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

/* =========================================================
   CONSTANTS
========================================================= */

const ADMIN_PASSWORD = "Ganesh@2024";

const collectionNames = {
  programs: "programs",
  members: "members",
  donations: "donations",
  expenses: "expenses",
  gallery: "gallery",
  videos: "videos",
  announcements: "announcements",
  volunteers: "volunteers",
};

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState: StoreState = {
  programs: [],
  members: [],
  donations: [],
  expenses: [],
  gallery: [],
  videos: [],
  announcements: [],
  volunteers: [],
  isAdmin: false,
};

/* =========================================================
   CONTEXT
========================================================= */

const StoreContext = createContext<(StoreState & StoreActions) | null>(null);

/* =========================================================
   SEED TRACKING (prevents deleted items from ever reappearing)
========================================================= */

async function hasSeeded(key: string): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "meta", "seedStatus"));
    return snap.exists() && snap.data()?.[key] === true;
  } catch (error) {
    console.error("Error checking seed status:", error);
    return true; // fail safe: don't reseed if we can't check
  }
}

async function markSeeded(key: string) {
  try {
    await setDoc(doc(db, "meta", "seedStatus"), { [key]: true }, { merge: true });
  } catch (error) {
    console.error("Error marking seed status:", error);
  }
}

/* =========================================================
   FIREBASE DEFAULT INITIALIZER (checks seed flag, not emptiness)
========================================================= */

async function initializeCollection<T extends { id: string }>(
  collectionName: string,
  defaults: T[]
) {
  try {
    const alreadySeeded = await hasSeeded(collectionName);
    if (alreadySeeded) return;

    const baseTime = Date.now();
    for (let i = 0; i < defaults.length; i++) {
      const item = defaults[i];
      await setDoc(
        doc(db, collectionName, item.id),
        {
          ...item,
          createdAt: new Date(baseTime + i * 1000), // preserves default order
        } as { [x: string]: any }
      );
    }
    await markSeeded(collectionName);
  } catch (error) {
    console.error(`Error initializing ${collectionName}:`, error);
  }
}

/* =========================================================
   PROVIDER
========================================================= */

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);

  /* =======================================================
     FIRESTORE REAL-TIME SYNC (ordered by createdAt ascending)
  ======================================================= */

  useEffect(() => {
    const unsubscribers = [
      onSnapshot(
        query(collection(db, collectionNames.programs), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Program);
          setState((s) => ({ ...s, programs: data }));
        },
        (error) => console.error("Programs:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.members), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Member);
          setState((s) => ({ ...s, members: data }));
        },
        (error) => console.error("Members:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.donations), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Donation);
          setState((s) => ({ ...s, donations: data }));
        },
        (error) => console.error("Donations:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.expenses), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Expense);
          setState((s) => ({ ...s, expenses: data }));
        },
        (error) => console.error("Expenses:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.gallery), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as GalleryItem);
          setState((s) => ({ ...s, gallery: data }));
        },
        (error) => console.error("Gallery:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.videos), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Video);
          setState((s) => ({ ...s, videos: data }));
        },
        (error) => console.error("Videos:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.announcements), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Announcement);
          setState((s) => ({ ...s, announcements: data }));
        },
        (error) => console.error("Announcements:", error)
      ),

      onSnapshot(
        query(collection(db, collectionNames.volunteers), orderBy("createdAt", "asc")),
        (snapshot) => {
          const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Volunteer);
          setState((s) => ({ ...s, volunteers: data }));
        },
        (error) => console.error("Volunteers:", error)
      ),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  /* =======================================================
     INITIALIZE DEFAULT DATA
  ======================================================= */

  useEffect(() => {
    async function initialize() {
      await initializeCollection("programs", defaultPrograms);
      await initializeCollection("members", defaultMembers);
      await initializeCollection("donations", defaultDonations);
      await initializeCollection("expenses", defaultExpenses);
      await initializeCollection("gallery", defaultGallery);
      await initializeCollection("videos", defaultVideos);
      await initializeCollection("announcements", defaultAnnouncements);
      await initializeCollection("volunteers", defaultVolunteers);
    }

    void initialize();
  }, []);

  /* =======================================================
     LOGIN / LOGOUT
  ======================================================= */

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      setState((s) => ({ ...s, isAdmin: true }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, isAdmin: false }));
  }, []);

  /* =======================================================
     GENERIC ADD (attaches serverTimestamp for ordering)
  ======================================================= */

  const addItem = useCallback(
    async <T extends { id: string }>(collectionName: string, item: Omit<T, "id">) => {
      try {
        const id = genId();
        const newItem = {
          ...item,
          id,
          createdAt: serverTimestamp(),
        } as { [x: string]: any };

        await setDoc(doc(db, collectionName, id), newItem);
      } catch (error) {
        console.error(`Error adding to ${collectionName}:`, error);
      }
    },
    []
  );

  /* =======================================================
     GENERIC UPDATE
  ======================================================= */

  const updateItem = useCallback(
    async <T extends { id: string }>(collectionName: string, item: T) => {
      try {
        await updateDoc(
          doc(db, collectionName, item.id),
          item as { [x: string]: any }
        );
      } catch (error) {
        console.error(`Error updating ${collectionName}:`, error);
      }
    },
    []
  );

  /* =======================================================
     GENERIC DELETE
  ======================================================= */

  const deleteItem = useCallback(async (collectionName: string, id: string) => {
    try {
      await deleteDoc(doc(db, collectionName, id));
    } catch (error) {
      console.error(`Error deleting from ${collectionName}:`, error);
    }
  }, []);

  /* =======================================================
     PROGRAMS
  ======================================================= */

  const addProgram = useCallback((p: Omit<Program, "id">) => { void addItem("programs", p); }, [addItem]);
  const updateProgram = useCallback((p: Program) => { void updateItem("programs", p); }, [updateItem]);
  const deleteProgram = useCallback((id: string) => { void deleteItem("programs", id); }, [deleteItem]);

  /* =======================================================
     MEMBERS
  ======================================================= */

  const addMember = useCallback((m: Omit<Member, "id">) => { void addItem("members", m); }, [addItem]);
  const updateMember = useCallback((m: Member) => { void updateItem("members", m); }, [updateItem]);
  const deleteMember = useCallback((id: string) => { void deleteItem("members", id); }, [deleteItem]);

  /* =======================================================
     DONATIONS
  ======================================================= */

  const addDonation = useCallback((d: Omit<Donation, "id">) => { void addItem("donations", d); }, [addItem]);
  const updateDonation = useCallback((d: Donation) => { void updateItem("donations", d); }, [updateItem]);
  const deleteDonation = useCallback((id: string) => { void deleteItem("donations", id); }, [deleteItem]);

  /* =======================================================
     EXPENSES
  ======================================================= */

  const addExpense = useCallback((e: Omit<Expense, "id">) => { void addItem("expenses", e); }, [addItem]);
  const updateExpense = useCallback((e: Expense) => { void updateItem("expenses", e); }, [updateItem]);
  const deleteExpense = useCallback((id: string) => { void deleteItem("expenses", id); }, [deleteItem]);

  /* =======================================================
     GALLERY
  ======================================================= */

  const addGalleryItem = useCallback((g: Omit<GalleryItem, "id">) => { void addItem("gallery", g); }, [addItem]);
  const updateGalleryItem = useCallback((g: GalleryItem) => { void updateItem("gallery", g); }, [updateItem]);
  const deleteGalleryItem = useCallback((id: string) => { void deleteItem("gallery", id); }, [deleteItem]);

  /* =======================================================
     VIDEOS
  ======================================================= */

  const addVideo = useCallback((v: Omit<Video, "id">) => { void addItem("videos", v); }, [addItem]);
  const updateVideo = useCallback((v: Video) => { void updateItem("videos", v); }, [updateItem]);
  const deleteVideo = useCallback((id: string) => { void deleteItem("videos", id); }, [deleteItem]);

  /* =======================================================
     ANNOUNCEMENTS
  ======================================================= */

  const addAnnouncement = useCallback((a: Omit<Announcement, "id">) => { void addItem("announcements", a); }, [addItem]);
  const updateAnnouncement = useCallback((a: Announcement) => { void updateItem("announcements", a); }, [updateItem]);
  const deleteAnnouncement = useCallback((id: string) => { void deleteItem("announcements", id); }, [deleteItem]);

  /* =======================================================
     VOLUNTEERS
  ======================================================= */

  const addVolunteer = useCallback((v: Omit<Volunteer, "id">) => { void addItem("volunteers", v); }, [addItem]);
  const updateVolunteer = useCallback((v: Volunteer) => { void updateItem("volunteers", v); }, [updateItem]);
  const deleteVolunteer = useCallback((id: string) => { void deleteItem("volunteers", id); }, [deleteItem]);

  /* =======================================================
     STORE VALUE
  ======================================================= */

  const storeValue: StoreState & StoreActions = {
    ...state,
    login,
    logout,
    addProgram, updateProgram, deleteProgram,
    addMember, updateMember, deleteMember,
    addDonation, updateDonation, deleteDonation,
    addExpense, updateExpense, deleteExpense,
    addGalleryItem, updateGalleryItem, deleteGalleryItem,
    addVideo, updateVideo, deleteVideo,
    addAnnouncement, updateAnnouncement, deleteAnnouncement,
    addVolunteer, updateVolunteer, deleteVolunteer,
  };

  return (
    <StoreContext.Provider value={storeValue}>
      {children}
    </StoreContext.Provider>
  );
}

/* =========================================================
   USE STORE
========================================================= */

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
}