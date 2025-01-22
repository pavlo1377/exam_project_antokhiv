import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo_2 from "../../public/logo_2.png";
import { useSelector } from "react-redux";

const Header = () => {
  const { user } = useSelector((state) => state.auth);

  const location = useLocation();

  const isHomePage = location.pathname === "/";

  return (
    <header className="bg-gradient-to-r from-blue-500 to-blue-200 text-white py-1 max-h-40">
      <div className="px-4 flex items-center justify-between">
        {/* Логотип */}
        <Link to="/" className="text-2xl font-semibold">
          <img className="h-20" src={logo_2} alt="Logo" />
        </Link>

        <p>{isHomePage ? `Welcome, ${user.email} 🙂` : ""}</p>

        {/* Навігація */}
        <nav className="space-x-4 justify-between">
          <Link
            to="/schedule/firstYear"
            className="text-lg hover:text-gray-400"
          >
            Schedule
          </Link>
          <Link to="/info" className="text-lg hover:text-gray-400">
            Info
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
