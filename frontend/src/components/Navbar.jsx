import { Link, useLocation } from 'react-router-dom';
import { FiHome, FiClock, FiCheckCircle } from 'react-icons/fi';

const NavBar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo on the left */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center text-white font-bold">
                TF
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-800 hidden sm:inline">
                TeamFlow
              </span>
            </Link>
          </div>

          {/* Navigation links on the right */}
          <div className="flex items-center space-x-4 sm:space-x-8">
            <Link
              to="/"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiHome className="mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/ongoing"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/ongoing'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiClock className="mr-1" />
              <span className="hidden sm:inline">Ongoing</span>
            </Link>
            <Link
              to="/finished"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                location.pathname === '/finished'
                  ? 'border-blue-500 text-gray-900'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              <FiCheckCircle className="mr-1" />
              <span className="hidden sm:inline">Finished</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;