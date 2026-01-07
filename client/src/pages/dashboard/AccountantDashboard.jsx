import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign,
    CheckCircle2,
    Clock,
    Users,
    BookOpen,
    ChevronRight,
    Search,
    CreditCard,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Swal from 'sweetalert2';

const AccountantDashboard = () => {
    const queryClient = useQueryClient();

    // Fetch Pending Payments
    const { data: payments, isLoading } = useQuery({
        queryKey: ['accountant-payments'],
        queryFn: async () => {
            const { data } = await axios.get('/bookings');
            return data.data.filter(b => b.status === 'pending');
        },
    });

    const confirmMutation = useMutation({
        mutationFn: (id) => axios.patch(`/bookings/confirm/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['accountant-payments']);
            Swal.fire({
                icon: 'success',
                title: 'تم تأكيد الدفع بنجاح',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#ffffff',
                color: '#0f172a'
            });
        },
        onError: () => Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء تأكيد العملية',
            background: '#ffffff',
            color: '#0f172a'
        })
    });

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري مراجعة السجلات المالية..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-emerald-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                            <DollarSign className="w-10 h-10 text-emerald-600" />
                            لوحة <span className="text-emerald-600">المحاسبة</span>
                        </h1>
                        <p className="text-slate-500 font-medium">مراجعة المدفوعات وتأكيد الحجوزات المالية بدقة.</p>
                    </motion.div>

                    <div className="flex gap-4">
                        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-sm font-black text-slate-700">
                                {payments?.length || 0} عملية بانتظار التأكيد
                            </span>
                        </div>
                    </div>
                </div>

                {/* Dashboard Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي التدفق</p>
                            <p className="text-xl font-black text-slate-800">نشط</p>
                        </div>
                    </Card>
                    <Card className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">طلبات معلقة</p>
                            <p className="text-xl font-black text-slate-800">{payments?.length || 0}</p>
                        </div>
                    </Card>
                    <Card className="bg-white border border-slate-100 p-6 rounded-3xl shadow-lg flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">طرق الدفع</p>
                            <p className="text-xl font-black text-slate-800">متعددة</p>
                        </div>
                    </Card>
                </div>

                {/* Pending Payments List */}
                <div className="space-y-4">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        عمليات تحتاج لمراجعتك
                    </h3>

                    <AnimatePresence mode="popLayout">
                        {payments?.length > 0 ? (
                            payments.map((payment, i) => (
                                <motion.div
                                    key={payment._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all group">
                                        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
                                            <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                                                    <Users className="w-7 h-7" />
                                                </div>
                                                <div className="text-center md:text-right">
                                                    <h4 className="text-xl font-black text-slate-800 mb-1">{payment.student?.name}</h4>
                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {payment.course?.title}</span>
                                                        <span className="hidden md:block">•</span>
                                                        <span className="text-emerald-600 font-black">جاهز للتحصيل</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                <div className="px-5 py-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3 h-3" /> بانتظار التحصيل
                                                </div>

                                                <Button
                                                    onClick={() => confirmMutation.mutate(payment._id)}
                                                    loading={confirmMutation.isPending && confirmMutation.variables === payment._id}
                                                    className="h-12 px-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-lg shadow-slate-200"
                                                >
                                                    تأكيد العملية
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                <EmptyState title="لا توجد عمليات معلقة" message="كل الحسابات مضبوطة تماماً، القادم أفضل!" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default AccountantDashboard;
