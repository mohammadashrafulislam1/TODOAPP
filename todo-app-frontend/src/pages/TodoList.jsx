import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../components/AuthProvider';
import { endPoint } from '../forAll/forAll';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaTrashAlt, FaGripLines } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ConfirmationModal from '../components/ConfirmationModal';
import './style.css';

const TodoList = ({ setSelectedTodo, addNotification, updateCompletedTodos, deleteTodo, setTodos, todos, updateTodo }) => {
  const { user } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchTodos = async () => {
        try {
          const response = await axios.get(`${endPoint}/todo/${user._id}`);
          setTodos(response.data);
       
        } catch (error) {
          console.error('Error fetching to-dos:', error);
        }
      };
      fetchTodos();
    }
  }, [user]);

  const generateRandomGradient = () => {
    const colors = [
      'from-[#505285] to-[#65689F]',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };
  const handleDelete = async (todoId) => {
    try {
      await deleteTodo(todoId); // Call the deleteTodo function with the todo ID
      // Additional logic if needed
      
      setIsModalOpen(false);
      
      setSelectedTodo()
      setTodos(todos.filter(todo => todo._id !== todoId));
      addNotification(`The project "${todos.find(todo => todo._id === todoId).title}" is deleted.`);
      toast.success("Deleted successfully.");
    }catch (error) {
      console.error('Error deleting to-do:', error);
      toast.error(error.response.data);
    }
  };

 

  const markAsCompleted = async (todoId) => {
    try {
      const response = await axios.put(`${endPoint}/todo/${todoId}`, {
        userId: user._id,
        completed: true
      });
      setTodos(todos.map(todo => todo._id === todoId ? { ...todo, completed: true, updated_at: new Date().toISOString() } : todo));
      toast.success("Marked as completed.");
      addNotification(`The project: "${todos.find(todo => todo._id === todoId).title}" is completed.`);
      updateCompletedTodos()
      const todo =todos.find(todo => todo._id === todoId)
      console.log(todo)
      const updatedTodo = { ...todo, completed: true };
      setSelectedTodo(updatedTodo);
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
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={() => handleDelete(todoToDelete)}
      />
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {todos.length === 0 ? (
              <div className="text-gray-500 text-center">No todos found.</div>
            ): (todos.map((todo, index) => (
                <Draggable key={todo._id} draggableId={todo._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`p-4 ml-3 bg-gradient-to-r ${generateRandomGradient()} rounded-lg cursor-pointer relative ${!todo.completed ? 'glow' : 'greenGlow'}`}
                      title={!todo.completed ? "Not completed yet" : "Completed project"}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="absolute top-2 left-2 cursor-move"
                      >
                        <FaGripLines />
                      </div>
                      <div
                        className="absolute top-2 right-2 cursor-pointer text-white mt-2 mr-2"
                        onClick={() => openConfirmationModal(todo._id)}
                      >
                        <FaTrashAlt />
                      </div>
                      <h3
                        className="text-xl font-bold mt-4"
                        onClick={() => setSelectedTodo(todo)}
                      >
                        {todo.title}
                      </h3>
                      <p className="truncate">{todo.description}</p>
                      <div className="flex justify-between items-center mt-2 text-sm">
                        <span>{new Date(todo.created_at).toLocaleDateString()}</span>
                        {!todo.completed ? (
                          <button
                            className="btn btn-sm bg-[#012046] text-white font-light border-0 hover:bg-[#2A4C75]"
                            onClick={() => markAsCompleted(todo._id)}
                          >
                            Mark as completed
                          </button>
                        ): <button className='btn btn-sm bg-green-800 text-white' disabled>Completed</button>}
                      </div>
                    </div>
                  )}
                </Draggable>
              )))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default TodoList;
