import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/common/Loading';

const ProtectedRoute = ({ children, requireStudent = false, requireEmployee = false, requireParent = false }) => {
    const { isAuthenticated, loading, isStudent, isEmployee, isParent } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading message="جاري التحقق من الصلاحيات..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireStudent && !isStudent) {
        return <Navigate to="/" replace />;
    }

    if (requireEmployee && !isEmployee) {
        return <Navigate to="/" replace />;
    }

    if (requireParent && !isParent) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
