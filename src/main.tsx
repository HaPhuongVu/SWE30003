import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeView from './view/home-view';
import CatalogueView from './view/catalogue-view';
import LoginView from './view/login-view';
import SignupView from './view/signup-view';


import Layout from './components/layout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeView/>},
      { path: 'catalogue', element: <CatalogueView /> },
      { path: 'login', element: <LoginView/>},
      { path: 'signup', element: <SignupView/>}
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
