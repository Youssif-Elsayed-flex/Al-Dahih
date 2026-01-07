import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    UserPlus,
    Filter,
    MoreVertical,
    Phone,
    Mail,
    GraduationCap,
    CheckCircle2,
    XCircle,
    ChevronDown,
    Trash2,
    Eye,
    MessageSquare
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Swal from 'sweetalert2';

const ManageStudents = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: students, isLoading } = useQuery({
        queryKey: ['admin-students', statusFilter],
        queryFn: async () => {
            const { data } = await axios.get('/students', {
                params: statusFilter !== 'all' ? { status: statusFilter } : {}
            });
            return data.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(`/students/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-students']);
            Swal.fire({
                icon: 'success',
                title: 'تم حذف الطالب بنجاح',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#ffffff',
                color: '#0f172a'
            });
        }
    });

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف بيانات الطالب "${name}" نهائياً من النظام!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e11d48',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'نعم، احذف',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                deleteMutation.mutate(id);
            }
        });
    };

    const filteredStudents = students?.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري استدعاء سجلات الطلاب..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Soft Ambient Background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[5%] -left-[5%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] -right-[5%] w-[35%] h-[35%] bg-primary-100/30 blur-[100px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                            <Users className="w-10 h-10 text-primary-600" />
                            إدارة <span className="text-primary-600">الطلاب</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-tight">متابعة كافة الطلاب المسجلين، إدارة حساباتهم، والتواصل معهم.</p>
                    </motion.div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white px-6 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                            <span className="text-sm font-black text-slate-700">إجمالي الطلاب:</span>
                            <span className="text-xl font-black text-primary-600">{students?.length || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-2 relative">
                        <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="ابحث بالاسم، برقم الهاتف، أو البريد..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-16 pr-14 pl-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all font-bold text-slate-700 placeholder:text-slate-300"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full h-16 pr-14 pl-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500/50 outline-none transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                        >
                            <option value="all">كافة الحالات</option>
                            <option value="active">نشط</option>
                            <option value="pending">بانتظار التفعيل</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                        <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    </div>

                    <Button className="h-16 rounded-[1.5rem] bg-slate-900 text-white font-black hover:bg-slate-800 shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
                        <UserPlus className="w-5 h-5" /> إضافة طالب يدوي
                    </Button>
                </div>

                {/* Students List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student, i) => (
                                <motion.div
                                    key={student._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="bg-white border border-slate-100 p-6 md:p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                            {/* Student Identity */}
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors shrink-0">
                                                    <GraduationCap className="w-8 h-8" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-xl font-black text-slate-800">{student.name}</h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400 tracking-tight">
                                                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {student.phone}</span>
                                                        <span className="hidden sm:block opacity-30">•</span>
                                                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {student.email}</span>
                                                        <span className="hidden sm:block opacity-30">•</span>
                                                        <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> مسجل منذ {new Date(student.createdAt).toLocaleDateString('ar-EG')}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Activity & Stats */}
                                            <div className="flex flex-wrap items-center gap-6 shrink-0 bg-slate-50/50 p-4 rounded-3xl border border-slate-100/50">
                                                <div className="text-center px-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الكورسات</p>
                                                    <p className="text-lg font-black text-slate-800">{student.activeCourses?.length || 0}</p>
                                                </div>
                                                <div className="w-px h-8 bg-slate-200" />
                                                <div className="text-center px-4">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المدفوعات</p>
                                                    <p className="text-lg font-black text-slate-800">{student.totalPayments || 0} <span className="text-[10px]">ج.م</span></p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Button className="h-12 w-12 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-400 hover:text-primary-600 flex items-center justify-center p-0 transition-all border border-transparent hover:border-primary-100">
                                                    <MessageSquare className="w-5 h-5" />
                                                </Button>
                                                <Button className="h-12 w-12 rounded-xl bg-slate-50 hover:bg-primary-50 text-slate-400 hover:text-primary-600 flex items-center justify-center p-0 transition-all border border-transparent hover:border-primary-100 text-xs font-black">
                                                    <Eye className="w-5 h-5" />
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(student._id, student.name)}
                                                    className="h-12 w-12 rounded-xl bg-rose-50 hover:bg-rose-500 text-rose-500 hover:text-white flex items-center justify-center p-0 transition-all border border-rose-100/50 hover:border-rose-500 shadow-sm"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="py-32 bg-white rounded-[4rem] border border-slate-100 shadow-sm overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full opacity-50" />
                                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-50 rounded-tr-full opacity-20" />
                                <EmptyState
                                    icon="🔍"
                                    title="لا يوجد طلاب"
                                    message={searchTerm ? `لم نجد أي نتائج تطابق "${searchTerm}" في قاعدة البيانات.` : "لا يوجد طلاب مسجلين في هذا القسم حالياً."}
                                    action={searchTerm ? () => setSearchTerm('') : null}
                                    actionLabel="عرض كافة الطلاب"
                                />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default ManageStudents;
