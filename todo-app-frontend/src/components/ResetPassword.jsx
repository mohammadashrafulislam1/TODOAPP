import React, { useState } from 'react';
import axios from 'axios';
import { endPoint } from '../forAll/forAll';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const PasswordReset = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${endPoint}/user/reset-password`, { token, newPassword });
      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.message ||'Error resetting password. Please try again.' )
      setMessage(error.response.data.message ||'Error resetting password. Please try again.')
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-md mt-10 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block mb-1">New Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="input input-bordered w-full"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 top-7 flex items-center px-2 text-gray-500 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye></FaEye> : 
              <FaEyeSlash></FaEyeSlash>}
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Reset Password
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
