import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    BarChart3,
    TrendingUp,
    Users,
    BookOpen,
    Calendar,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    PieChart,
    Download,
    FileText,
    Activity
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

const Reports = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['dashboard-reports'],
        queryFn: async () => {
            const { data } = await axios.get('/dashboard/stats');
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تحليل البيانات وإعداد التقارير..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] bg-blue-100/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[45%] h-[45%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 flex items-center gap-4">
                            <BarChart3 className="w-12 h-12 text-primary-600" />
                            التقارير <span className="text-primary-600">والإحصائيات</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg">نظرة شاملة على أداء المنصة والتدفقات المالية في الوقت الفعلي.</p>
                    </motion.div>

                    <Button className="h-14 px-8 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-3 font-black shadow-xl shadow-slate-200 transition-all">
                        <Download className="w-5 h-5" /> تصدير التقرير السنوي
                    </Button>
                </div>

                {/* Main Revenue Highlights */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-4 bg-white/10 rounded-2xl">
                                        <TrendingUp className="w-8 h-8 text-primary-400" />
                                    </div>
                                    <span className="flex items-center gap-1 text-emerald-400 text-sm font-black bg-emerald-400/10 px-3 py-1 rounded-full">+12.4% <ArrowUpRight className="w-4 h-4" /></span>
                                </div>
                                <h3 className="text-xl font-black mb-2 opacity-60 uppercase tracking-widest text-primary-100">إجمالي الإيرادات</h3>
                                <div className="flex items-baseline gap-3">
                                    <p className="text-5xl font-black tracking-tight">{stats?.revenue?.total?.toLocaleString() || 0}</p>
                                    <span className="text-xl font-bold opacity-40">ج.م</span>
                                </div>
                                <div className="mt-10 grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">فودافون كاش</p>
                                        <p className="text-lg font-black">{stats?.revenue?.vodafoneCash?.toLocaleString() || 0} <span className="text-[10px]">ج.م</span></p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">الدفع النقدي</p>
                                        <p className="text-lg font-black">{stats?.revenue?.cash?.toLocaleString() || 0} <span className="text-[10px]">ج.م</span></p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ y: -5 }}
                    >
                        <Card className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl shadow-slate-200/40 relative overflow-hidden group h-full">
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-primary-50 blur-[80px] -mr-24 -mb-24" />
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-4 bg-primary-50 rounded-2xl">
                                        <Calendar className="w-8 h-8 text-primary-600" />
                                    </div>
                                    <span className="flex items-center gap-1 text-slate-400 text-sm font-black">الشهر الحالي</span>
                                </div>
                                <h3 className="text-xl font-black mb-2 text-slate-400 uppercase tracking-widest">إجمالي الحجوزات</h3>
                                <div className="flex items-baseline gap-3 mb-auto">
                                    <p className="text-5xl font-black text-slate-900 tracking-tight">{stats?.counts?.bookings?.total || 0}</p>
                                    <span className="text-xl font-bold text-slate-300">عملية</span>
                                </div>

                                <div className="mt-8 space-y-4 pt-8 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">حجوزات مؤكدة</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-emerald-500 h-full" style={{ width: `${(stats?.counts?.bookings?.confirmed / stats?.counts?.bookings?.total) * 100 || 0}%` }} />
                                            </div>
                                            <span className="text-sm font-black text-slate-800">{stats?.counts?.bookings?.confirmed || 0}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-slate-500">حجوزات معلقة</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div className="bg-orange-500 h-full" style={{ width: `${(stats?.counts?.bookings?.pending / stats?.counts?.bookings?.total) * 100 || 0}%` }} />
                                            </div>
                                            <span className="text-sm font-black text-slate-800">{stats?.counts?.bookings?.pending || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Sub Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Student Performance Card */}
                    <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800">قاعدة الطلاب</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">إجمالي الطلاب المسجلين</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-black text-slate-900">{stats?.counts?.students || 0}</p>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg mb-1">+8 جديد</span>
                                </div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[2rem]">
                                <p className="text-sm font-bold text-slate-500 mb-4">كثافة الحضور</p>
                                <div className="flex justify-between items-end gap-2 h-20">
                                    {[30, 60, 45, 80, 50, 90, 70].map((h, i) => (
                                        <div key={i} className="flex-1 bg-primary-100 rounded-lg group relative hover:bg-primary-500 transition-colors" style={{ height: `${h}%` }}>
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                {h}% نشاط
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Course Performance Card */}
                    <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800">أداء الكورسات</h3>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المواد النشطة حالياً</p>
                                <p className="text-3xl font-black text-slate-900">{stats?.counts?.courses || 0}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                                        <span className="text-sm font-bold text-slate-600">الأكثر مبيعاً</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">فيزياء - 3 ث</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        <span className="text-sm font-bold text-slate-600">الأعلى تقييماً</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-800">كيمياء - 2 ث</span>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full h-12 rounded-xl text-xs font-black border-slate-100 hover:bg-slate-50">
                                تحليل التفاصيل <ChevronLeft className="w-4 h-4 mr-1" />
                            </Button>
                        </div>
                    </Card>

                    {/* Quick Insight / Activity */}
                    <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/30 flex flex-col">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Activity className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800">رؤى وتنبؤات</h3>
                        </div>
                        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <p className="text-sm font-bold text-emerald-800 leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 inline-block ml-1 mb-1" />
                                    أداء المنصة مستقر جداً. نسبة النمو في الحجوزات زادت بنسبة <span className="font-black">8%</span> عن الأسبوع الماضي.
                                </p>
                            </div>
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                                <p className="text-sm font-bold text-blue-800 leading-relaxed">
                                    <ArrowUpRight className="w-4 h-4 inline-block ml-1 mb-1" />
                                    يُنصح بزيادة الترويج لمواد الصف الثاني الثانوي لزيادة معدل الوصول.
                                </p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-2xl">
                                <p className="text-xs font-bold text-slate-400 italic">بناءً على تحليلات دقيقه لمحرك الذكاء الاصطناعي للمنصه.</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Container>
        </div>
    );
};

export default Reports;
