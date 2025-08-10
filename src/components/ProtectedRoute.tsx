import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem('session');
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const sessionData = JSON.parse(session);
      if (!sessionData.loggedIn) {
        navigate('/login');
        return;
      }

      // Verificar si la sesión no ha expirado (24 horas)
      const now = Date.now();
      const sessionAge = now - sessionData.timestamp;
      const oneDay = 24 * 60 * 60 * 1000;

      if (sessionAge > oneDay) {
        localStorage.removeItem('session');
        navigate('/login');
        return;
      }
    } catch (error) {
      localStorage.removeItem('session');
      navigate('/login');
    }
  }, [navigate]);

  const session = localStorage.getItem('session');
  if (!session) {
    return null;
  }

  try {
    const sessionData = JSON.parse(session);
    if (!sessionData.loggedIn) {
      return null;
    }
  } catch (error) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;