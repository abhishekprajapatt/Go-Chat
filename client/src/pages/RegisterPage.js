import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios'
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [data,setData] = useState({
    name : "",
    email : "",
    password : "",
    profile_pic : "",
  })
  const [uploadPhoto,setUploadPhoto] = useState("")
  const navigate = useNavigate()

  const handleOnChange = (e)=>{
    const { name, value} = e.target

    setData((preve)=>{
      return{
          ...preve,
          [name] : value
      }
    })
  }

  const handleUploadPhoto = async(e)=>{
    const file = e.target.files[0]

    const uploadPhoto = await uploadFile(file)

    setUploadPhoto(file)

    setData((preve)=>{
      return{
        ...preve,
        profile_pic : uploadPhoto?.url
      }
    })
  }
  const handleClearUploadPhoto = (e)=>{
    e.stopPropagation()
    e.preventDefault()
    setUploadPhoto(null)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    e.stopPropagation()

    const endpoint = '/api/register';
    const URL = `${process.env.REACT_APP_BACKEND_URL}${endpoint}`

    try {
        const response = await axios.post(URL,data)
        console.log("response",response)

        toast.success(response.data.message)

        if(response.data.success){
            setData({
              name : "",
              email : "",
              password : "",
              profile_pic : ""
            })

            navigate('/email')

        }
    } catch (error) {
        toast.error(error?.response?.data?.message)
    }
    console.log('data',data)
  }



  return (
    <div className='mt-5'>
        <div className='bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto'>
          <h3>Welcome to Chat app!</h3>

          <form className='grid gap-4 mt-5' onSubmit={handleSubmit}>
              <div className='flex flex-col gap-1'>
                <label htmlFor='name'>Name :</label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='enter your name' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.name}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='email'>Email :</label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  placeholder='enter your email' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.email}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='password'>Password :</label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  placeholder='enter your password' 
                  className='bg-slate-100 px-2 py-1 focus:outline-primary'
                  value={data.password}
                  onChange={handleOnChange}
                  required
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label htmlFor='profile_pic'>Photo :

                  <div className='h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                      <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1'>
                        {
                          uploadPhoto?.name ? uploadPhoto?.name : "Upload profile photo"
                        }
                      </p>
                      {
                        uploadPhoto?.name && (
                          <button className='text-lg ml-2 hover:text-red-600' onClick={handleClearUploadPhoto}>
                            <IoClose/>
                          </button>
                        )
                      }
                      
                  </div>
                
                </label>
                
                <input
                  type='file'
                  id='profile_pic'
                  name='profile_pic'
                  className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                  onChange={handleUploadPhoto}
                />
              </div>


              <button
               className='bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide'
              >
                Register
              </button>

          </form>

          <p className='my-3 text-center'>Already have account ? <Link to={"/email"} className='hover:text-primary font-semibold'>Login</Link></p>
        </div>
    </div>
  )
}

export default RegisterPage


// import React, { useState, useRef } from 'react';
// import { IoClose } from 'react-icons/io5';
// import { Link, useNavigate } from 'react-router-dom';
// import uploadFile from '../helpers/uploadFile';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const RegisterPage = () => {
//   const [data, setData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     profile_pic: '',
//   });
//   const [uploadPhoto, setUploadPhoto] = useState(null);
//   const fileInputRef = useRef(null); // Ref for file input
//   const navigate = useNavigate();

//   // Basic client-side validation
//   const validateForm = () => {
//     if (!data.name || data.name.length < 2) {
//       toast.error('Name must be at least 2 characters long');
//       return false;
//     }
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(data.email)) {
//       toast.error('Please enter a valid email address');
//       return false;
//     }
//     if (data.password.length < 6) {
//       toast.error('Password must be at least 6 characters long');
//       return false;
//     }
//     return true;
//   };

//   const handleOnChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUploadPhoto = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     try {
//       const uploaded = await uploadFile(file);
//       if (!uploaded?.url) {
//         toast.error('Failed to upload photo');
//         return;
//       }
//       setUploadPhoto(file);
//       setData((prev) => ({
//         ...prev,
//         profile_pic: uploaded.url,
//       }));
//     } catch (error) {
//       toast.error('Error uploading photo');
//       console.error('Upload error:', error);
//     }
//   };

//   const handleClearUploadPhoto = (e) => {
//     e.preventDefault();
//     setUploadPhoto(null);
//     setData((prev) => ({
//       ...prev,
//       profile_pic: '',
//     }));
//     if (fileInputRef.current) {
//       fileInputRef.current.value = ''; // Reset file input
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const endpoint = '/api/register';
//     const URL = `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}${endpoint}`;

//     try {
//       const response = await axios.post(URL, data);
//       toast.success(response.data.message || 'Registration successful!');

//       if (response.data.success) {
//         setData({
//           name: '',
//           email: '',
//           password: '',
//           profile_pic: '',
//         });
//         setUploadPhoto(null);
//         if (fileInputRef.current) {
//           fileInputRef.current.value = '';
//         }
//         navigate('/email');
//       }
//     } catch (error) {
//       const errorMessage = error.response?.data?.message || 'Registration failed';
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="mt-5">
//       <div className="bg-white w-full max-w-md rounded overflow-hidden p-4 mx-auto">
//         <h3 className="text-xl font-semibold text-center">Welcome to Chat App!</h3>

//         <form className="grid gap-4 mt-5" onSubmit={handleSubmit}>
//           <div className="flex flex-col gap-1">
//             <label htmlFor="name">Name:</label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Enter your name"
//               className="bg-slate-100 px-2 py-1 focus:outline-primary"
//               value={data.name}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label htmlFor="email">Email:</label>
//             <input
//               type="email"
//               id="email"
//               name="email"
//               placeholder="Enter your email"
//               className="bg-slate-100 px-2 py-1 focus:outline-primary"
//               value={data.email}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label htmlFor="password">Password:</label>
//             <input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Enter your password"
//               className="bg-slate-100 px-2 py-1 focus:outline-primary"
//               value={data.password}
//               onChange={handleOnChange}
//               required
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label htmlFor="profile_pic">Profile Photo:</label>
//             <div
//               className="h-14 bg-slate-200 flex justify-center items-center border rounded hover:border-primary cursor-pointer"
//               onClick={() => fileInputRef.current?.click()}
//               role="button"
//               tabIndex={0}
//               onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
//             >
//               <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1">
//                 {uploadPhoto?.name || 'Upload profile photo'}
//               </p>
//               {uploadPhoto?.name && (
//                 <button
//                   type="button"
//                   className="text-lg ml-2 hover:text-red-600"
//                   onClick={handleClearUploadPhoto}
//                   aria-label="Clear uploaded photo"
//                 >
//                   <IoClose />
//                 </button>
//               )}
//             </div>
//             <input
//               type="file"
//               id="profile_pic"
//               name="profile_pic"
//               className="hidden"
//               onChange={handleUploadPhoto}
//               ref={fileInputRef}
//               accept="image/*"
//             />
//           </div>

//           <button
//             type="submit"
//             className="bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white"
//           >
//             Register
//           </button>
//         </form>

//         <p className="my-3 text-center">
//           Already have an account?{' '}
//           <Link to="/email" className="hover:text-primary font-semibold">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
