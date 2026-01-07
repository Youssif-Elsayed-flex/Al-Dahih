import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCheck,
    UserPlus,
    X,
    Edit3,
    Trash2,
    Mail,
    Shield,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Users
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Swal from 'sweetalert2';

const ManageEmployees = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const { data: employees, isLoading } = useQuery({
        queryKey: ['admin-employees'],
        queryFn: async () => {
            const { data } = await axios.get('/employees');
            return data.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (editingEmployee) {
                return axios.patch(`/employees/${editingEmployee._id}`, data);
            }
            return axios.post('/employees', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-employees']);
            setIsFormOpen(false);
            setEditingEmployee(null);
            reset();
            Swal.fire({
                icon: 'success',
                title: editingEmployee ? 'تم تحديث البيانات بنجاح' : 'تم إضافة الموظف بنجاح',
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

    const deleteMutation = useMutation({
        mutationFn: (id) => axios.delete(`/employees/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-employees']);
            Swal.fire({
                icon: 'success',
                title: 'تم حذف الحساب بنجاح',
                background: '#ffffff',
                color: '#0f172a'
            });
        }
    });

    const onSubmit = (data) => mutation.mutate(data);

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setValue('name', employee.name);
        setValue('email', employee.email);
        setValue('role', employee.role);
        setValue('salary', employee.salary);
        setIsFormOpen(true);
    };

    const handleDelete = (id, name) => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف حساب الموظف "${name}" نهائياً!`,
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

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return { label: 'مسؤول نظام', color: 'bg-purple-50 text-purple-600 border-purple-100' };
            case 'teacher': return { label: 'مدرس', color: 'bg-blue-50 text-blue-600 border-blue-100' };
            case 'accountant': return { label: 'محاسب', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' };
            default: return { label: 'موظف', color: 'bg-slate-50 text-slate-600 border-slate-100' };
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري استدعاء فريق العمل..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-purple-100/30 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                            <UserCheck className="w-10 h-10 text-primary-600" />
                            إدارة <span className="text-primary-600">فريق العمل</span>
                        </h1>
                        <p className="text-slate-500 font-medium">نظم صلاحيات ومهام الموظفين والمدرسين في منصتك.</p>
                    </motion.div>

                    <Button
                        onClick={() => {
                            setEditingEmployee(null);
                            reset();
                            setIsFormOpen(!isFormOpen);
                        }}
                        className={`h-14 px-8 rounded-2xl flex items-center gap-2 font-black transition-all ${isFormOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
                            }`}
                    >
                        {isFormOpen ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        {isFormOpen ? 'إغلاق النموذج' : 'إضافة موظف جديد'}
                    </Button>
                </div>

                {/* Form Section */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-12"
                        >
                            <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800">
                                    <Edit3 className="w-5 h-5 text-primary-500" />
                                    {editingEmployee ? 'تعديل بيانات الحساب' : 'إنشاء حساب موظف جديد'}
                                </h3>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                                            <Input
                                                {...register('name', { required: 'الاسم مطلوب' })}
                                                placeholder="أدخل اسم الموظف"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                error={errors.name?.message}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                            <Input
                                                {...register('email', { required: 'البريد مطلوب', pattern: { value: /^\S+@\S+$/i, message: 'بريد غير صحيح' } })}
                                                placeholder="email@example.com"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                icon={<Mail className="w-4 h-4" />}
                                                error={errors.email?.message}
                                            />
                                        </div>

                                        {!editingEmployee && (
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">كلمة المرور</label>
                                                <Input
                                                    type="password"
                                                    {...register('password', { required: 'كلمة المرور مطلوبة', minLength: { value: 6, message: '6 أحرف على الأقل' } })}
                                                    placeholder="••••••••"
                                                    className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                    error={errors.password?.message}
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">الدور الوظيفي</label>
                                            <select
                                                {...register('role', { required: 'الدور مطلوب' })}
                                                className="w-full h-14 bg-slate-50 border-none rounded-xl px-5 font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                                            >
                                                <option value="">اختر الدور...</option>
                                                <option value="admin">مسؤول نظام (Admin)</option>
                                                <option value="teacher">مدرس (Teacher)</option>
                                                <option value="accountant">محاسب (Accountant)</option>
                                            </select>
                                            {errors.role && <span className="text-rose-500 text-[10px] font-black">{errors.role.message}</span>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">الراتب الشهري (مثال)</label>
                                            <Input
                                                type="number"
                                                {...register('salary')}
                                                placeholder="أدخل مبلغ الراتب"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                icon={<DollarSign className="w-4 h-4" />}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            loading={mutation.isPending}
                                            className="bg-primary-600 hover:bg-primary-700 text-white h-14 px-10 rounded-2xl font-black shadow-xl shadow-primary-200"
                                        >
                                            {editingEmployee ? 'حفظ التعديلات' : 'إنشاء الحساب الآن'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Employees List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {employees?.length > 0 ? (
                            employees.map((emp, i) => {
                                const role = getRoleBadge(emp.role);
                                return (
                                    <motion.div
                                        key={emp._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                    >
                                        <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all h-full flex flex-col group">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                    <Users className="w-7 h-7" />
                                                </div>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${role.color}`}>
                                                    {role.label}
                                                </div>
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="text-xl font-black text-slate-800 mb-1">{emp.name}</h4>
                                                <p className="text-slate-400 text-xs font-bold mb-6 flex items-center gap-2">
                                                    <Mail className="w-3.5 h-3.5" /> {emp.email}
                                                </p>

                                                {emp.salary && (
                                                    <div className="bg-slate-50 p-4 rounded-2xl mb-6">
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">الراتب الحالي</p>
                                                        <p className="text-lg font-black text-slate-800">{emp.salary.toLocaleString()} <span className="text-[10px]">ج.م</span></p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                                                <Button
                                                    onClick={() => handleEdit(emp)}
                                                    className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border-none h-12 rounded-xl text-xs font-black flex items-center justify-center gap-2"
                                                >
                                                    <Edit3 className="w-4 h-4" /> تعديل
                                                </Button>
                                                <button
                                                    onClick={() => handleDelete(emp._id, emp.name)}
                                                    className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </Card>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                <EmptyState title="لا يوجد موظفين" message="ابدأ ببناء فريق أحلامك لإدارة المنصة باحترافية!" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default ManageEmployees;
