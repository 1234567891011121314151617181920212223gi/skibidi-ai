"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Add your search logic here
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/home" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Skibidi AI
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              href="/create" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Create Character
            </Link>
            <Link 
              href="/api-settings" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              API
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
