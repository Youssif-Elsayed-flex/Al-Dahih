import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios.config';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get('/auth/me');
            setUser(data.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('/auth/login', { email, password });
            setUser(data.data.user);
            return { success: true, user: data.data.user };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'فشل تسجيل الدخول',
            };
        }
    };

    const register = async (userData) => {
        try {
            let endpoint = '/auth/register-student';

            if (userData.role === 'teacher') {
                endpoint = '/auth/register-employee';
            } else if (userData.role === 'parent') {
                endpoint = '/auth/register-parent';
            }

            const { data } = await axios.post(endpoint, userData);

            if (userData.role === 'teacher' && data.data.status === 'pending') {
                return { success: true, message: 'تم التسجيل بنجاح، بانتظار موافقة الإدارة', pending: true };
            }

            setUser(data.data.user || data.data.student);
            return { success: true, user: data.data.user || data.data.student };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || 'فشل التسجيل',
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
        isAuthenticated: !!user,
        isStudent: user?.userType === 'student',
        isParent: user?.userType === 'parent',
        isEmployee: user?.userType === 'employee',
        isAdmin: user?.userType === 'employee' && user?.role === 'admin',
        isTeacher: user?.userType === 'employee' && user?.role === 'teacher',
        isAccountant: user?.userType === 'employee' && user?.role === 'accountant',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
