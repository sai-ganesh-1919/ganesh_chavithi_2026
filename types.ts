export interface Program {
  id: string;
  name: string;
  date: string;
  time: string;
  venue?: string;
  description: string;
}

export interface Member {
  id: string;
  name: string;
  photo: string;
  contact: string;
}

export interface Donation {
  id: string;
  name: string;
  amount: number;
  date: string;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: string;
  description: string;
}

export interface GalleryItem {
  id: string;
  url: string;
  category: string;
  caption: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeId: string;
  description: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  availableTime: string;
  workInterested: string;
  status: "pending" | "approved";
}