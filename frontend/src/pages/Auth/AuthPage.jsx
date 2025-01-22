import React from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-200">
      <div className="bg-blue-100 p-8 rounded shadow-md w-96 h-72">
        <h2 className="text-2xl font-bold mb-6 text-center">Welcome</h2>
        <p className="mb-4 text-center text-gray-600">
          Please choose an option:
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/auth/login"
            className="bg-blue-500 text-white py-2 px-4 rounded text-center hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="bg-green-500 text-white py-2 px-4 rounded text-center hover:bg-green-600"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
