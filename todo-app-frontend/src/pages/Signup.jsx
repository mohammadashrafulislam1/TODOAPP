import { useContext, useState } from "react";
import { AuthContext } from "../components/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const { signup, googleSuccess, googleFailure } = useContext(AuthContext);
  const navigate = useNavigate('')
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signup(firstName, lastName, email, password);
      alert("Sign Up Successful!"); // Show success toast
      setFirstName(''); // Clear input fields
      setLastName('');
      setEmail('');
      setPassword('');
      navigate('/')
    } catch (error) {
      // Handle errors appropriately (e.g., display error toast)
      console.error("Signup error:", error);
      toast.error("Sign Up Failed! Please check your details."); // Show error toast
    }
  };

  return (
    <div className="bg-[#09102e] min-h-screen flex items-center justify-center text-white">
      <div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-4">SignUp</h1>
        <ToastContainer /> {/* Place ToastContainer here for global toast rendering */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input input-bordered w-full text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input input-bordered w-full text-black"
              required
            />
          </div>
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
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <div className="relative flex items-center align-middle">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full text-black"
                required
              />
              <span className="absolute right-2 btn btn-xs">
                {show ? (
                  <div onClick={() => setShow(false)}>hide</div>
                ) : (
                  <div onClick={() => setShow(true)}>show</div>
                )}
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            SignUp
          </button>
        </form>
        <div className='text-center mt-5 text-xl'>Already have an account? <Link to='/login'>login</Link></div>
      </div>
    </div>
  );
};

export default Signup;
