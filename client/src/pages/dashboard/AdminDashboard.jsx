import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    BookOpen,
    CheckCircle,
    TrendingUp,
    UserCheck,
    GraduationCap,
    Calendar,
    FileText,
    DollarSign,
    ArrowUpRight,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    BarChart3
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
    const { data: stats, isLoading, error } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: async () => {
            const { data } = await axios.get('/dashboard/stats');
            return data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loading message="جاري تحميل البيانات..." />
            </div>
        );
    }

    const statItems = [
        { label: 'طلاب مسجلين', val: stats?.counts?.students || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100', shadow: 'shadow-blue-500/10' },
        { label: 'دورات نشطة', val: stats?.counts?.courses || 0, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100', shadow: 'shadow-orange-500/10' },
        { label: 'حجوزات مؤكدة', val: stats?.counts?.bookings?.confirmed || 0, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100', shadow: 'shadow-emerald-500/10' },
        { label: 'الإيرادات المالية', val: `${stats?.revenue?.total?.toLocaleString() || 0} ج.م`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-100', shadow: 'shadow-indigo-500/10' },
    ];

    const quickActions = [
        { to: '/dashboard/students', label: 'إدارة الطلاب', icon: GraduationCap, color: 'blue' },
        { to: '/dashboard/employees', label: 'فريق العمل', icon: UserCheck, color: 'cyan' },
        { to: '/dashboard/courses', label: 'مواد الشرح', icon: BookOpen, color: 'orange' },
        { to: '/dashboard/bookings', label: 'طلبات الحجز', icon: Calendar, color: 'emerald' },
        { to: '/dashboard/reports', label: 'الخزنة', icon: FileText, color: 'indigo' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header selection:bg-primary-100 selection:text-primary-700">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
                <div className="absolute top-[20%] -right-[5%] w-[35%] h-[35%] bg-primary-100/40 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">إحصائيات فورية</span>
                            <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                النظام قيد التشغيل (Mock Approved)
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            لوحة <span className="text-primary-600">الإدارة المركزية</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg">
                            تحكم كامل في منصتك التعليمية من مكان واحد، بكل بساطة ووضوح.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center gap-4"
                    >
                        <div className="pl-6 pr-4 py-2 border-l border-slate-100">
                            <p className="text-[10px] text-slate-400 font-black uppercase mb-0.5">تقرير اليوم</p>
                            <p className="text-lg font-black text-slate-800">12 عملية جديدة</p>
                        </div>
                        <Button variant="primary" className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-lg shadow-slate-300">
                            تصدير PDF
                        </Button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className={`h-full bg-white border border-slate-100 p-8 rounded-[2rem] shadow-xl ${item.shadow} hover:shadow-2xl transition-all group overflow-hidden relative`}>
                                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <p className="text-slate-400 font-bold text-sm mb-1">{item.label}</p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">{item.val}</h3>
                                    <div className="flex items-center text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg mb-1">
                                        +4% <TrendingUp className="w-3 h-3 ml-1" />
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Navigation Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12">
                    {quickActions.map((action, i) => (
                        <Link key={i} to={action.to}>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm hover:shadow-xl hover:border-primary-100 transition-all group shrink-0"
                            >
                                <div className="w-12 h-12 mx-auto bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <h4 className="font-black text-slate-800 text-sm">{action.label}</h4>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Activity Feed */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                    <BarChart3 className="w-5 h-5 text-primary-500" />
                                    أحدث الحجوزات
                                </h3>
                                <Link to="/dashboard/bookings" className="text-primary-600 text-[10px] font-black uppercase hover:underline">عرض الكل</Link>
                            </div>

                            <div className="space-y-3">
                                {stats?.recent?.bookings?.length > 0 ? (
                                    stats.recent.bookings.map((booking) => (
                                        <div key={booking._id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-slate-800 text-sm">{booking.student?.name}</h5>
                                                    <p className="text-[10px] text-slate-400 font-medium">كورس: {booking.course?.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                                        booking.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                                                    }`}>
                                                    {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'pending' ? 'معلق' : 'ملغي'}
                                                </span>
                                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-10 text-center opacity-40">
                                        <Search className="w-12 h-12 mx-auto mb-3" />
                                        <p className="text-sm font-bold">لا توجد عمليات حالياً</p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Alerts & Tasks */}
                    <div className="space-y-6">
                        <div className="bg-primary-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-primary-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <AlertCircle className="w-8 h-8 mb-4" />
                            <h3 className="text-xl font-black mb-2">تنبيهات المراجعة</h3>
                            <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                                هناك <span className="text-white font-black underline">{stats?.counts?.bookings?.pending || 0} حجوزات</span> بانتظار التأكيد الفوري من قِبلك.
                            </p>
                            <Link to="/dashboard/bookings">
                                <Button className="w-full bg-white text-primary-600 font-black h-12 rounded-xl border-none hover:bg-primary-50 transition-colors">
                                    تأكيد الطلبات
                                </Button>
                            </Link>
                        </div>

                        <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40">
                            <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                تقارير سريعة
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">سعة الكورسات</span>
                                    <span className="font-black text-slate-800">85%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[85%]" />
                                </div>

                                <div className="flex items-center justify-between text-sm pt-4">
                                    <span className="text-slate-500">رضا الطلاب</span>
                                    <span className="font-black text-slate-800">92%</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[92%]" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default AdminDashboard;
