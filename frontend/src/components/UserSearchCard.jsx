import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const UserSearchCard = ({ user, onClose }) => {
  return (
    <Link
      to={`/${user._id}`}
      onClick={onClose}
      className="flex items-center gap-3 p-3 hover:bg-gray-100"
    >
      <Avatar width={40} height={40} name={user.name} imageUrl={user.profilePic} userId={user._id} />
      <div>
        <h3 className="font-semibold">{user.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{user.email}</p>
      </div>
    </Link>
  );
};

export default UserSearchCard;