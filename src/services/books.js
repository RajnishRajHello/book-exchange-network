import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export async function fetchBooks() {
  const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export function buildAddBookPayload(form, user) {
  const digitsOnly = (form.phone || "").replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    throw new Error(
      "Please enter a valid 10-digit phone number (without +91)."
    );
  }
  const last10 = digitsOnly.slice(-10);
  const fullPhone = "+91" + last10;

  return {
    title: form.title,
    subject: form.subject || "",
    semester: form.semester || "",
    price: form.price || "Free",
    phone: fullPhone,
    ownerEmail: user?.email || "",
    ownerName: user?.displayName || "",
    createdAt: serverTimestamp(),
  };
}

export async function addBookDoc(payload) {
  await addDoc(collection(db, "books"), payload);
}
