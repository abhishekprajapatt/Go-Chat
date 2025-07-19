import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser, setSocketConnection, setOnlineUsers, logout } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';
import io from 'socket.io-client';
import Loading from './Loding';

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user`, {
          withCredentials: true,
        });
        dispatch(setUser(response.data.data));
      } catch (error) {
        toast.error('Session expired. Please log in again.');
        dispatch(logout());
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!user._id) return;

    const socket = io(`${import.meta.env.VITE_BACKEND_URL}`, {
      auth: { token: localStorage.getItem('token') },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      dispatch(setSocketConnection(true));
    });

    socket.on('onlineUsers', (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on('connect_error', () => {
      dispatch(setSocketConnection(false));
      toast.error('Connection error. Please try again.');
    });

    return () => {
      socket.disconnect();
    };
  }, [user._id, dispatch]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Home;