import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Імпортуємо useSelector

import AuthPage from "./pages/Auth/AuthPage"; // Головна сторінка авторизації
import LoginPage from "./pages/Auth/LoginPage";
import SignUpPage from "./pages/Auth/SignUpPage";
import HomePage from "./pages/Home/HomePage";
import SchedulePage from "./pages/Schedule/SchedulePage";
import InfoPage from "./pages/Info/InfoPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import AppLayout from "./ui/AppLayout";
import AdminPanel from "./pages/admin/AdminPanel";


function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const adminEmail = 'antokhiv.pavlo@gmail.com'

  console.log('isAuthenticated:', isAuthenticated);  // Логуємо, чи користувач авторизований
  console.log('userEmail:', user.email);  // Логуємо email користувача

  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <AppLayout /> : <Navigate to="/auth" />,
      errorElement: <NotFoundPage />,
      children: [
        { path: "/", element: <HomePage /> },
        { path: "/schedule/:year", element: <SchedulePage /> },
        { path: "/info", element: <InfoPage /> },
      ],
    },
    {
      path: "/auth",
      element: <AuthPage />, 
    },
    {
      path: "/auth/login",
      element: <LoginPage />, 
    },
    {
      path: "/auth/signup",
      element: <SignUpPage />, 
    },
    {
      path: "admin/schedule/:year",
      element: isAuthenticated && user.email === adminEmail ? <AdminPanel/> : <Navigate to='/'/>
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
