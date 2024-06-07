import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider';
import { endPoint } from '../forAll/forAll';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';

const ToDoDetails = ({ todo, updateCompletedTodos, setSelectedTodo, addNotification, deleteTodo, updateTodo}) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  const handleDelete = async () => {
    try {
      await deleteTodo(todo._id); // Call the deleteTodo function with the todo ID
      // Additional logic if needed
      setIsModalOpen(false);
      toast.success("Deleted successfully.");
      updateCompletedTodos()
      addNotification(`The project: "${todo.title}" is deleted.`);
      setSelectedTodo(null)
    } catch (error) {
      console.error('Error deleting to-do:', error);
      toast.error(error.response.data);
    }
  };

  if (!todo) {
    return <p>Select a to-do to see the details</p>;
  }

  const markAsCompleted = async () => {
    try {
      const response = await axios.put(`${endPoint}/todo/${todo._id}`, {
        userId: user._id,
        completed: true
      });
      toast.success("Marked as completed.");
      setIsModalOpen(false);
      addNotification(`The project: "${todo.title}" is completed.`)
      updateCompletedTodos()
      const updatedTodo = { ...todo, completed: true };
      setSelectedTodo(updatedTodo)
      updateTodo(updatedTodo);
    } catch (error) {
      console.error('Error updating to-do:', error);
      toast.error(error.response.data);
    }
  };
  const openConfirmationModal = (todoId) => {
    setTodoToDelete(todoId);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setTodoToDelete(null);
  };

  return (
    <div className=' p-4'>
       <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={() => handleDelete(todoToDelete)}
      />
      <h2 className="text-2xl font-bold mb-4">{todo.title}</h2>
      <div className="flex">
        {!todo.completed ? 
          <button
            className="btn btn-sm bg-[#012046] text-white font-semibold font-light border-0 hover:bg-[#2A4C75]"
            onClick={markAsCompleted}
          >
            Mark as completed
          </button>
          : <div className='px-4 py-1 bg-green-800 text-white w-fit rounded-md'>Completed</div>
        }
        <button 
          className='btn btn-sm bg-[#ff2626] text-white ml-2 border-0 hover:bg-[#ac2727]'
          onClick={() => openConfirmationModal(todo._id)}
        >
          Delete
        </button>
      </div>
      <p className="mt-2 text-sm font-bold"><span className='font-light'>User</span>: {user.firstName} {user.lastName}</p>
      <p className="mt-2 text-sm font-bold"><span className='font-light'>Created at:</span> {new Date(todo.created_at).toLocaleString()}</p>
      <br />
      <hr />
      <br />
      <p>{todo.description}</p>
    </div>
  );
};

export default ToDoDetails;
