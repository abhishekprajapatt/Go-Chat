import { createBrowserRouter } from 'react-router-dom';
import App from '../App.jsx';
import Register from '../components/Register.jsx';
import Login from '../components/Login.jsx';
import Home from '../components/Home.jsx';
import MessagePage from '../components/MessagePage.jsx';
import AuthLayout from '../components/AuthLayout.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'register',
        element: (
          <AuthLayout>
            <Register />
          </AuthLayout>
        ),
      },
      {
        path: 'login',
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: '',
        element: <Home />,
        children: [
          {
            path: ':userId',
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);

export default router;