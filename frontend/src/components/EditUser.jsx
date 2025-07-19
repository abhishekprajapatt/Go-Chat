import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setUser, updateUser } from '../redux/userSlice';
import Avatar from './Avatar';
import { uploadFile } from '../helpers/uploadFile';

const EditUser = ({ onClose }) => {
  const user = useSelector((state) => state.user);
  const [data, setData] = useState({ name: user.name, profilePic: user.profilePic });
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  useEffect(() => {
    setData({ name: user.name, profilePic: user.profilePic });
  }, [user]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadFile(file);
      setData({ ...data, profilePic: uploaded.url });
      toast.success('Profile picture uploaded');
    } catch (error) {
      toast.error('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/update`,
        data,
        { withCredentials: true }
      );
      dispatch(updateUser(response.data.data)); 
      toast.success('Profile updated');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Profile Picture</label>
            <div className="flex items-center gap-4">
              <Avatar width={40} height={40} name={data.name} imageUrl={data.profilePic} />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="text-blue-500 hover:underline"
              >
                Change Photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;