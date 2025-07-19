import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaPaperclip, FaImage, FaVideo, FaPaperPlane } from 'react-icons/fa';
import Avatar from './Avatar';
import uploadFile from '../helpers/uploadFile';
import Loading from './Loding';
import backgroundImage from '../assets/background.png';
import moment from 'moment';

const MessagePage = () => {
  const { userId } = useParams();
  const socketConnection = useSelector((state) => state.user.socketConnection);
  const user = useSelector((state) => state.user);
  const [message, setMessage] = useState({ text: '', imageUrl: '', videoUrl: '' });
  const [messages, setMessages] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [openUpload, setOpenUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (socketConnection && userId) {
      socketConnection.emit('getMessages', userId);
      socketConnection.emit('markAsSeen', userId);

      socketConnection.on('messages', (data) => {
        setMessages(data);
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });

      socketConnection.on('userDetails', (data) => {
        setUserDetails(data);
      });

      return () => {
        socketConnection.off('messages');
        socketConnection.off('userDetails');
      };
    }
  }, [socketConnection, userId]);

  const handleUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await uploadFile(file);
      setMessage((prev) => ({ ...prev, [`${type}Url`]: data.url }));
    } catch (error) {
      toast.error('Upload failed');
    }
    setLoading(false);
    setOpenUpload(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.text || message.imageUrl || message.videoUrl) {
      socketConnection.emit('sendMessage', {
        sender: user._id,
        receiver: userId,
        text: message.text,
        imageUrl: message.imageUrl,
        videoUrl: message.videoUrl,
      });
      setMessage({ text: '', imageUrl: '', videoUrl: '' });
    }
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}>
      <header className="bg-white shadow h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="lg:hidden">
            <FaArrowLeft size={24} />
          </Link>
          <Avatar width={40} height={40} name={userDetails.name} imageUrl={userDetails.profilePic} userId={userDetails._id} />
          <div>
            <h3 className="font-semibold">{userDetails.name}</h3>
            <p className="text-sm">{userDetails.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
      </header>
      <section className="flex-1 overflow-y-auto scrollbar p-4 bg-gray-100 bg-opacity-50">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`max-w-xs p-2 my-2 rounded-lg ${msg.sender === user._id ? 'ml-auto bg-blue-100' : 'bg-white'}`}
          >
            {msg.imageUrl && <img src={msg.imageUrl} alt="message" className="max-w-full rounded" />}
            {msg.videoUrl && <video src={msg.videoUrl} className="max-w-full rounded" controls />}
            {msg.text && <p>{msg.text}</p>}
            <p className="text-xs text-gray-500">{moment(msg.createdAt).format('h:mm A')}</p>
          </div>
        ))}
        <div ref={messageEndRef} />
        {loading && <Loading />}
      </section>
      {(message.imageUrl || message.videoUrl) && (
        <div className="p-4 bg-white">
          {message.imageUrl && <img src={message.imageUrl} alt="preview" className="max-w-xs rounded" />}
          {message.videoUrl && <video src={message.videoUrl} className="max-w-xs rounded" controls />}
          <button onClick={() => setMessage({ ...message, imageUrl: '', videoUrl: '' })} className="text-red-500">
            <IoClose size={24} />
          </button>
        </div>
      )}
      <footer className="bg-white h-16 flex items-center px-4 gap-2">
        <button onClick={() => setOpenUpload(!openUpload)} className="p-2 hover:bg-gray-200 rounded">
          <FaPaperclip size={20} />
        </button>
        {openUpload && (
          <div className="absolute bottom-16 bg-white shadow rounded p-2">
            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
              <FaImage />
              Image
              <input type="file" accept="image/*" onChange={(e) => handleUpload(e, 'image')} className="hidden" />
            </label>
            <label className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
              <FaVideo />
              Video
              <input type="file" accept="video/*" onChange={(e) => handleUpload(e, 'video')} className="hidden" />
            </label>
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 p-2 outline-none"
            value={message.text}
            onChange={(e) => setMessage({ ...message, text: e.target.value })}
          />
          <button type="submit" className="text-blue-500 hover:text-blue-700">
            <FaPaperPlane size={24} />
          </button>
        </form>
      </footer>
    </div>
  );
};

export default MessagePage;