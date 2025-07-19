import { useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
  const onlineUsers = useSelector((state) => state.user.onlineUsers);
  const isOnline = onlineUsers.includes(userId);

  const avatarName = name
    ? name.split(' ').length > 1
      ? `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`
      : name[0]
    : '';

  const bgColors = [
    'bg-blue-200',
    'bg-green-200',
    'bg-red-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-teal-200',
    'bg-pink-200',
    'bg-indigo-200',
    'bg-gray-200',
  ];
  const randomColor = bgColors[Math.floor(Math.random() * bgColors.length)];

  return (
    <div className={`relative rounded-full flex items-center justify-center`} style={{ width, height }}>
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="rounded-full object-cover" style={{ width, height }} />
      ) : name ? (
        <div className={`rounded-full flex items-center justify-center text-lg font-semibold ${randomColor}`} style={{ width, height }}>
          {avatarName}
        </div>
      ) : (
        <FaUserCircle size={width} />
      )}
      {isOnline && <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>}
    </div>
  );
};

export default Avatar;