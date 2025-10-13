import React from "react";

export default function AddBookForm({ form, setForm, onSubmit }) {
  return (
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
            placeholder="WhatsApp"
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
          onClick={onSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add Book
        </button>
      </div>
    </section>
  );
}
