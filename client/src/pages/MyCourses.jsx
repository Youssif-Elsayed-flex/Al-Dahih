import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Calendar,
    ArrowRight,
    PlayCircle,
    CheckCircle2,
    Clock,
    Search,
    Info,
    ChevronLeft
} from 'lucide-react';
import axios from '../api/axios.config';
import Container from '../components/common/Container';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MyCourses = () => {
    const { data: bookings, isLoading } = useQuery({
        queryKey: ['my-bookings'],
        queryFn: async () => {
            const { data } = await axios.get('/bookings/my');
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري استدعاء كورساتك..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Soft Ambient Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] -right-[5%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] -left-[5%] w-[35%] h-[35%] bg-primary-100/30 blur-[100px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Header */}
                <div className="mb-16 text-center lg:text-right">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            رحلتي <span className="text-primary-600">التعليمية</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg lg:ml-0 lg:mr-auto">
                            هنا تجد كافة المواد التي اشتركت بها، ابدأ الان وتعلم بذكاء.
                        </p>
                    </motion.div>

                    {bookings?.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 inline-flex items-center gap-4 bg-white p-2 pr-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-50"
                        >
                            <span className="text-sm font-black text-slate-700">لديك {bookings.length} مواد مسجلة</span>
                            <div className="w-10 h-10 bg-primary-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Courses List */}
                <AnimatePresence mode="popLayout">
                    {bookings && bookings.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {bookings.map((booking, i) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Card className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl overflow-hidden h-full flex flex-col group hover:shadow-2xl transition-all duration-500">
                                        {/* Image Section */}
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={booking.course?.coverImage || '/placeholder-course.jpg'}
                                                alt={booking.course?.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                            <div className="absolute top-6 left-6">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl backdrop-blur-md ${booking.status === 'confirmed'
                                                        ? 'bg-emerald-500/90 text-white'
                                                        : booking.status === 'pending'
                                                            ? 'bg-orange-500/90 text-white'
                                                            : 'bg-rose-500/90 text-white'
                                                    }`}>
                                                    {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'pending' ? 'بانتظار التأكيد' : 'ملغي'}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Content Section */}
                                        <div className="p-8 flex-1 flex flex-col">
                                            <h3 className="text-2xl font-black text-slate-800 mb-6 group-hover:text-primary-600 transition-colors">
                                                {booking.course?.title}
                                            </h3>

                                            <div className="space-y-4 mb-8 flex-1">
                                                <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <span>دفعة: {new Date(booking.monthYear + '-01').toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}</span>
                                                </div>

                                                <div className="flex items-center gap-3 text-sm font-bold text-slate-500">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                                        <Clock className="w-4 h-4" />
                                                    </div>
                                                    <span>تم الحجز: {new Date(booking.createdAt).toLocaleDateString('ar-EG')}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="pt-6 border-t border-slate-50">
                                                {booking.status === 'confirmed' ? (
                                                    <Button className="w-full h-14 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 flex items-center justify-center gap-3 font-black shadow-lg shadow-slate-200 transition-all group/btn">
                                                        <PlayCircle className="w-5 h-5 group-btn:scale-110 transition-transform" /> دخول المحاضرة
                                                    </Button>
                                                ) : booking.status === 'pending' ? (
                                                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex items-start gap-3">
                                                        <Info className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                                                        <p className="text-[11px] font-black text-orange-800 leading-relaxed">
                                                            حجزك قيد المراجعة حالياً. سيتم تفعيل المحاضرة فور تأكيد عملية الدفع من قِبل الإدارة.
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <Button variant="outline" className="w-full h-14 rounded-2xl font-black border-rose-100 text-rose-500 hover:bg-rose-50">
                                                        الحجز ملغي - تواصل معنا
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-full opacity-50" />
                            <Search className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                            <h3 className="text-3xl font-black text-slate-800 mb-4">لا توجد كورسات بعد</h3>
                            <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">
                                يبدو أنك لم تبدأ رحلتك التعليمية معنا بعد. استكشف أقوى الكورسات وابدأ الآن!
                            </p>
                            <a href="/courses">
                                <Button className="h-16 px-12 rounded-2xl bg-primary-600 text-white font-black hover:bg-primary-700 shadow-xl shadow-primary-200 flex items-center gap-2 mx-auto transition-transform hover:scale-105">
                                    استعراض الكورسات المتاحة <ChevronLeft className="w-5 h-5" />
                                </Button>
                            </a>
                        </div>
                    )}
                </AnimatePresence>
            </Container>
        </div>
    );
};

export default MyCourses;
