import React, { useContext, useState, useEffect } from 'react';
import { ToastContainer } from "react-toastify";
import { AuthContext } from '../components/AuthProvider';
import Drawer from './Drawer';
import TodoList from './TodoList';
import ToDoDetails from './ToDoDetails';
import { FaBell, FaTimes } from 'react-icons/fa';
import { Route, Routes, useNavigate } from 'react-router-dom';
import AddToDo from './todo/AddToDo';
import axios from 'axios';
import { endPoint } from '../forAll/forAll';

const Main = () => {
  const { user} = useContext(AuthContext);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [todos, setTodos] = useState([]);
  const [completedTodos, setCompletedTodos] = useState([]);
  console.log("geting user", user)

  

  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        try {
          const response = await axios.get(`${endPoint}/todo/${user._id}`);
          setTodos(response.data);
          const completed = response.data.filter(todo => todo.completed);
          setCompletedTodos(completed);
        } catch (error) {
          console.error('Error fetching to-dos:', error);
        }
      };
      fetchTodos();
    }
  }, [user]);

  useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setNotifications(storedNotifications);
  }, []);

  const addNotification = (message) => {
    const newNotifications = [message, ...notifications];
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };

  const deleteNotification = (index) => {
    const newNotifications = notifications.filter((_, i) => i !== index);
    setNotifications(newNotifications);
    localStorage.setItem('notifications', JSON.stringify(newNotifications));
  };
  const updateTodo = (updatedTodo) => {
    // Update the todo in the todos state array
    const updatedTodos = todos.map(todo =>
      todo._id === updatedTodo._id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };
  const updateCompletedTodos = async () => {
    try {
    const response = await axios.get(`${endPoint}/todo/${user._id}`);
    console.log(response)
    const completed = response.data.filter(todo => todo.completed);
    setCompletedTodos(completed);
    } catch (error) {
    console.error('Error updating completed todos:', error);
    }
    };

  const deleteTodo = async (todoId) => {
    console.log(todoId)
    try {
      await axios.delete(`${endPoint}/todo/${todoId}`, {
        data: { userId: user._id },
      });
      const updatedTodos = todos.filter(todo => todo._id !== todoId);
      setTodos(updatedTodos);
      setCompletedTodos(updatedTodos.filter(todo => todo.completed));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  
 
  return (
    <div className="min-h-screen bg-[#09102e] text-white py-8">
      <ToastContainer />
      <header className="mb-4 flex justify-between items-center">
        <h4 className="text-2xl font-bold">Welcome {user?.firstName} {user?.lastName || "user"}</h4>
        <div className="relative">
          <FaBell
            className="text-2xl cursor-pointer"
            onMouseEnter={() => setShowNotifications(true)}
            onClick={() => setShowNotifications(true)}
          />
          {showNotifications && (
            <div
              className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg overflow-hidden z-50 mr-5"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
             <button className='p-3' onClick={() => setShowNotifications(false)}> <FaTimes></FaTimes></button>
              <ul className="p-4 space-y-2 h-[400px] overflow-x-scroll w-fit">
                {notifications.length === 0 ? (
                  <li>No notifications</li>
                ) : (
                  notifications.map((notification, index) => (
                    <li key={index} className="border-b last:border-0 pb-2 flex justify-between items-center bg-[#0000001e] p-3 rounded-md">
                      {notification}
                      <FaTimes
                        className="cursor-pointer text-red-500"
                        onClick={() => deleteNotification(index)}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
      </header>
      <Routes>
        <Route path="/addtodo" element={<AddToDo addNotification={addNotification} />} />
        <Route
          path="/"
          element={
            <div className="grid md:grid-cols-4 lg:grid-cols-12">
              <div className="md:col-span-2 lg:col-span-3 bg-transparent glass px-2 py-5">
                <Drawer completedTodos={completedTodos} />
              </div>
              <div className="lg:col-span-4 md:col-span-2 bg-gray-800 p-4 overflow-y-auto">
                <TodoList
                  setSelectedTodo={setSelectedTodo}
                  addNotification={addNotification}
                  todos={todos}
                  setTodos={setTodos}
                  updateCompletedTodos={updateCompletedTodos}
                  deleteTodo={deleteTodo}
                  updateTodo={updateTodo} 
                />
              </div>
              <div className="lg:col-span-5 bg-gray-900 p-4 md:col-span-4">
                <ToDoDetails todo={selectedTodo} updateCompletedTodos={updateCompletedTodos}  deleteTodo={deleteTodo} addNotification={addNotification} setSelectedTodo={setSelectedTodo} 
                  updateTodo={updateTodo} />
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default Main;
