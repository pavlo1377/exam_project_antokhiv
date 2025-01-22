import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-blue-200 text-white flex flex-col items-center justify-center px-8">
      <h1 className="text-5xl font-extrabold mb-6 text-center">
        Welcome to <span className="text-yellow-300">University Scheduler</span>
      </h1>
      <p className="text-xl mb-8 text-center">
        Organize your class schedule effortlessly and stay on top of your
        academic journey.
      </p>
      <button
        onClick={() => navigate("/schedule/firstYear")}
        className="bg-yellow-400 text-blue-900 py-3 px-8 rounded-full font-semibold text-lg hover:bg-yellow-300 transition duration-300"
      >
        Get Started
      </button>

      <div className="mt-12 flex flex-wrap justify-center gap-8 w-full max-w-5xl">
        <div className="flex-1 min-w-[280px] max-w-sm bg-white text-blue-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Quick Access</h2>
          <p>View and manage your schedule in just a few clicks.</p>
        </div>
        <div className="flex-1 min-w-[280px] max-w-sm bg-white text-blue-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">User-Friendly Interface</h2>
          <p>Navigate with ease using our intuitive design.</p>
        </div>
        <div className="flex-1 min-w-[280px] max-w-sm bg-white text-blue-900 p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-2">Stay Organized</h2>
          <p>Keep all of your classes neatly arranged.</p>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm">
        <p>Join 100+ students already using University Scheduler!</p>
      </footer>
    </div>
  );
};

export default HomePage;
