import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    Shield,
    UserCircle,
    GraduationCap,
    Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { user, logout, isAdmin, isTeacher, isAccountant } = useAuth();

    const menuItems = [
        {
            title: 'الرئيسية',
            path: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            show: true
        },
        {
            title: 'إدارة الطلاب',
            path: '/dashboard/students',
            icon: <Users className="w-5 h-5" />,
            show: isAdmin || isTeacher
        },
        {
            title: 'المواد الدراسية',
            path: '/dashboard/courses',
            icon: <BookOpen className="w-5 h-5" />,
            show: isAdmin || isTeacher
        },
        {
            title: 'طلبات الحجز',
            path: '/dashboard/bookings',
            icon: <Calendar className="w-5 h-5" />,
            show: isAdmin || isTeacher
        },
        {
            title: 'المدفوعات',
            path: '/dashboard/payments', // This could be ManagePayments
            icon: <Wallet className="w-5 h-5" />,
            show: isAdmin || isAccountant
        },
        {
            title: 'التقارير',
            path: '/dashboard/reports',
            icon: <BarChart3 className="w-5 h-5" />,
            show: isAdmin
        },
        {
            title: 'إدارة الموظفين',
            path: '/dashboard/employees',
            icon: <Shield className="w-5 h-5" />,
            show: isAdmin
        }
    ];

    return (
        <aside className="fixed right-0 top-0 h-screen w-80 bg-white border-l border-slate-100 shadow-2xl z-50 flex flex-col font-header">
            {/* Logo Section */}
            <div className="p-8 border-b border-slate-50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                        <GraduationCap className="w-7 h-7 text-primary-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">الدحّيح <span className="text-primary-600">سنتر</span></h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Admin Management</p>
                    </div>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
                <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">القائمة الرئيسية</p>

                {menuItems.filter(item => item.show).map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/dashboard'}
                        className={({ isActive }) =>
                            `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 translate-x-2'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`
                        }
                    >
                        <span className="shrink-0 transition-transform group-hover:scale-110">
                            {item.icon}
                        </span>
                        <span className="font-black text-sm">{item.title}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile & Footer */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/50">
                <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-inner">
                        <UserCircle className="w-8 h-8" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-slate-800 truncate">{user?.name || 'مسؤول النظام'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{user?.role || 'Admin'}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="w-full h-14 rounded-2xl bg-white border border-rose-50 text-rose-500 hover:bg-rose-50 font-black text-sm flex items-center justify-center gap-3 transition-all group shadow-sm hover:shadow-md"
                >
                    <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> تسجيل الخروج
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
