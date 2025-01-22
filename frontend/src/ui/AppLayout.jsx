import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* {isLoading && <Loader/>} */}
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
