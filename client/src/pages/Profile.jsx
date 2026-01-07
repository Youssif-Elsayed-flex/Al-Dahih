import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import {
    User,
    Mail,
    Phone,
    Calendar,
    GraduationCap,
    Camera,
    Save,
    X,
    Edit2,
    ChevronRight,
    Lock,
    Settings,
    ShieldCheck
} from 'lucide-react';
import axios from '../api/axios.config';
import { useAuth } from '../context/AuthContext';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Loading from '../components/common/Loading';
import Card from '../components/common/Card';
import Swal from 'sweetalert2';

const Profile = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            const { data } = await axios.get('/students/my-profile');
            reset(data.data);
            return data.data;
        },
        enabled: !!user,
    });

    const updateMutation = useMutation({
        mutationFn: async (formData) => {
            const { data } = await axios.patch('/students/update-profile', formData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['profile']);
            setIsEditing(false);
            Swal.fire({
                icon: 'success',
                title: 'تم تحديث ملفك الشخصي بنجاح',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                background: '#ffffff',
                color: '#0f172a'
            });
        },
    });

    const onSubmit = (data) => updateMutation.mutate(data);

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loading message="جاري تجهيز ملفك الشخصي..." />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden font-header">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] -left-[5%] w-[40%] h-[40%] bg-blue-100/40 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-primary-100/30 blur-[120px] rounded-full" />
            </div>

            <Container className="relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Header Header */}
                    <div className="mb-12 text-center md:text-right">
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-black text-slate-900 mb-2"
                        >
                            ملفك <span className="text-primary-600">الشخصي</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 font-medium"
                        >
                            تحكم في بياناتك وتابع رحلتك التعليمية معنا بكل سهولة.
                        </motion.p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Profile Sidebar */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl text-center relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 to-blue-500" />

                                <div className="relative inline-block mb-6 pt-4">
                                    <div className="w-32 h-32 mx-auto rounded-[2.5rem] bg-slate-100 flex items-center justify-center text-4xl font-black text-primary-600 shadow-inner group-hover:scale-105 transition-transform duration-500">
                                        {profile?.name?.[0] || 'S'}
                                    </div>
                                    <button className="absolute bottom-0 left-0 w-10 h-10 bg-white border border-slate-100 shadow-lg rounded-xl flex items-center justify-center text-slate-400 hover:text-primary-500 transition-colors">
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-1">{profile?.name}</h2>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{profile?.email}</p>

                                <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[10px] font-black uppercase tracking-widest mx-auto w-max mb-8">
                                    <ShieldCheck className="w-3.5 h-3.5" /> حساب طالب نشط
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-8 mt-2">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المرحلة</p>
                                        <p className="font-black text-slate-800 text-xs">{profile?.educationLevel || 'غير محدد'}</p>
                                    </div>
                                    <div className="border-r border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">انضم منذ</p>
                                        <p className="font-black text-slate-800 text-xs">{new Date(profile?.createdAt).toLocaleDateString('ar-EG')}</p>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-xl">
                                <h3 className="text-sm font-black text-slate-900 mb-6 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-slate-400" /> إعدادات سريعة
                                </h3>
                                <div className="space-y-4">
                                    <button className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                        <span className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                            <Lock className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" /> تغيير كلمة المرور
                                        </span>
                                        <ChevronRight className="w-4 h-4 text-slate-200" />
                                    </button>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Profile Settings Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="lg:col-span-2"
                        >
                            <Card className="bg-white border border-slate-100 p-10 rounded-[2.5rem] shadow-xl h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <h3 className="text-2xl font-black text-slate-800">تحرير البيانات</h3>
                                    {!isEditing && (
                                        <Button
                                            onClick={() => setIsEditing(true)}
                                            className="h-12 px-6 rounded-xl bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2 font-black shadow-lg shadow-slate-200"
                                        >
                                            <Edit2 className="w-4 h-4" /> تعديل الملف
                                        </Button>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">الاسم الكامل</label>
                                            <Input
                                                {...register('name', { required: 'الاسم مطلوب' })}
                                                disabled={!isEditing}
                                                className={`h-14 rounded-xl px-5 font-bold transition-all ${isEditing ? 'bg-slate-50' : 'bg-transparent border-none'}`}
                                                error={errors.name?.message}
                                                icon={<User className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني (غير قابل للتعديل)</label>
                                            <Input
                                                {...register('email')}
                                                disabled={true}
                                                className="h-14 rounded-xl px-5 font-bold bg-transparent border-none opacity-60"
                                                icon={<Mail className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">رقم الهاتف</label>
                                            <Input
                                                {...register('phone')}
                                                disabled={!isEditing}
                                                className={`h-14 rounded-xl px-5 font-bold transition-all ${isEditing ? 'bg-slate-50' : 'bg-transparent border-none'}`}
                                                icon={<Phone className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">رقم ولي الأمر</label>
                                            <Input
                                                {...register('parentPhone')}
                                                disabled={!isEditing}
                                                className={`h-14 rounded-xl px-5 font-bold transition-all ${isEditing ? 'bg-slate-50' : 'bg-transparent border-none'}`}
                                                icon={<Phone className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">تاريخ الميلاد</label>
                                            <Input
                                                type="date"
                                                {...register('birthDate')}
                                                disabled={!isEditing}
                                                className={`h-14 rounded-xl px-5 font-bold transition-all ${isEditing ? 'bg-slate-50' : 'bg-transparent border-none'}`}
                                                icon={<Calendar className="w-4 h-4" />}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">المستوى التعليمي / الدراسي</label>
                                            <Input
                                                {...register('educationLevel')}
                                                disabled={!isEditing}
                                                className={`h-14 rounded-xl px-5 font-bold transition-all ${isEditing ? 'bg-slate-50' : 'bg-transparent border-none'}`}
                                                icon={<GraduationCap className="w-4 h-4" />}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isEditing && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className="flex gap-4 pt-4"
                                            >
                                                <Button
                                                    type="submit"
                                                    loading={updateMutation.isPending}
                                                    className="h-14 px-10 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 font-black flex items-center gap-2 shadow-xl shadow-primary-100"
                                                >
                                                    <Save className="w-5 h-5" /> حفظ المعلومات
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={() => {
                                                        setIsEditing(false);
                                                        reset(profile);
                                                    }}
                                                    className="h-14 px-6 rounded-2xl font-black text-slate-400"
                                                >
                                                    إلغاء
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </form>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default Profile;
