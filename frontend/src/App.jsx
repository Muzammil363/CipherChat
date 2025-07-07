import React, { useEffect } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import About from './components/About';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './App.css';
import Landing from './pages/Landing';
import AuthComponent from './components/AuthComponent';
import { createBrowserRouter,RouterProvider } from 'react-router-dom';
import Home from './components/Home';
import Profile from './components/Profile';
import Request from './components/Request';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      offset: 100,
    });
  }, []);

  const router=createBrowserRouter([
    {
      path:'/',
      element:<Landing />
    },
    {
      path:'/auth',
      element:<AuthComponent />
    },
    {
      path:'/home',
      element:<Home />
    },
    {
      path:'/profile',
      element:<Profile />
    },
    {
      path:'/requests',
      element:<Request />
    }
  ])
  return (
    <div className="App">
        <RouterProvider router={router} />
    </div>
  );
}

export default App;