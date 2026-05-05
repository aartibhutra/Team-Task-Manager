import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckSquare, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <CheckSquare size={24} color="var(--primary)" />
        Task Manager
      </Link>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/projects" className="nav-link">Projects</Link>
            <div className="flex items-center gap-4 ml-4">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{user.name}</span>
                <span className="badge badge-progress" style={{fontSize: '0.65rem'}}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
