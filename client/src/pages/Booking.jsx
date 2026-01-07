import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    BookOpen,
    User,
    ArrowRight,
    Check,
    Info,
    Lock,
    CreditCard,
    DollarSign,
    ChevronLeft,
    Clock
} from 'lucide-react';
import axios from '../api/axios.config';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Swal from 'sweetalert2';

const Booking = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [selectedMonth, setSelectedMonth] = useState('');

    const { data: course, isLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data } = await axios.get(`/courses/${courseId}`);
            return data.data;
        },
    });

    const createBookingMutation = useMutation({
        mutationFn: async (monthYear) => {
            const { data } = await axios.post('/bookings', {
                courseId,
                monthYear,
            });
            return data;
        },
        onSuccess: (data) => {
            navigate(`/payment/${data.data._id}`);
        },
    });

    const getMonthOptions = () => {
        const options = [];
        const today = new Date();
        for (let i = 0; i < 3; i++) {
            const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
            const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const monthName = date.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' });
            options.push({ value: monthYear, label: monthName });
        }
        return options;
    };

    const handleBooking = () => {
        if (!selectedMonth) {
            Swal.fire({
                icon: 'warning',
                title: 'تنبيه',
                text: 'الرجاء اختيار الشهر الذي تود بدء الاشتراك فيه',
                background: '#ffffff',
                color: '#0f172a'
            });
            return;
        }
        createBookingMutation.mutate(selectedMonth);
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تجهيز بيانات الحجز..." />
        </div>
    );

    if (!course) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center p-12 bg-white rounded-[3rem] shadow-xl border border-slate-100 max-w-sm">
                <div className="text-6xl mb-6">🤷‍♂️</div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">المادة غير متاحة</h2>
                <p className="text-slate-500 font-bold mb-8">ربما تم حذف هذه المادة أو الرابط غير صحيح.</p>
                <Button onClick={() => navigate('/courses')} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">
                    العودة للمواد المتاحة
                </Button>
            </div>
        </div>
    );

    const monthOptions = getMonthOptions();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden font-header">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 blur-[140px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[10%] w-[45%] h-[45%] bg-primary-100/30 blur-[130px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Header */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
                        >
                            <Lock className="w-3 h-3" /> خطوة واحدة تفصلك عن النجاح
                        </motion.div>
                        <h1 className="text-5xl font-black text-slate-900 mb-4">
                            تأكيد <span className="text-primary-600">اشتراكك</span>
                        </h1>
                        <p className="text-slate-500 font-medium">خطوتك الأخيرة للانضمام لأقوى منصة تعليمية.</p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Course Summary Sidebar */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl overflow-hidden relative group">
                                <div className="absolute top-0 left-0 w-full h-48 -m-8 mb-8 overflow-hidden">
                                    <img
                                        src={course.coverImage || '/placeholder-course.jpg'}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
                                </div>

                                <div className="relative pt-32">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">{course.title}</h2>
                                    {course.teacher && (
                                        <div className="flex items-center gap-2 text-slate-400 font-bold mb-6 text-sm">
                                            <User className="w-4 h-4" /> {course.teacher.name}
                                        </div>
                                    )}

                                    <div className="space-y-4 pt-6 border-t border-slate-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">المرحلة</span>
                                            <span className="text-sm font-black text-slate-800">{course.gradeLevel}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">المادة</span>
                                            <span className="text-sm font-black text-slate-800">{course.subject}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 blur-2xl -mr-12 -mt-12 group-hover:scale-125 transition-transform" />
                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">قيمة الاشتراك الشهري</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black text-primary-400">{course.pricePerMonth}</h3>
                                    <span className="text-lg font-bold opacity-30">ج.م</span>
                                </div>
                            </Card>
                        </div>

                        {/* Booking Form */}
                        <Card className="lg:col-span-3 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl flex flex-col">
                            <h3 className="text-xl font-black text-slate-800 mb-10 flex items-center gap-3">
                                <Calendar className="w-6 h-6 text-primary-600" />
                                اختر الشهر المُراد حجزه
                            </h3>

                            <div className="grid gap-4 mb-12 flex-1">
                                {monthOptions.map((option) => (
                                    <motion.div
                                        key={option.value}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedMonth(option.value)}
                                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all relative group h-24 flex items-center ${selectedMonth === option.value
                                            ? 'border-primary-600 bg-primary-50/50'
                                            : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between w-full pr-4">
                                            <div className="flex items-center gap-5">
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedMonth === option.value
                                                    ? 'bg-primary-600 border-primary-600'
                                                    : 'border-slate-200'
                                                    }`}>
                                                    {selectedMonth === option.value && <Check className="w-4 h-4 text-white" />}
                                                </div>
                                                <div>
                                                    <p className={`font-black text-lg transition-colors ${selectedMonth === option.value ? 'text-primary-700' : 'text-slate-800'}`}>
                                                        {option.label}
                                                    </p>
                                                    <p className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${selectedMonth === option.value ? 'opacity-60' : 'opacity-30'}`}>
                                                        اشتراك مجموعة {option.label.split(' ')[0]}
                                                    </p>
                                                </div>
                                            </div>
                                            <Clock className={`w-6 h-6 transition-all ${selectedMonth === option.value ? 'text-primary-400 border-none scale-110' : 'text-slate-200 opacity-0'}`} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="pt-8 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                                <Button
                                    variant="outline"
                                    className="h-16 px-8 rounded-2xl border-slate-100 text-slate-400 font-black hover:bg-slate-50 flex items-center gap-2"
                                    onClick={() => navigate(`/courses/${courseId}`)}
                                >
                                    <ArrowRight className="w-5 h-5" /> رجوع
                                </Button>
                                <Button
                                    onClick={handleBooking}
                                    loading={createBookingMutation.isPending}
                                    disabled={!selectedMonth || createBookingMutation.isPending}
                                    className="h-16 flex-1 rounded-2xl bg-primary-600 text-white font-black hover:bg-primary-700 shadow-xl shadow-primary-200 flex items-center justify-center gap-3 text-lg transition-transform hover:scale-[1.02]"
                                >
                                    متابعة لعملية الدفع <ChevronLeft className="w-6 h-6" />
                                </Button>
                            </div>
                        </Card>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Booking;
