/**
 * App Router
 * Configuración de rutas principales
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PetForm from './pages/PetForm';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* ===== RUTAS PÚBLICAS ===== */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== RUTAS PRIVADAS (requieren auth) ===== */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pets/create" element={<PetForm />} />
        <Route path="/pets/:id/edit" element={<PetForm />} />
      </Route>

      {/* ===== 404 FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
