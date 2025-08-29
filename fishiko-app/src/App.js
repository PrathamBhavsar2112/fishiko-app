import { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from '@aws-amplify/auth';
import '@aws-amplify/ui-react/styles.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Predict from './pages/Predict';
import GearGuide from './pages/GearGuide'; 
import Weather from './pages/Weather'; 

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist.{' '}
          <a href="/" className="text-blue-500 hover:underline">Go back to Home</a>.
        </p>
      </div>
    </div>
  );
}

function AuthenticatedApp({ signOut, user: authUser, isDarkMode, toggleDarkMode }) {
  const [token, setToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [user, setUser] = useState(null); 
  const fetchTokenAndUser = async () => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      setToken(idToken);
      console.log('JWT Token:', idToken);

      if (authUser) {
        setUser(authUser);
        console.log('User object:', authUser); 
      }
    } catch (error) {
      console.error('Error fetching token or user:', error);
      setToken(null);
      setUser(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchTokenAndUser();
  }, [authUser]); 
  if (loadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-800 dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className={`w-full ${isDarkMode ? 'dark' : ''}`}>
        <Navbar signOut={signOut} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
        <div className="w-full bg-gray-100 dark:bg-gray-900 min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/predict" element={<Predict token={token} />} />
            <Route path="/gear-guide" element={<GearGuide />} /> 
            <Route path="/weather" element={<Weather />} /> 
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <AuthenticatedApp
          signOut={signOut}
          user={user}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </Authenticator>
  );
}

export default App;