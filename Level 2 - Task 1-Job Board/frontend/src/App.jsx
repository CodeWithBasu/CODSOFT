import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Briefcase, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const { user, logout } = useAuth();

  return (
    <Router>
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav-logo">
            <Briefcase size={28} color="#0ea5e9" />
            Nexus<span>Jobs</span>
          </Link>
          <div className="nav-links">
            <Link to="/jobs">Browse Jobs</Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <span style={{color: '#10b981'}}>
                    {user.name} ({user.role})
                  </span>
                </Link>
                <button onClick={logout} className="secondary" style={{padding: '8px 16px'}}>
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <Link to="/login">
                <button style={{padding: '8px 16px'}}>
                  <LogIn size={18} /> Login / Sign Up
                </button>
              </Link>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
