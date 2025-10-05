import React, { useState, useEffect } from "react";
import { auth, db, provider } from "./firebase";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    price: "",
    phone: "", // store only digits here (user visible)
  });

  // Listen for auth state (keeps UI in sync after page reloads)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoadingAuth(false);
    });
    return () => unsub();
  }, []);

  // Load books (only when signed in)
  useEffect(() => {
    if (user) loadBooks();
    else setBooks([]); // clear on logout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged handler will set user
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed: " + (err.message || err));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setBooks([]);
    } catch (err) {
      console.error("Sign out error:", err);
      alert("Sign out failed: " + (err.message || err));
    }
  };

  const loadBooks = async () => {
    setLoadingBooks(true);
    try {
      const q = query(collection(db, "books"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("Books loaded:", list);
      setBooks(list);
    } catch (err) {
      console.error("Error loading books:", err);
      alert("Failed to load books. Check console for details.");
    } finally {
      setLoadingBooks(false);
    }
  };

  const addBook = async () => {
    // Basic validation
    if (!form.title || !form.phone) {
      alert("Please enter at least a book title and a phone number.");
      return;
    }

    // Normalize phone: extract digits, take last 10 digits
    const digitsOnly = form.phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      alert("Please enter a valid 10-digit phone number (without +91).");
      return;
    }
    const last10 = digitsOnly.slice(-10);
    const fullPhone = "+91" + last10; // saved format

    const payload = {
      title: form.title,
      subject: form.subject || "",
      semester: form.semester || "",
      price: form.price || "Free",
      phone: fullPhone,
      ownerEmail: user?.email || "",
      ownerName: user?.displayName || "",
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "books"), payload);
      setForm({ title: "", subject: "", semester: "", price: "", phone: "" });
      await loadBooks();
    } catch (err) {
      console.error("Error adding book:", err);
      alert("Failed to add book. Check console for details.");
    }
  };

  // UI
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="loader mb-2" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Not signed in view
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-black-900 mb-4">
            📚 Book Exchange Network
          </h1>
          <p className="text-gray-600 mb-6">
            Sign in with your Google account to start listing and
            browsing books.
          </p>
          <button
            onClick={login}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Sign in with Google
          </button>
          
        </div>
      </div>
    );
  }

  // Signed-in UI
  return (
    <div className="min-h-screen bg-black p-3">
      {/* Header */}
      <header className="flex items-center justify-between max-w-6xl mx-auto mb-6">
        <div>
          <h1  className="text-2xl font-bold text-white mb-1">
            📚 Book Exchange Network
          </h1>
          <p className="text-sm text-gray-400">
            Campus-only listings • Be courteous when contacting owners
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-400">Signed in as</div>
            <div className="text-sm font-medium  text-gray-100 px-2 py-1 rounded">
              {user.displayName || user.email}
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-900"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {/* Add Book Form */}
        <section className="bg-gray-500 shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 ">➕ Add a Book</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border p-2 rounded"
              placeholder="Book Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
            />
            <input
              className="border p-2 rounded"
              placeholder="Price (or Free)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <div className="flex items-center md:col-span-2">
              <span className="bg-gray-200 px-3 py-2 rounded-l text-gray-700">
                +91
              </span>
              <input
                className="border p-2 rounded-r flex-1"
                placeholder="WhatsApp)"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={addBook}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Add Book
            </button>
          </div>
        </section>

        {/* Listings */}
        <section className="mb-12 bg-slate-800 shadow rounded-lg p-2">
          <h2 className="text-xl font-semibold mb-4 text-cyan-200">📖 Available Books</h2>

          {loadingBooks ? (
            <p className="text-gray-600">Loading books...</p>
          ) : books.length === 0 ? (
            <p className="text-gray-600">
              No books available yet — be the first to add one!
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
              {books.map((b) => {
                const displayPhone = b.phone || "Not provided";
                // prepare wa link only when phone exists and looks like +91xxxxxxxxxx
                const waNumber = b.phone ? b.phone.replace(/\D/g, "") : null; // digits only
                const mailTo = `mailto:${encodeURIComponent(
                  b.ownerEmail || ""
                )}?subject=${encodeURIComponent(
                  "Book request: " + (b.title || "")
                )}`;

                return (
                  <div key={b.id} className="bg-gray-600 p-4 rounded shadow-inner shadow-gray-400 border-gray-900 border">
                    <h3 className="font-bold text-lg mb-1">Book: {b.title}</h3>
                    <p className="text-gray-200 text-sm">
                      📘Subject:  {b.subject || "—"}
                    </p>
                    <p className="text-gray-200 text-sm">
                      🎓Semester: {b.semester || "—"}
                    </p>
                    <p className="text-green-500 font-semibold mt-2">
                      💰Price: {b.price || "Free"}
                    </p>

                    <div className="mt-3 text-sm text-gray-200">
                      <p>📞 {displayPhone}</p>
                      <p className="text-gray-200">
                        Owner: {b.ownerName || b.ownerEmail || "—"}
                      </p>
                    </div>

                    <div className="mt-3 flex gap-3">
                      {/* <a href={mailTo} className="text-blue-600 underline">
                        Email
                      </a> */}
                      
                      {waNumber && waNumber.length >= 10 && (
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
