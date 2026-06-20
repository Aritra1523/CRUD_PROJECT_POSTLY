import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="
          w-full
          pl-10
          pr-4
          py-3
          rounded-xl
          border
          border-gray-300
          focus:outline-none
          focus:ring-2
          focus:ring-blue-500
          focus:border-transparent
          bg-white
          shadow-sm
        "
      />
    </div>
  );
};

export default SearchBar;