import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './authSlice';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Homepage from './pages/Homepage';
import ProblemsPage from './pages/ProblemsPage';
import ProblemSolve from './pages/ProblemSolve';
import RecommendationsPage from './pages/RecommendationsPage';
import ProgressPage from './pages/ProgressPage';
import SubmissionsPage from './pages/SubmissionsPage';
import ExplorePage from './pages/ExplorePage';
import BookmarksPage from './pages/BookmarksPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminPanel from './pages/AdminPanel';
import AdminUpload from './components/AdminUpload';
import AdminVideo from './components/AdminVideo';

// Admin Guard
const AdminRoute = ({ isAuthenticated, role, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

// Protected Route Guard
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0b0e',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Syne', -apple-system, sans-serif"
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid rgba(108, 142, 247, 0.2)',
          borderTopColor: '#6c8ef7',
          animation: 'app-spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes app-spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public / Auth ── */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />

      {/* ── Core Platform Routes (Protected) ── */}
      <Route path="/" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Homepage /></ProtectedRoute>} />
      <Route path="/problems" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProblemsPage /></ProtectedRoute>} />
      <Route path="/problem/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProblemSolve /></ProtectedRoute>} />
      <Route path="/problems/:id" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProblemSolve /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute isAuthenticated={isAuthenticated}><RecommendationsPage /></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ProgressPage /></ProtectedRoute>} />
      <Route path="/submissions" element={<ProtectedRoute isAuthenticated={isAuthenticated}><SubmissionsPage /></ProtectedRoute>} />
      <Route path="/explore" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ExplorePage /></ProtectedRoute>} />
      <Route path="/topics" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ExplorePage /></ProtectedRoute>} />
      <Route path="/bookmarks" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BookmarksPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><UserProfilePage /></ProtectedRoute>} />

      {/* ── Admin Routes ── */}
      <Route path="/admin" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminPanel />
        </AdminRoute>
      } />
      <Route path="/admin/video" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminVideo />
        </AdminRoute>
      } />
      <Route path="/admin/upload/:problemId" element={
        <AdminRoute isAuthenticated={isAuthenticated} role={user?.role}>
          <AdminUpload />
        </AdminRoute>
      } />

      {/* ── Catch-all ── */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
