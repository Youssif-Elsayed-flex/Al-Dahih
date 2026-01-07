import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    GraduationCap,
    BookOpen,
    Users,
    ChevronRight,
    Plus,
    Calendar,
    Layout,
    Clock,
    Book,
    MessageSquare,
    TrendingUp
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';

const TeacherDashboard = () => {
    // Ideal: /teachers/me/courses
    const { data: courses, isLoading } = useQuery({
        queryKey: ['teacher-courses'],
        queryFn: async () => {
            const { data } = await axios.get('/courses');
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تجهيز فصلك الدراسي..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 flex items-center gap-4">
                            <GraduationCap className="w-12 h-12 text-primary-600" />
                            بوابة <span className="text-primary-600">المُعلم</span>
                        </h1>
                        <p className="text-slate-500 font-medium">أهلاً بك يا أستاذ. تابع تقدم مجموعاتك وطلابك من مكان واحد.</p>
                    </motion.div>

                    <Button className="h-14 px-8 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 flex items-center gap-2 font-black shadow-xl shadow-primary-200 transition-all">
                        <Plus className="w-5 h-5" /> إنشاء كورس جديد
                    </Button>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'عدد المجموعات', val: courses?.length || 0, icon: Layout, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'إجمالي الطلاب', val: courses?.reduce((acc, curr) => acc + (curr.students?.length || 0), 0) || 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'جلسات اليوم', val: '4', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'تفاعل الطلاب', val: '94%', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-900">{stat.val}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Courses List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <BookOpen className="w-7 h-7 text-primary-500" />
                            مجموعاتك التعليمية
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {courses?.length > 0 ? (
                                courses.map((course, i) => (
                                    <motion.div
                                        key={course._id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all h-full flex flex-col group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[4rem] group-hover:scale-110 transition-transform -mr-8 -mt-8" />

                                            <div className="relative z-10 flex-1">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-widest mb-4">
                                                    <Clock className="w-3.5 h-3.5" /> 3 محاضرات أسبوعياً
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-primary-600 transition-colors">{course.title}</h4>

                                                <div className="grid grid-cols-2 gap-4 mb-8">
                                                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الصف</p>
                                                        <p className="text-sm font-black text-slate-800">{course.gradeLevel}</p>
                                                    </div>
                                                    <div className="bg-slate-50 p-4 rounded-2xl text-center">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الطلاب</p>
                                                        <p className="text-sm font-black text-slate-800">{course.students?.length || 0}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="relative z-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                                                <button className="flex items-center gap-2 text-sm font-black text-primary-600 hover:translate-x-[-4px] transition-transform">
                                                    <Plus className="w-4 h-4" /> إضافة محتوى
                                                </button>
                                                <Button className="h-10 px-6 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800">
                                                    إدارة الفصل
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm text-center">
                                    <EmptyState title="لا توجد دورات حالياً" message="ابدأ بإضافة منهجك الدراسي وتفاعل مع طلابك!" />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default TeacherDashboard;
