import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header";
import AddBookForm from "./components/AddBookForm";
import BookList from "./components/BookList";
import GoogleAd from "./components/GoogleAd";
import { fetchBooks, buildAddBookPayload, addBookDoc } from "./services/books";

export default function App() {
  const { user, loadingAuth, login, logout } = useAuth();
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    subject: "",
    semester: "",
    price: "",
    phone: "",
  });

  // Load books (only when signed in)
  useEffect(() => {
    if (user) loadBooks();
    else setBooks([]); // clear on logout
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadBooks = async () => {
    setLoadingBooks(true);
    try {
      const list = await fetchBooks();
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

    let payload;
    try {
      payload = buildAddBookPayload(form, user);
    } catch (e) {
      alert(e.message);
      return;
    }

    try {
      await addBookDoc(payload);
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
            Sign in with your Google account to start listing and browsing
            books.
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
      <Header user={user} onLogout={logout} />

      <main className="max-w-6xl mx-auto">
        <AddBookForm form={form} setForm={setForm} onSubmit={addBook} />

        {/* responsive horizontal ad */}
      <GoogleAd style={{ margin: "1rem 0" }} />

        <BookList books={books} loading={loadingBooks} />
      </main>
    </div>
  );
}
