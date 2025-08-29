import { Link } from 'react-router-dom';

function Navbar({ signOut, toggleDarkMode, isDarkMode }) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center w-full "> 
      <div className="text-white font-bold">Fishiko</div>
      <div className="space-x-4">
        <Link to="/" className="text-white hover:text-gray-300">Home</Link> 
        <Link to="/predict" className="text-white hover:text-gray-300">Predict</Link>
        <Link to="/gear-guide" className="text-white hover:text-gray-300">Gear Guide</Link>
        <Link to="/weather" className="text-white hover:text-gray-300">Weather</Link>
        <button onClick={toggleDarkMode} className="text-white">
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button onClick={signOut} className="text-white hover:text-gray-300">Sign Out</button>
      </div>
    </nav>
  );
}

export default Navbar;