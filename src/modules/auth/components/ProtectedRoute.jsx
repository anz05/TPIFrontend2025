import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // base64 url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = JSON.parse(atob(b64));
    return json;
  } catch (e) {
    return null;
  }
}

function hasRequiredRole(token, requiredRole) {
  if (!token || !requiredRole) return false;

  const payload = decodeJwt(token);
  if (!payload) return false;

  // check common claim names
  const roles = [];
  if (payload.role) roles.push(payload.role);
  if (Array.isArray(payload.roles)) roles.push(...payload.roles);
  if (payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
    const r = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    if (Array.isArray(r)) roles.push(...r); else roles.push(r);
  }

  return roles.includes(requiredRole);
}

function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('token');

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  if (requiredRole) {
    if (!hasRequiredRole(token, requiredRole)) {
      return <Navigate to='/' />;
    }
  }

  return children;
};

export default ProtectedRoute;
