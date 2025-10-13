import React from "react";

export default function BookCard({ book }) {
  const displayPhone = book.phone || "Not provided";
  const waNumber = book.phone ? book.phone.replace(/\D/g, "") : null;
  const mailTo = `mailto:${encodeURIComponent(
    book.ownerEmail || ""
  )}?subject=${encodeURIComponent("Book request: " + (book.title || ""))}`;

  return (
    <div className="bg-gray-600 p-4 rounded shadow-inner shadow-gray-400 border-gray-900 border">
      <h3 className="font-bold text-lg mb-1">Book: {book.title}</h3>
      <p className="text-gray-200 text-sm">📘Subject: {book.subject || "—"}</p>
      <p className="text-gray-200 text-sm">
        🎓Semester: {book.semester || "—"}
      </p>
      <p className="text-green-500 font-semibold mt-2">
        💰Price: {book.price || "Free"}
      </p>
      <div className="mt-3 text-sm text-gray-200">
        <p>📞 {displayPhone}</p>
        <p className="text-gray-200">
          Owner: {book.ownerName || book.ownerEmail || "—"}
        </p>
      </div>
      <div className="mt-3 flex gap-3">
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
}
