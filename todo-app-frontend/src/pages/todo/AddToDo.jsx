import React, { useState, useContext } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toast styles
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../components/AuthProvider";
import { endPoint } from "../../forAll/forAll";

const AddToDo = () => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You need to be logged in to add a to-do.");
      return;
    }
    try {
      const response = await axios.post(`${endPoint}/todo/${user._id}`, {
        title,
        description
      });
      toast.success("To-Do added successfully!");
      setTitle('');
      setDescription('');
      const notification = `New To-Do added: ${response.data.title}`;
const currentNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
localStorage.setItem('notifications', JSON.stringify([notification, ...currentNotifications]));

      console.log(response.data);
      navigate('/'); // Navigate back to the main page after adding a to-do
    } catch (error) {
      console.error("There was an error adding the to-do:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-[#09102e] min-h-screen flex items-center justify-center">
      <div className="container mx-auto max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Add To-Do</h1>
        <ToastContainer />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="block text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-[#09102e] text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Add To-Do
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddToDo;
