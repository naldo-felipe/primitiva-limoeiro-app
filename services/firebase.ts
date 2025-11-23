
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Member, Visitor, Event, PrayerRequest } from "../types";

// Coleções
const MEMBERS_COL = "members";
const VISITORS_COL = "visitors";
const EVENTS_COL = "events";
const PRAYER_COL = "prayerRequests";
const SETTINGS_COL = "settings";

// --- LISTENERS (Tempo Real) ---

export const subscribeToMembers = (callback: (data: Member[]) => void) => {
  return onSnapshot(collection(db, MEMBERS_COL), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Member));
    callback(data);
  });
};

export const subscribeToVisitors = (callback: (data: Visitor[]) => void) => {
  return onSnapshot(collection(db, VISITORS_COL), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Visitor));
    callback(data);
  });
};

export const subscribeToEvents = (callback: (data: Event[]) => void) => {
  return onSnapshot(collection(db, EVENTS_COL), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
    callback(data);
  });
};

export const subscribeToPrayerRequests = (callback: (data: PrayerRequest[]) => void) => {
  return onSnapshot(collection(db, PRAYER_COL), (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PrayerRequest));
    callback(data);
  });
};

export const subscribeToProgram = (callback: (content: string) => void) => {
  return onSnapshot(doc(db, SETTINGS_COL, "program"), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().content);
    } else {
      callback("");
    }
  });
};

// --- AÇÕES DE ESCRITA (CRUD) ---

// Members
export const addMember = async (member: Omit<Member, "id">) => {
  await addDoc(collection(db, MEMBERS_COL), member);
};
export const updateMember = async (member: Member) => {
  const { id, ...data } = member;
  await updateDoc(doc(db, MEMBERS_COL, id), data);
};
export const deleteMember = async (id: string) => {
  await deleteDoc(doc(db, MEMBERS_COL, id));
};

// Visitors
export const addVisitor = async (visitor: Omit<Visitor, "id">) => {
  await addDoc(collection(db, VISITORS_COL), visitor);
};
export const updateVisitor = async (visitor: Visitor) => {
  const { id, ...data } = visitor;
  await updateDoc(doc(db, VISITORS_COL, id), data);
};
export const deleteVisitor = async (id: string) => {
  await deleteDoc(doc(db, VISITORS_COL, id));
};

// Events
export const addEvent = async (event: Omit<Event, "id">) => {
  await addDoc(collection(db, EVENTS_COL), event);
};
export const updateEvent = async (event: Event) => {
  const { id, ...data } = event;
  await updateDoc(doc(db, EVENTS_COL, id), data);
};
export const deleteEvent = async (id: string) => {
  await deleteDoc(doc(db, EVENTS_COL, id));
};

// Prayer Requests
export const addPrayerRequest = async (request: Omit<PrayerRequest, "id">) => {
  await addDoc(collection(db, PRAYER_COL), request);
};
export const updatePrayerRequest = async (request: PrayerRequest) => {
  const { id, ...data } = request;
  await updateDoc(doc(db, PRAYER_COL, id), data);
};
export const deletePrayerRequest = async (id: string) => {
  await deleteDoc(doc(db, PRAYER_COL, id));
};

// Program
export const saveProgram = async (content: string) => {
  await setDoc(doc(db, SETTINGS_COL, "program"), { content });
};
