import { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { endPoint } from '../forAll/forAll';
import { FaAngleRight, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserAccount = () => {
  const { user } = useContext(AuthContext);
  const [detailsFormData, setDetailsFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [passwordFormData, setPasswordFormData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setDetailsFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }, [user]);

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDetailsFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${endPoint}/user/update/${user._id}`, detailsFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('User details updated successfully');
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error(error.response.data.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${endPoint}/user/update/${user._id}`, passwordFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    }
  };

  return (
  <div className='min-h-screen bg-[#09102e]'>
   <a href="/"> <div className='flex gap-2 items-center text-white p-5'>
        <FaArrowLeft className='text-white'></FaArrowLeft><span>Home</span>
    </div></a>
    <div className=" flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 shadow-md">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-white">Update Account</h2>
        </div>
        <ToastContainer />
        
        {/* User Details Form */}
        <form className="mt-8 space-y-6 p-8 bg-white rounded-lg" onSubmit={handleDetailsSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={detailsFormData.firstName}
                onChange={handleDetailsChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={detailsFormData.lastName}
                onChange={handleDetailsChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={detailsFormData.email}
                onChange={handleDetailsChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#09102e] hover:bg-[#000620] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#09102e]"
            >
              Update Details
            </button>
          </div>
        </form>

        {/* Password Update Form */}
        <form className="mt-8 space-y-6 p-8 rounded-lg bg-white" onSubmit={handlePasswordSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label className="block text-gray-700">Old Password</label>
              <div className="relative flex items-center">
                <input
                  type={showOldPassword ? 'text' : 'password'}
                  name="oldPassword"
                  value={passwordFormData.oldPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
                <span
                  className="absolute right-2 cursor-pointer"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">New Password</label>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordFormData.newPassword}
                  onChange={handlePasswordChange}
                  className="input input-bordered w-full"
                  required
                />
                <span
                  className="absolute right-2 cursor-pointer"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#09102e] hover:bg-[#000620] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#09102e]"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default UserAccount;
