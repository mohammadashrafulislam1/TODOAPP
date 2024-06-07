import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { AuthContext } from "../components/AuthProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles

const Login = () => {
  const { login, googleSuccess, googleFailure } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password, navigate);
      toast.success("Login Successful!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response.data.error || "Login Failed! Please check your details."); // Show error toast
    }
  };


  return (
    <div className="bg-[#09102e] min-h-screen flex items-center justify-center text-white">
      <div className="container mx-auto max-w-md mt-10">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <ToastContainer /> {/* Place ToastContainer here for global toast rendering */}
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
          <div className="mb-4">
            <label className="block mb-1">Password</label>
            <div className="relative flex items- text-white align-middle">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full text-black"
                required
              />
              <span className="absolute right-2 top-3 btn btn-xs">
                {show ? (
                  <div onClick={() => setShow(false)}>hide</div>
                ) : (
                  <div onClick={() => setShow(true)}>show</div>
                )}
              </span>
            </div>
            <span><Link to="/request-password">forgot password</Link></span>
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={(response) => googleSuccess(response, navigate)}
            onError={googleFailure}
            useOneTap
          />
        </div>
        <div className="text-center mt-5 text-xl">
          Don't have an account? <Link to="/signup">Signup</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
