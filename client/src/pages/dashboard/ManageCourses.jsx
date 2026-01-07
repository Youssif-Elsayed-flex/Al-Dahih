import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Search,
    Edit,
    Trash2,
    Clock,
    Users,
    DollarSign,
    CheckCircle,
    X,
    Image as ImageIcon,
    LayoutGrid,
    ChevronRight,
    GraduationCap,
    AlertCircle
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import Swal from 'sweetalert2';

const ManageCourses = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const { data: courses, isLoading } = useQuery({
        queryKey: ['admin-courses'],
        queryFn: async () => {
            const { data } = await axios.get('/courses');
            return data.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (editingCourse) {
                return axios.patch(`/courses/${editingCourse._id}`, data);
            }
            return axios.post('/courses', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-courses']);
            setIsFormOpen(false);
            setEditingCourse(null);
            reset();
            Swal.fire({
                icon: 'success',
                title: editingCourse ? 'تم تحديث المادة بنجاح' : 'تم إضافة المادة بنجاح',
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
        mutationFn: (id) => axios.delete(`/courses/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-courses']);
            Swal.fire({
                icon: 'success',
                title: 'تم حذف المادة بنجاح',
                background: '#ffffff',
                color: '#0f172a'
            });
        }
    });

    const onSubmit = (data) => {
        // Convert comma-separated days to array if needed
        if (typeof data.daysPerWeek === 'string') {
            data.daysPerWeek = data.daysPerWeek.split(',').map(d => d.trim());
        }
        mutation.mutate(data);
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setValue('title', course.title);
        setValue('description', course.description);
        setValue('pricePerMonth', course.pricePerMonth);
        setValue('maxStudents', course.maxStudents);
        setValue('gradeLevel', course.gradeLevel);
        setValue('daysPerWeek', course.daysPerWeek?.join(', '));
        setIsFormOpen(true);
    };

    const handleDelete = (id, title) => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف مادة "${title}" وكل بياناتها نهائياً!`,
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

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري استدعاء قائمة المناهج الدراسية..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[45%] h-[45%] bg-blue-100/30 blur-[130px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[45%] h-[45%] bg-primary-100/20 blur-[130px] rounded-full" />
            </div>

            <Container className="relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl font-black text-slate-900 mb-2 flex items-center gap-3">
                            <BookOpen className="w-10 h-10 text-primary-600" />
                            إدارة <span className="text-primary-600">المواد الدراسية</span>
                        </h1>
                        <p className="text-slate-500 font-medium">أضف، عدل، أو احذف المناهج والكورسات المتاحة على المنصة.</p>
                    </motion.div>

                    <Button
                        onClick={() => {
                            setEditingCourse(null);
                            reset();
                            setIsFormOpen(!isFormOpen);
                        }}
                        className={`h-14 px-8 rounded-2xl flex items-center gap-2 font-black transition-all ${isFormOpen ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200'
                            }`}
                    >
                        {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        {isFormOpen ? 'إغلاق النموذج' : 'إضافة مادة جديدة'}
                    </Button>
                </div>

                {/* Form Section */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="mb-12"
                        >
                            <Card className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                                <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-800">
                                    <Edit className="w-5 h-5 text-primary-500" />
                                    {editingCourse ? 'تعديل بيانات المادة' : 'إنشاء منهج دراسي جديد'}
                                </h3>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        <div className="space-y-2 col-span-full md:col-span-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">اسم المادة / الكورس</label>
                                            <Input
                                                {...register('title', { required: 'العنوان مطلوب' })}
                                                placeholder="مثال: فيزياء للثانوية العامة"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                error={errors.title?.message}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">المرحلة الدراسية</label>
                                            <Input
                                                {...register('gradeLevel', { required: 'المرحلة مطلوبة' })}
                                                placeholder="مثال: 3 ث"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                error={errors.gradeLevel?.message}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">السعر الشهري</label>
                                            <Input
                                                type="number"
                                                {...register('pricePerMonth', { required: 'السعر مطلوب' })}
                                                placeholder="0"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                icon={<DollarSign className="w-4 h-4" />}
                                                error={errors.pricePerMonth?.message}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">الحد الأقصى للطلاب</label>
                                            <Input
                                                type="number"
                                                {...register('maxStudents', { required: 'العدد مطلوب' })}
                                                placeholder="100"
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                icon={<Users className="w-4 h-4" />}
                                                error={errors.maxStudents?.message}
                                            />
                                        </div>

                                        <div className="space-y-2 lg:col-span-1">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">أيام الدراسة (تفصل بفاصلة)</label>
                                            <Input
                                                {...register('daysPerWeek')}
                                                placeholder="Sunday, Tuesday..."
                                                className="bg-slate-50 border-none h-14 rounded-xl px-5 font-bold"
                                                error={errors.daysPerWeek?.message}
                                            />
                                        </div>

                                        <div className="space-y-2 col-span-full">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">وصف المنهج</label>
                                            <textarea
                                                {...register('description')}
                                                placeholder="اكتب وصفاً جذاباً لمحتوى الكورس..."
                                                className="w-full h-32 bg-slate-50 border-none rounded-2xl p-5 font-bold text-slate-700 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                        <Button
                                            type="submit"
                                            loading={mutation.isPending}
                                            className="bg-primary-600 hover:bg-primary-700 text-white h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary-200 text-lg"
                                        >
                                            {editingCourse ? 'تحديث البيانات' : 'إنشاء المادة الآن'}
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Courses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {courses?.length > 0 ? (
                            courses.map((course, i) => (
                                <motion.div
                                    key={course._id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <Card className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all h-full flex flex-col group overflow-hidden p-0">
                                        {/* Preview Placeholder */}
                                        <div className="h-40 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/50 to-blue-600/50 mix-blend-overlay" />
                                            <BookOpen className="w-12 h-12 text-white/20 group-hover:scale-110 transition-transform" />
                                            <div className="absolute bottom-4 left-4">
                                                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-primary-600 font-black text-xs shadow-lg">
                                                    {course.pricePerMonth} ج.م
                                                </span>
                                            </div>
                                        </div>

                                        <div className="p-8 flex-1 flex flex-col">
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded italic">{course.gradeLevel}</span>
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">مادة دراسية</span>
                                            </div>

                                            <h4 className="text-xl font-black text-slate-800 mb-4 group-hover:text-primary-600 transition-colors line-clamp-1">{course.title}</h4>

                                            <p className="text-slate-400 text-xs font-bold mb-6 line-clamp-2 leading-relaxed flex-1">
                                                {course.description || 'لا يوجد وصف متاح لهذه المادة حالياً.'}
                                            </p>

                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">الطلاب</p>
                                                    <p className="text-sm font-black text-slate-700">{course.maxStudents}</p>
                                                </div>
                                                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">أيام الدراسة</p>
                                                    <p className="text-sm font-black text-slate-700">{course.daysPerWeek?.length || 0}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 pt-6 border-t border-slate-50">
                                                <Button
                                                    onClick={() => handleEdit(course)}
                                                    className="flex-1 bg-slate-900 border-none text-white h-12 rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                                >
                                                    <Edit className="w-4 h-4" /> تعديل المادة
                                                </Button>
                                                <button
                                                    onClick={() => handleDelete(course._id, course.title)}
                                                    className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                                <EmptyState title="لا توجد مواد دراسية" message="ابدأ بإضافة أول منهج دراسي للمنصة الآن!" />
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </Container>
        </div>
    );
};

export default ManageCourses;
