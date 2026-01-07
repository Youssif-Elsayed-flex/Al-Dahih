import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Users,
    Clock,
    GraduationCap,
    ArrowRight,
    ChevronLeft,
    CheckCircle2,
    BookOpen,
    Star,
    ShieldCheck,
    HelpCircle,
    Info,
    Play
} from 'lucide-react';
import axios from '../api/axios.config';
import { useAuth } from '../context/AuthContext';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, isStudent } = useAuth();

    const { data: course, isLoading, error } = useQuery({
        queryKey: ['course', id],
        queryFn: async () => {
            const { data } = await axios.get(`/courses/${id}`);
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري استدعاء تفاصيل المادة..." />
        </div>
    );

    if (error || !course) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 max-w-sm">
                <div className="text-6xl mb-6">🤷‍♂️</div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">المادة غير متوفرة</h2>
                <Button onClick={() => navigate('/courses')} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">العودة للمواد</Button>
            </div>
        </div>
    );

    const handleBooking = () => {
        if (!isAuthenticated) {
            navigate('/login');
        } else if (isStudent) {
            navigate(`/booking/${course._id}`);
        }
    };

    const daysMap = {
        Sunday: 'الأحد', Monday: 'الإثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء',
        Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت',
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] -right-[5%] w-[45%] h-[45%] bg-blue-100/30 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-primary-100/20 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Hero Header Card */}
                    <div className="relative h-[28rem] md:h-[35rem] rounded-[3.5rem] overflow-hidden mb-12 shadow-2xl group">
                        <img
                            src={course.coverImage || '/placeholder-course.jpg'}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="flex-1">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 mb-6"
                                >
                                    <div className="flex text-orange-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">أفضل تقييم</span>
                                </motion.div>
                                <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                                    {course.title}
                                </h1>
                                {course.teacher && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-xl shadow-primary-500/30">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">مدرس المادة</p>
                                            <p className="text-xl font-bold text-white">{course.teacher.name}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/10 text-center md:text-right">
                                    <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">المرحلة الدراسية</p>
                                    <p className="text-xl font-black text-white">{course.gradeLevel || 'العام الدراسي'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Main Content Areas */}
                        <div className="lg:col-span-8 space-y-10">
                            {/* Detailed Description */}
                            <Card className="bg-white border border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full opacity-50" />
                                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                    <BookOpen className="w-7 h-7 text-primary-600" /> لمحة عن المنهج
                                </h2>
                                <p className="text-slate-500 font-bold text-lg leading-[1.8] text-justify">
                                    {course.description || 'هذا الكورس مصمم بطريقة احترافية لتغطية كافة جوانب المادة بأسلوب ممتع ومبسط، مع التركيز على المهارات العملية ونواتج التعلم المستهدفة لضمان التفوق الدراسي.'}
                                </p>
                            </Card>

                            {/* Features / Structure */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl">
                                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                        <Clock className="w-5 h-5 text-primary-500" /> المواعيد والجدول
                                    </h3>
                                    <div className="space-y-4">
                                        {course.daysPerWeek?.length > 0 ? (
                                            course.daysPerWeek.map(day => (
                                                <div key={day} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                                    <span className="text-sm font-black text-slate-700">{daysMap[day] || day}</span>
                                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm">دورية أسبوعية</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 font-bold text-xs italic">الجدول سيتم تحديده لاحقاً من قِبل المدرس.</p>
                                        )}
                                    </div>
                                </Card>

                                <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl">
                                    <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                        <Info className="w-5 h-5 text-primary-500" /> إحصائيات الدورة
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">السعة الاستيعابية</p>
                                                <p className="text-sm font-black text-slate-800">{course.maxStudents} طالب كحد أقصى</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
                                                <Calendar className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">بداية المنهج</p>
                                                <p className="text-sm font-black text-slate-800">{course.startAt ? new Date(course.startAt).toLocaleDateString('ar-EG') : 'أغسطس 2024'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Sticky Sidebar - Booking Card */}
                        <div className="lg:col-span-4">
                            <Card className="bg-white border border-slate-100 p-10 rounded-[3.5rem] shadow-2xl sticky top-24 overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-blue-500" />

                                <div className="text-center mb-10">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest mb-4">
                                        <Play className="w-3 h-3 fill-current" /> التسجيل مفتوح الآن
                                    </div>
                                    <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest mb-2">قيمة الاشتراك الشهري</p>
                                    <div className="flex items-baseline justify-center gap-2">
                                        <h3 className="text-6xl font-black text-slate-900 tracking-tighter">{course.pricePerMonth}</h3>
                                        <span className="text-lg font-bold text-slate-400">ج.م</span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-10">
                                    {[
                                        'حضور مباشر وتفاعلي',
                                        'مرفقات وملفات PDF دورية',
                                        'اختبارات تقييم أسبوعية',
                                        'شهادة عند نهاية المقرر'
                                    ].map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 text-slate-500">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={handleBooking}
                                    className="w-full h-18 rounded-3xl bg-slate-900 text-white font-black hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 text-lg transition-transform hover:scale-[1.02]"
                                >
                                    {isAuthenticated && isStudent ? 'احجز مكانك الآن' : 'سجل لحجز المادة'}
                                    <ChevronLeft className="w-5 h-5" />
                                </Button>

                                <div className="mt-8 pt-8 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4 text-primary-500" /> بوابة تسجيل آمنة تماماً
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <HelpCircle className="w-4 h-4 text-primary-500" /> تواصل معنا لأي استفسار
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default CourseDetails;
