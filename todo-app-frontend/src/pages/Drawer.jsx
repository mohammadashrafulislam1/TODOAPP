import { useContext } from 'react';
import { Link } from "react-router-dom";
import { AuthContext } from '../components/AuthProvider';
import { FaSignOutAlt, FaUser } from 'react-icons/fa';

const Drawer = ({ completedTodos }) => {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = ()=>{
    logout()
  }

  return (
    <div className="">
      <Link to='/addtodo'>
        <button className="btn btn-sm w-full bg-[#ffffff5e] border-0 text-white hover:text-black hover:bg-[#fff] text-xl mb-4">Add ToDo</button>
      </Link>
       <Link to="/account">
        <button className="btn btn-sm w-full bg-blue-500 hover:bg-blue-800 text-white hover:text-white border-0 mt-4 mb-2">User Account <FaUser></FaUser></button>
      </Link>
  <div>
  <h2 className="font-bold mb-4 mt-4">Completed Projects</h2>
      {completedTodos.length === 0 ? (
        <p className="text-gray-500 text-center">No completed projects found.</p>
      ) : (
        <ul className="space-y-2">
          {completedTodos.map((todo, index) => (
            <li key={index} className="rounded shadow p-2 flex gap-2 items-center">
              <input type="checkbox" className="checkbox checkbox-warning" disabled checked />
              <div><h3 className="font-semibold">{todo.title}</h3>
              <p className="text-sm text-gray-400 mb-3">Completed on: {console.log(todo.updatedAt)} {new Date(todo.updatedAt).toLocaleString()}</p></div>
              <hr />
            </li>
          ))}
        </ul>
      )}
  </div>
  <button className='btn btn-sm w-full bg-red-500 hover:bg-red-800 text-white hover:text-white border-0 mt-10 mb-5' onClick={handleLogout}>LogOut <FaSignOutAlt></FaSignOutAlt></button>
    </div>
  );
};

export default Drawer;
