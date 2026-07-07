import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import LiveTranslator from './pages/LiveTranslator'
import Training from './pages/Training'
import Emergency from './pages/Emergency'
import Learning from './pages/Learning'

import History from './pages/History'
import Settings from './pages/Settings'
import AdminDashboard from './pages/AdminDashboard'
import UserManagement from './pages/UserManagement'
import SystemHealth from './pages/SystemHealth'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import Contact from './pages/Contact'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  // In a real app, you would check the role from the token or a context
  return children;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          className: 'font-bold text-sm rounded-2xl shadow-2xl border border-slate-100',
          duration: 4000,
          style: {
            padding: '16px 24px',
            color: '#0f172a',
            background: '#ffffff',
          },
          success: {
            iconTheme: {
              primary: '#4f46e5',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 6000,
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fee2e2'
            }
          }
        }} 
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected/App Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/translate" element={<ProtectedRoute><LiveTranslator /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute><Training /></ProtectedRoute>} />

        <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
        <Route path="/learning" element={<ProtectedRoute><Learning /></ProtectedRoute>} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly={true}><UserManagement /></ProtectedRoute>} />
        <Route path="/admin/health" element={<ProtectedRoute adminOnly={true}><SystemHealth /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
