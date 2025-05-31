import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import HomeView from './view/home-view';
import LoginView from './view/login-view';
import SignupView from './view/signup-view';
import Layout from './components/layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CategoryView from './view/category-view';
import CatalogueView from './view/catalogue-view';
import ProductDetailView from './view/product-detail-view';
import CategoryProductView from './view/category-product-view';
import AboutView from './view/about-view';

export const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomeView/>},
      { path: 'category', element: <CategoryView />},
      { path: 'category/:categoryId', element: <CategoryProductView/>},
      { path: 'login', element: <LoginView/>},
      { path: 'signup', element: <SignupView/>},
      { path: 'catalogue', element: <CatalogueView/>},
      { path: 'product/:productId', element: <ProductDetailView/>},
      { path: 'about', element: <AboutView/>}
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
