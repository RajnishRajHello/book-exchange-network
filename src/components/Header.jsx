import React from "react";

export default function Header({ user, onLogout }) {
  return (
    <header className="flex items-center justify-between max-w-6xl mx-auto mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          📚 Book Exchange Network
        </h1>
        <p className="text-sm text-gray-400">
          Campus-only listings • Be courteous when contacting owners
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium  text-gray-100 px-2 py-1 rounded">
            {user.displayName || user.email}
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
