import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import AuthCallback from './pages/AuthCallback';
import FlightsPage from './pages/FlightsPage';
import HotelsPage from './pages/HotelsPage';
import ExperiencesPage from './pages/ExperiencesPage';
import GeneratePage from './pages/GeneratePage';
import ItinerariesPage from './pages/ItinerariesPage';
import './index.css';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/flights"
              element={
                <PrivateRoute>
                  <FlightsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/hotels"
              element={
                <PrivateRoute>
                  <HotelsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/experiences"
              element={
                <PrivateRoute>
                  <ExperiencesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/generate"
              element={
                <PrivateRoute>
                  <GeneratePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/itineraries"
              element={
                <PrivateRoute>
                  <ItinerariesPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
