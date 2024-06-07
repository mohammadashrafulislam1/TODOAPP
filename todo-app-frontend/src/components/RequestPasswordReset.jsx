import React, { useState } from 'react';
import axios from 'axios';
import { endPoint } from '../forAll/forAll';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PasswordResetRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      const response = await axios.post(`${endPoint}/user/request-password-reset`, { email });
      setMessage("Password reset email sent successfully. (check spam folder)");
      console.log(response.data.message)
      toast.success(response.data.message);
      setLoading(false)
    } catch (error) {
      setMessage('Error sending password reset email. Please try again.');
      toast.error('Error sending password reset email. Please try again.');
      setLoading(false)
    }
  };

  return (
    <div className="bg-[#09102e] min-h-screen flex items-center justify-center text-white">
{loading ? <span className="loading loading-ring w-[80px]"></span>:
<div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-4">Request Password Reset</h1>
        <ToastContainer />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full text-black"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Send Reset Link
          </button>
        </form>
        {message && <p className="mt-4">{message}</p>}
      </div>
}
      
    </div>
  );
};

export default PasswordResetRequest;
