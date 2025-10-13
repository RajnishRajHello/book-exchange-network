import React from "react";
import BookCard from "./BookCard";

export default function BookList({ books, loading }) {
  return (
    <section className="mb-12 bg-slate-800 shadow rounded-lg p-2">
      <h2 className="text-xl font-semibold mb-4 text-cyan-200">
        📖 Available Books
      </h2>
      {loading ? (
        <p className="text-gray-600">Loading books...</p>
      ) : books.length === 0 ? (
        <p className="text-gray-600">
          No books available yet — be the first to add one!
        </p>
      ) : (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 ">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      )}
    </section>
  );
}
