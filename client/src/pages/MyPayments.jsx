import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    DollarSign,
    ArrowUpRight,
    ChevronLeft,
    Receipt,
    Wallet,
    Calendar,
    ArrowRight
} from 'lucide-react';
import axios from '../api/axios.config';
import Container from '../components/common/Container';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

const MyPayments = () => {
    const { data: payments, isLoading } = useQuery({
        queryKey: ['my-payments'],
        queryFn: async () => {
            const { data } = await axios.get('/payments/my');
            return data.data;
        },
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري مراجعة سجلاتك المالية..." />
        </div>
    );

    const statusColors = {
        pending: 'bg-orange-50 text-orange-600 border-orange-100',
        paid: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        failed: 'bg-rose-50 text-rose-600 border-rose-100',
    };

    const statusLabels = {
        pending: 'بانتظار التأكيد',
        paid: 'تم الدفع',
        failed: 'فشل / ملغي',
    };

    const methodIcons = {
        vodafoneCash: <Wallet className="w-4 h-4" />,
        card: <CreditCard className="w-4 h-4" />,
        cash: <DollarSign className="w-4 h-4" />,
    };

    const methodLabels = {
        vodafoneCash: 'فودافون كاش',
        card: 'بطاقة ائتمان',
        cash: 'دفع نقدي',
    };

    const totalPaid = payments?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0) || 0;

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] bg-emerald-100/30 blur-[130px] rounded-full" />
                <div className="absolute bottom-[20%] -right-[5%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Header */}
                <div className="mb-16 text-center lg:text-right">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
                            سجل <span className="text-primary-600">المدفوعات</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg lg:ml-0 lg:mr-auto">
                            تابع كافة عمليات الدفع والاشتراكات الخاصة بك بكل شفافية ووضوح.
                        </p>
                    </motion.div>
                </div>

                <div className="max-w-5xl mx-auto space-y-8">
                    {/* Summary Card */}
                    {payments && payments.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <Card className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 blur-3xl -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-700" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                    <div>
                                        <p className="text-xs font-black text-primary-300 uppercase tracking-widest mb-2 opacity-60">إجمالي مدفوعاتك</p>
                                        <div className="flex items-baseline gap-3">
                                            <h2 className="text-5xl font-black tracking-tight">{totalPaid.toLocaleString()}</h2>
                                            <span className="text-xl font-bold opacity-40 uppercase">ج.م</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-left md:text-right">
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">العمليات الناجحة</p>
                                            <p className="text-xl font-black">{payments.filter(p => p.status === 'paid').length} <span className="text-xs font-medium">عملية</span></p>
                                        </div>
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <Receipt className="w-8 h-8 text-primary-400" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Payments List */}
                    <AnimatePresence mode="popLayout">
                        {payments && payments.length > 0 ? (
                            <div className="space-y-4">
                                {payments.map((payment, i) => (
                                    <motion.div
                                        key={payment._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                                <div className="flex-1 flex items-center gap-6">
                                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                        {methodIcons[payment.method] || <CreditCard className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-800 mb-1">
                                                            {payment.booking?.course?.title || 'اشتراك مادة دراسية'}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(payment.createdAt).toLocaleDateString('ar-EG')}</span>
                                                            <span className="hidden sm:block">•</span>
                                                            <span className="flex items-center gap-1.5">{methodLabels[payment.method]}</span>
                                                            {payment.transId && (
                                                                <>
                                                                    <span className="hidden sm:block">•</span>
                                                                    <span className="text-primary-500">ID: {payment.transId}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-8 justify-between md:justify-end">
                                                    <div className="text-left md:text-right">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المبلغ</p>
                                                        <p className="text-2xl font-black text-slate-800">{payment.amount} <span className="text-[10px]">ج.م</span></p>
                                                    </div>
                                                    <div className={`px-5 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${statusColors[payment.status]}`}>
                                                        {payment.status === 'paid' ? <CheckCircle2 className="w-3.5 h-3.5" /> : payment.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                                        {statusLabels[payment.status]}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-50 rounded-br-full opacity-50" />
                                <Search className="w-20 h-20 mx-auto text-slate-200 mb-6" />
                                <h3 className="text-3xl font-black text-slate-800 mb-4">لا يوجد سجل مدفوعات</h3>
                                <p className="text-slate-500 font-bold mb-10 max-w-sm mx-auto">
                                    لم نجد أي عمليات دفع مسجلة باسمك حتى الآن. ابدأ بحجز مادتك الأولى وتابع مدفوعاتك هنا.
                                </p>
                                <a href="/courses">
                                    <Button className="h-16 px-12 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 shadow-xl shadow-slate-200 flex items-center gap-3 mx-auto transition-transform hover:scale-105">
                                        استكشاف الكورسات والمواد <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                </a>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default MyPayments;
