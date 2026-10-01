import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';
import GlobalSearchModal from './GlobalSearchModal';
import CodeBlazeLogo from './CodeBlazeLogo';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Keyboard shortcut Cmd/Ctrl + K for global search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  const streak = user?.streak || 0;
  const solvedCount = user?.problemSolved?.length || 0;

  return (
    <>
      <header className="sticky top-0 z-50 h-14 bg-[#0e1017]/95 backdrop-blur-md border-b border-[#262b3d] px-4 md:px-6 flex items-center justify-between">
        {/* Left: Brand + Nav Links */}
        <div className="flex items-center gap-6">
          <NavLink to="/" className="flex items-center text-decoration-none group hover:opacity-95 transition-opacity">
            <CodeBlazeLogo size={32} />
          </NavLink>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink
              to="/problems"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
                }`
              }
            >
              Problems
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
                }`
              }
            >
              Explore
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/20'
                    : 'text-[#9aa0b8] hover:text-purple-300 hover:bg-[#1a1e2b]'
                }`
              }
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
              DSA Coach
            </NavLink>

            <NavLink
              to="/progress"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
                }`
              }
            >
              Progress
            </NavLink>

            <NavLink
              to="/submissions"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                    : 'text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b]'
                }`
              }
            >
              Submissions
            </NavLink>
          </nav>
        </div>

        {/* Right: Search, Streak, User dropdown */}
        <div className="flex items-center gap-3">
          {/* Global Search Trigger */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#131620] hover:bg-[#1a1e2b] border border-[#262b3d] hover:border-[#373e57] rounded-lg text-xs text-[#9aa0b8] transition-all cursor-pointer font-sans"
            title="Global Search (Cmd + K)"
          >
            <svg className="w-3.5 h-3.5 text-[#5e6480]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="hidden sm:inline">Search problems, topics...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#23283a] text-[#9aa0b8] rounded border border-[#262b3d]">
              ⌘K
            </kbd>
          </button>

          {/* User authenticated items */}
          {isAuthenticated && user ? (
            <>
              {/* Streak Badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/25 rounded-lg text-xs font-mono font-semibold text-amber-400" title={`${streak} day streak`}>
                <span>🔥</span>
                <span>{streak}</span>
              </div>

              {/* Solved Badge */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs font-mono font-semibold text-emerald-400" title={`${solvedCount} problems solved`}>
                <span>✓</span>
                <span>{solvedCount} Solved</span>
              </div>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 bg-[#131620] hover:bg-[#1a1e2b] border border-[#262b3d] rounded-lg text-xs font-semibold text-white transition-all cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-[11px]">
                    {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate hidden sm:inline">{user.firstName}</span>
                  <svg className={`w-3.5 h-3.5 text-[#5e6480] transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#131620] border border-[#262b3d] rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in font-sans">
                    <div className="px-4 py-2.5 border-b border-[#262b3d]">
                      <div className="font-bold text-xs text-white truncate">{user.firstName} {user.lastName || ''}</div>
                      <div className="text-[11px] text-[#5e6480] truncate font-mono mt-0.5">{user.emailId}</div>
                    </div>

                    <NavLink
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b] transition-colors text-decoration-none"
                    >
                      <svg className="w-4 h-4 text-[#5e6480]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </NavLink>

                    <NavLink
                      to="/recommendations"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b] transition-colors text-decoration-none"
                    >
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      DSA Skill Assessment
                    </NavLink>

                    <NavLink
                      to="/bookmarks"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#9aa0b8] hover:text-white hover:bg-[#1a1e2b] transition-colors text-decoration-none"
                    >
                      <svg className="w-4 h-4 text-[#5e6480]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Saved Bookmarks
                    </NavLink>

                    {user.role === 'admin' && (
                      <NavLink
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-400 hover:bg-[#1a1e2b] transition-colors text-decoration-none"
                      >
                        <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Admin Portal
                      </NavLink>
                    )}

                    <div className="my-1 border-t border-[#262b3d]"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left cursor-pointer border-none bg-transparent"
                    >
                      <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="btn-secondary text-xs py-1.5 px-3">
                Sign In
              </NavLink>
              <NavLink to="/signup" className="btn-primary text-xs py-1.5 px-3">
                Register
              </NavLink>
            </div>
          )}
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
