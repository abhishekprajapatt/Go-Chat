import { useState, useEffect } from 'react';
import { IoClose, IoSearch } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import UserSearchCard from './UserSearchCard';

const SearchUser = ({ onClose }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (!search) {
        setUsers([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/search`,
          { query: search },
          { withCredentials: true }
        );
        setUsers(response.data.data);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Search failed');
      }
      setLoading(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="flex items-center p-3 border-b">
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="flex-1 outline-none p-2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <IoSearch size={24} className="text-gray-500" />
          <button onClick={onClose} className="ml-2 text-gray-500 hover:text-red-500">
            <IoClose size={24} />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading && <div className="p-4 text-center">Loading...</div>}
          {!loading && users.length === 0 && search && (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
          {users.map((user) => (
            <UserSearchCard key={user._id} user={user} onClose={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchUser;