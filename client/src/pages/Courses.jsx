import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Book,
    Search,
    Filter,
    ChevronLeft,
    ArrowRight,
    GraduationCap,
    Clock,
    TrendingUp,
    Sparkles,
    BookOpen
} from 'lucide-react';
import axios from '../api/axios.config';
import Container from '../components/common/Container';
import Loading from '../components/common/Loading';
import CourseCard from '../components/course/CourseCard';

const Courses = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['courses'],
        queryFn: async () => {
            const { data } = await axios.get('/courses');
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تجهيز المواد الدراسية..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden font-header">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 blur-[140px] rounded-full" />
                <div className="absolute bottom-[20%] -right-[10%] w-[45%] h-[45%] bg-primary-100/30 blur-[130px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 shadow-sm text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
                    >
                        <Sparkles className="w-4 h-4" /> استكشف آفاقك التعليمية
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                    >
                        المواد <span className="text-primary-600">والدورات الدراسية</span>
                    </motion.h1>

                    <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-10">
                        اختر مادتك المفضلة وابدأ رحلة التعلم مع أفضل الأساتذة المختصين بطرق شرح مبتكرة.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <div className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black shadow-lg shadow-slate-200">
                            {data?.length || 0} مادة دراسية متاحة
                        </div>
                        <div className="px-6 py-2 bg-white text-slate-400 border border-slate-100 rounded-xl text-xs font-black">
                            {new Date().getFullYear()} / {new Date().getFullYear() + 1}
                        </div>
                    </div>
                </div>

                {/* Courses Grid */}
                <AnimatePresence mode="popLayout">
                    {data && data.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {data.map((course, i) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <CourseCard course={course} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full opacity-50" />
                            <Search className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                            <h3 className="text-3xl font-black text-slate-800 mb-4">لا توجد مواد متاحة حالياً</h3>
                            <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">
                                نحن نعمل بجد لإضافة مزيد من المواد الدراسية المتميزة. ترقبوا الإضافات الجديدة قريباً!
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </Container>
        </div>
    );
};

export default Courses;
