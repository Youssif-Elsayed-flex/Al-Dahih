import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Search,
    CheckCircle,
    XCircle,
    User,
    BookOpen,
    Phone,
    Filter,
    ChevronDown,
    MoreVertical,
    Check,
    X,
    AlertCircle,
    ArrowUpRight,
    Clock
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Swal from 'sweetalert2';

const ManageBookings = () => {
    const [filter, setFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: bookings, isLoading } = useQuery({
        queryKey: ['admin-bookings', filter],
        queryFn: async () => {
            const { data } = await axios.get('/bookings', {
                params: filter !== 'all' ? { status: filter } : {}
            });
            return data.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ id, action }) => {
            const endpoint = action === 'confirm' ? `/bookings/confirm/${id}` : `/bookings/cancel/${id}`;
            return axios.patch(endpoint);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['admin-bookings']);
            queryClient.invalidateQueries(['dashboard-stats']);
            Swal.fire({
                icon: 'success',
                title: variables.action === 'confirm' ? 'تم تأكيد الحجز بنجاح' : 'تم إلغاء الحجز بنجاح',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#ffffff',
                color: '#0f172a'
            });
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.message || 'حدث خطأ ما',
                background: '#ffffff',
                color: '#0f172a'
            });
        }
    });

    const handleAction = (id, action, studentName) => {
        const title = action === 'confirm' ? 'تأكيد الحجز؟' : 'إلغاء الحجز؟';
        const text = action === 'confirm'
            ? `سيتم تأكيد حجز الطالب "${studentName}" وبدء احتساب الدورة له.`
            : `سيتم إلغاء طلب حجز الطالب "${studentName}" ونقله للأرشيف.`;

        Swal.fire({
            title,
            text,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: action === 'confirm' ? '#10b981' : '#e11d48',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: action === 'confirm' ? 'نعم، أكد' : 'نعم، إلغاء',
            cancelButtonText: 'تراجع'
        }).then((result) => {
            if (result.isConfirmed) {
                mutation.mutate({ id, action });
            }
        });
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري جلب قائمة الحجوزات..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] bg-emerald-100/30 blur-[130px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[45%] h-[45%] bg-primary-100/30 blur-[130px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                            <Calendar className="w-10 h-10 text-emerald-600" />
                            طلبات <span className="text-emerald-600">الحجز</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">إدارة طلبات الطلاب، تأكيد الحجوزات، أو إلغائها.</p>
                    </motion.div>

                    {/* Filter Tabs */}
                    <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
                        {['all', 'pending', 'confirmed', 'cancelled'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all ${filter === tab
                                        ? 'bg-slate-900 text-white shadow-lg'
                                        : 'text-slate-400 hover:text-slate-600'
                                    }`}
                            >
                                {tab === 'all' ? 'الكل' : tab === 'pending' ? 'معلق' : tab === 'confirmed' ? 'مؤكد' : 'ملغي'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {bookings?.length > 0 ? (
                            bookings.map((booking, i) => (
                                <motion.div
                                    key={booking._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            {/* Student & Course Info */}
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors shrink-0">
                                                    <User className="w-8 h-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-slate-800">{booking.student?.name || 'طالب مجهول'}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                                                        <span className="flex items-center gap-1.5">
                                                            <BookOpen className="w-3.5 h-3.5" /> {booking.course?.title}
                                                        </span>
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone className="w-3.5 h-3.5 text-primary-500" /> {booking.student?.phone}
                                                        </span>
                                                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded text-slate-600 font-black">
                                                            <Clock className="w-3 h-3" /> {booking.monthYear}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Status & Actions */}
                                            <div className="flex flex-col md:flex-row items-center gap-4 shrink-0">
                                                <div className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        booking.status === 'pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'
                                                    }`}>
                                                    {booking.status === 'confirmed' ? 'مؤكد' : booking.status === 'pending' ? 'قيد الانتظار' : 'ملغي'}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                onClick={() => handleAction(booking._id, 'confirm', booking.student?.name)}
                                                                className="h-12 w-12 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center p-0 shadow-lg shadow-emerald-100"
                                                            >
                                                                <Check className="w-5 h-5" />
                                                            </Button>
                                                            <Button
                                                                onClick={() => handleAction(booking._id, 'cancel', booking.student?.name)}
                                                                className="h-12 w-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center p-0 shadow-lg shadow-rose-100"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    {booking.status === 'confirmed' && (
                                                        <Button
                                                            onClick={() => handleAction(booking._id, 'cancel', booking.student?.name)}
                                                            className="h-12 px-6 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 font-black text-[10px] flex items-center gap-2 transition-all"
                                                        >
                                                            <XCircle className="w-4 h-4" /> إلغاء الحجز
                                                        </Button>
                                                    )}
                                                    <div className="w-10 h-10 flex items-center justify-center text-slate-200 hover:text-slate-400 cursor-pointer">
                                                        <ChevronDown className="w-5 h-5" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full" />
                                <EmptyState
                                    title="لا توجد حجوزات"
                                    message={filter === 'all' ? "لم يقم أي طالب بالحجز بعد." : `لا توجد حجوزات بحالة "${filter}" حالياً.`}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default ManageBookings;
