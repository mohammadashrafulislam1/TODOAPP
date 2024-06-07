import { useState, useEffect, createContext } from 'react';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { endPoint } from '../forAll/forAll';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axios.get(`${endPoint}/user/me`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const login = async (email, password, navigate) => {
    try {
      const response = await axios.post(`${endPoint}/user/login`, { email, password });
      console.log("Login response:", response.data); 
      const { token } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Fetch user data after login
        const userResponse = await axios.get(`${endPoint}/user/me`);
        setUser(userResponse.data);

        navigate('/');
      } else {
        console.error("Login response does not contain expected data:", response.data);
        throw new Error("Invalid login response");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName, lastName, email, password) => {
    const response = await axios.post(`${endPoint}/user/signup`, { firstName, lastName, email, password });
    localStorage.setItem('token', response.data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    setUser(response.data.newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const googleSuccess = async (response, navigate) => {
    try {
      const result = await axios.post(`${endPoint}/user/google`, { tokenId: response.credential });
      const { token, user } = result.data;

      if (token && user) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        navigate('/');
        toast.success("Google Login Successful")
      } else {
        console.error("Google login response does not contain expected data:", result.data);
        throw new Error("Invalid Google login response");
      }
    } catch (error) {
      console.error('Google sign-in was unsuccessful. Try again later.', error);
    }
  };

  const googleFailure = (error) => {
    console.error('Google sign-in was unsuccessful. Try again later.', error);
  };

  const clientId = import.meta.env.VITE_ID; 
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContext.Provider value={{ user, login, signup, logout, loading, googleSuccess, googleFailure }}>
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export { AuthContext, AuthProvider };
