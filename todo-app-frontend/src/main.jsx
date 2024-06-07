import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/Route';
import { AuthProvider } from './components/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider> 
    <RouterProvider router={router} />
  </AuthProvider>
);
