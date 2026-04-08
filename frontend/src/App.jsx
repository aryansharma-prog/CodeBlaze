import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from "./authSlice";
import { useEffect } from "react";
import AdminPanel from "./pages/AdminPanel";
import ProblemSolve from "./pages/ProblemSolve";
import UserDashboard from './pages/userDashboard';
import DSATopics from './pages/DSATopics';
import DSATopic from './pages/DSATopic';
import AdminUpload from "./components/AdminUpload";
import AdminVideo from "./components/AdminVideo";

/* ── Reusable admin guard ─────────────────────────────────────────────────── */
const AdminRoute = ({ isAuthenticated, role, children }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== 'admin')  return <Navigate to="/" />;
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
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"       element={isAuthenticated ? <Homepage />         : <Navigate to="/signup" />} />
      <Route path="/login"  element={isAuthenticated ? <Navigate to="/" />  : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" />  : <Signup />} />

      <Route path="/problem/:id" element={<ProblemSolve />} />
      <Route path="/profile"     element={<UserDashboard />} />
      <Route path="/topics"      element={<DSATopics />} />
      <Route path="/topics/:slug" element={<DSATopic />} />

      {/* ── Admin (all three routes protected) ── */}
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
    </Routes>
  );
}

export default App;
