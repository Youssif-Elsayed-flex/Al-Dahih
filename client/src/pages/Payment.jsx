import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    Wallet,
    DollarSign,
    ShieldCheck,
    Info,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    Phone,
    Copy,
    Receipt,
    HelpCircle,
    Smartphone
} from 'lucide-react';
import axios from '../api/axios.config';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Swal from 'sweetalert2';

const Payment = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [vodafoneCode, setVodafoneCode] = useState('');
    const [showVodafoneInstructions, setShowVodafoneInstructions] = useState(false);
    const [paymentId, setPaymentId] = useState(null);

    const { data: booking, isLoading } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: async () => {
            try {
                const { data } = await axios.get(`/bookings/${bookingId}`);
                return data.data;
            } catch (err) {
                // Mock Mode Fallback
                if (process.env.NODE_ENV !== 'production' && !global.isConnected) {
                    return {
                        _id: bookingId,
                        course: {
                            title: 'كورس تجريبي (وضع المحاكاة)',
                            pricePerMonth: 250
                        },
                        monthYear: '2026-01',
                        status: 'pending'
                    };
                }
                throw err;
            }
        },
    });

    const vodafoneInitMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post('/payments/vodafone-cash', { bookingId });
            return data.data;
        },
        onSuccess: (data) => {
            setPaymentId(data.paymentId);
            setShowVodafoneInstructions(true);
        },
    });

    const vodafoneConfirmMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axios.post('/payments/confirm-vodafone', {
                paymentId,
                transId: vodafoneCode,
            });
            return data;
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'تم إرسال الطلب بنجاح',
                text: 'سيتم مراجعة الطلب وتفعيل الكورس في أقرب وقت ممكن.',
                background: '#ffffff',
                color: '#0f172a',
                confirmButtonColor: '#0ea5e9'
            }).then(() => {
                navigate('/my-payments');
            });
        },
    });

    const handlePaymentMethodSelect = (method) => {
        setPaymentMethod(method);
        if (method === 'vodafoneCash') {
            vodafoneInitMutation.mutate();
        }
    };

    const handleVodafoneConfirm = () => {
        if (!vodafoneCode || vodafoneCode.length < 5) {
            Swal.fire({
                icon: 'error',
                title: 'خطوات غير مكتملة',
                text: 'الرجاء إدخال كود التحويل المكون من فودافون كاش',
                background: '#ffffff',
                color: '#0f172a'
            });
            return;
        }
        vodafoneConfirmMutation.mutate();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        Swal.fire({
            icon: 'success',
            title: 'تم النسخ',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            background: '#ffffff',
            color: '#0f172a'
        });
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تجهيز بوابة الدفع..." />
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-center p-10 bg-white rounded-[3rem] shadow-xl max-w-sm border border-slate-100">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">خطأ في الطلب</h2>
                <p className="text-slate-500 font-bold mb-8">عذراً، لم نتمكن من العثور على تفاصيل هذا الحجز.</p>
                <Button onClick={() => navigate('/my-courses')} className="w-full h-14 rounded-2xl bg-slate-900 text-white font-black">عودة لحجوزاتي</Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 relative overflow-hidden font-header">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] -right-[5%] w-[45%] h-[45%] bg-emerald-100/40 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] -left-[10%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-4"
                        >
                            إتمام عملية <span className="text-primary-600">الدفع</span>
                        </motion.h1>
                        <p className="text-slate-500 font-medium max-w-lg mx-auto">اختر الطريقة المفضلة لديك لإتمام اشتراكك في الكورس بنجاح.</p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-10">
                        {/* Main Payment Section */}
                        <div className="lg:col-span-8 space-y-8">
                            <Card className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl">
                                <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                    <Smartphone className="w-6 h-6 text-primary-600" /> طرق الدفع المتاحة
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Vodafone Cash Choice */}
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handlePaymentMethodSelect('vodafoneCash')}
                                        className={`p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all flex flex-col items-center text-center relative overflow-hidden h-64 justify-center ${paymentMethod === 'vodafoneCash'
                                            ? 'border-primary-600 bg-primary-50/50'
                                            : 'border-slate-50 bg-slate-50 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-xl transition-all ${paymentMethod === 'vodafoneCash' ? 'bg-primary-600 text-white shadow-primary-100' : 'bg-white text-slate-300'
                                            }`}>
                                            <Wallet className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-2">فودافون كاش</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">تحويل فوري عبر المحفظة</p>

                                        {paymentMethod === 'vodafoneCash' && (
                                            <div className="absolute top-6 left-6 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-200">
                                                <CheckCircle2 className="w-5 h-5 text-white" />
                                            </div>
                                        )}
                                    </motion.div>

                                    {/* Cash Payment Info */}
                                    <div className="p-8 rounded-[2.5rem] border-2 border-slate-50 bg-slate-50/50 flex flex-col items-center text-center h-64 justify-center opacity-60">
                                        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center text-slate-300 mb-6 shadow-sm">
                                            <DollarSign className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 mb-2">الدفع النقدي</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">متوفر قريباً في الفروع</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Detailed Instructions for Vodafone */}
                            <AnimatePresence>
                                {showVodafoneInstructions && vodafoneInitMutation.data && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                    >
                                        <Card className="bg-white border-2 border-primary-500 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 left-0 w-24 h-24 bg-primary-50 rounded-br-full opacity-50 group-hover:scale-125 transition-transform" />

                                            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-3">
                                                <Info className="w-6 h-6 text-primary-500" /> تعليمات التحويل
                                            </h3>

                                            <div className="space-y-8 relative z-10">
                                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                    <div className="flex-1">
                                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">رقم فودافون كاش الخاص بنا</p>
                                                        <p className="text-3xl font-black text-primary-600 tracking-wider">
                                                            {vodafoneInitMutation.data.vodafoneNumber}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        onClick={() => copyToClipboard(vodafoneInitMutation.data.vodafoneNumber)}
                                                        className="h-14 px-8 rounded-2xl bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 font-black flex items-center gap-2 shadow-sm"
                                                    >
                                                        <Copy className="w-5 h-5" /> نسخ الرقم
                                                    </Button>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-4">
                                                    {[
                                                        { step: '1', text: 'حول المبلغ المطلوب للرقم الموضح أعلاه' },
                                                        { step: '2', text: 'احتفظ بكود التحويل (Transaction ID)' },
                                                        { step: '3', text: 'أدخل الكود بالأسفل لتأكيد الاشتراك' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-5 rounded-2xl bg-slate-50/50 flex items-start gap-4">
                                                            <span className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center font-black text-xs shrink-0">{item.step}</span>
                                                            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">{item.text}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-6">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-4 mr-2">كود التحويل (أدخل الكود هنا)</label>
                                                    <div className="relative group">
                                                        <Input
                                                            placeholder="أدخل كود التحويل هنا..."
                                                            value={vodafoneCode}
                                                            onChange={(e) => setVodafoneCode(e.target.value)}
                                                            className="h-20 rounded-[1.5rem] px-8 font-black text-xl bg-slate-50 border-slate-100 focus:bg-white transition-all pr-16"
                                                        />
                                                        <Wallet className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-primary-500 transition-colors" />
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handleVodafoneConfirm}
                                                    loading={vodafoneConfirmMutation.isPending}
                                                    disabled={vodafoneConfirmMutation.isPending}
                                                    className="w-full h-20 rounded-[2rem] bg-slate-900 text-white font-black hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center justify-center gap-4 text-xl transition-transform hover:scale-[1.01]"
                                                >
                                                    تأكيد الدفع وإرسال الطلب <ChevronLeft className="w-7 h-7" />
                                                </Button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sidebar Order Summary */}
                        <div className="lg:col-span-4 space-y-6">
                            <Card className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-xl sticky top-24">
                                <h3 className="text-xl font-black text-slate-800 mb-8 border-b border-slate-50 pb-6 flex items-center gap-3">
                                    <Receipt className="w-5 h-5 text-slate-400" /> ملخص الاشتراك
                                </h3>

                                <div className="space-y-8 mb-10">
                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">المادة الدراسية</p>
                                        <p className="text-lg font-black text-slate-800 leading-tight">
                                            {booking.course.title}
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">تاريخ الاشتراك</p>
                                        <p className="text-lg font-black text-slate-800">
                                            {new Date(booking.monthYear + '-01').toLocaleDateString('ar-EG', {
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-slate-50">
                                    <div className="flex justify-between items-center text-slate-500 font-bold">
                                        <span className="text-sm">السعر الشهري</span>
                                        <span className="text-lg">{booking.course.pricePerMonth} <span className="text-[10px]">ج.م</span></span>
                                    </div>

                                    <div className="flex justify-between items-center py-6 px-1 border-t border-slate-50 mt-4">
                                        <span className="text-lg font-black text-slate-900">الإجمالي</span>
                                        <div className="text-right">
                                            <span className="text-3xl font-black text-primary-600">
                                                {booking.course.pricePerMonth}
                                            </span>
                                            <span className="text-sm font-black text-primary-600 block leading-none">جنيه مصري</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-50 space-y-4">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                        <ShieldCheck className="w-4 h-4" /> مدفوعات آمنة 100%
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <HelpCircle className="w-4 h-4" /> تحتاج مساعدة؟ تواصل معنا
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Payment;
