import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaComments, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';
import Avatar from './Avatar';
import SearchUser from './SearchUser';
import EditUser from './EditUser';
import { logout, setSocketConnection } from '../redux/userSlice';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import axios from 'axios';

const Sidebar = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSearch, setOpenSearch] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const socketRef = useRef(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user._id) return;

    socketRef.current = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      dispatch(setSocketConnection(true));
      socketRef.current.emit('getConversations');
    });

    socketRef.current.on('conversations', (data) => {
      setConversations(data);
    });

    socketRef.current.on('connect_error', () => {
      dispatch(setSocketConnection(false));
      toast.error('Connection error. Please try again.');
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [user._id, dispatch]);

  const handleLogout = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/logout`, {
        withCredentials: true,
      });
      dispatch(logout());
      localStorage.removeItem('token');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <div className="w-16 bg-gray-100 flex flex-col justify-between py-4">
        <div className="flex flex-col gap-4 items-center">
          <NavLink
            to="/"
            className={({ isActive }) => `p-3 rounded-lg ${isActive ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          >
            <FaComments size={24} className="text-gray-600" />
          </NavLink>
          <button
            onClick={() => setOpenSearch(true)}
            className="p-3 rounded-lg hover:bg-gray-200"
            aria-label="Search Users"
          >
            <FaUserPlus size={24} className="text-gray-600" />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button onClick={() => setOpenEdit(true)} aria-label="Edit Profile">
            <Avatar width={40} height={40} name={user.name} imageUrl={user.profilePic} userId={user._id} />
          </button>
          <button
            onClick={handleLogout}
            className="p-3 rounded-lg hover:bg-gray-200"
            aria-label="Logout"
          >
            <FaSignOutAlt size={24} className="text-gray-600" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <h2 className="text-xl font-bold p-4 text-gray-800">Messages</h2>
        <div className="h-[calc(100vh-64px)] overflow-y-auto scrollbar">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center mt-12 text-gray-500">
              <p>No conversations yet.</p>
              <p className="text-sm">Start a conversation by searching for users!</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <NavLink
                to={`/${conv.userDetails._id}`}
                key={conv._id}
                className="flex items-center gap-3 p-3 border-b hover:bg-gray-50"
              >
                <Avatar
                  width={40}
                  height={40}
                  name={conv.userDetails.name}
                  imageUrl={conv.userDetails.profilePic}
                  userId={conv.userDetails._id}
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{conv.userDetails.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {conv.lastMessage?.text || (conv.lastMessage?.imageUrl ? 'Image' : 'Video')}
                  </p>
                </div>
                {conv.unseenCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                    {conv.unseenCount}
                  </span>
                )}
              </NavLink>
            ))
          )}
        </div>
      </div>
      {openSearch && <SearchUser onClose={() => setOpenSearch(false)} />}
      {openEdit && <EditUser onClose={() => setOpenEdit(false)} />}
    </div>
  );
};

export default Sidebar;