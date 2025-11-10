import { useState } from "react";
import axios from "../utils/axios";
import { useAuth } from "../context/AuthContext";

const UserSearch = ({ onUserSelect }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { token } = useAuth();

  const handleSearch = async () => {
    if (!query.trim()) return;
    try {
      const res = await axios.get(`/users/search?q=${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data || []); // ✅ fixed: it's an array, not an object
    } catch (err) {
      console.error("Search error:", err.response?.data || err.message);
      alert("Search failed");
    }
  };

  return (
    <div className="p-4 w-full max-w-md mx-auto">
      <div className="flex mb-2">
        <input
          type="text"
          placeholder="Search users..."
          className="p-2 rounded-l w-full border text-black"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      <ul className="space-y-2">
        {results.map((user) => (
          <li
            key={user.id}
            className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
            onClick={() => onUserSelect(user)}
          >
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserSearch;
