import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
    User,
    Mail,
    Phone,
    Lock,
    ArrowRight,
    GraduationCap,
    Users,
    UserCheck,
    ChevronLeft,
    ShieldCheck,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Swal from 'sweetalert2';

const Register = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role') || 'student';

    const roleConfig = {
        student: { title: 'طالب جديد', icon: <GraduationCap className="w-8 h-8" />, color: 'text-primary-600', bg: 'bg-primary-50' },
        parent: { title: 'ولي أمر', icon: <Users className="w-8 h-8" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        teacher: { title: 'مدرس', icon: <UserCheck className="w-8 h-8" />, color: 'text-blue-600', bg: 'bg-blue-50' }
    };
    const currentConfig = roleConfig[roleParam] || roleConfig.student;

    const { register: formRegister, handleSubmit, formState: { errors }, watch } = useForm();
    const { register: authRegister } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');

        const registrationData = {
            ...data,
            role: roleParam
        };

        const result = await authRegister(registrationData);

        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: 'تم إنشاء الحساب بنجاح',
                text: roleParam === 'teacher' ? 'حسابك قيد المراجعة من الإدارة' : 'مرحباً بك في المنصة!',
                confirmButtonText: 'ابدأ الآن',
                background: '#ffffff',
                color: '#0f172a',
                confirmButtonColor: '#0f172a'
            }).then(() => {
                navigate(roleParam === 'teacher' ? '/' : '/courses');
            });
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-slate-50 overflow-hidden py-12 px-4 font-header">
            {/* Ambient Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 45, 0],
                        x: [0, 50, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-100/40 blur-[130px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -30, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-primary-100/30 blur-[140px] rounded-full"
                />
            </div>

            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white border border-slate-100 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        {/* Top Decorative Bar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-blue-500" />

                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className={`w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-110 transition-transform duration-500 ${currentConfig.bg} ${currentConfig.color}`}
                            >
                                {currentConfig.icon}
                            </motion.div>

                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                إنشاء حساب <span className="text-primary-600">{currentConfig.title}</span>
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                انضم لأكبر تجمع تعليمي للمتفوقين في مصر
                            </p>
                        </div>

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl mb-8 flex items-center gap-3"
                                >
                                    <span className="shrink-0 text-lg">⚠️</span>
                                    <p className="text-xs font-black">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">الاسم بالكامل</label>
                                    <Input
                                        placeholder="الاسم ثلاثي بالعربي"
                                        error={errors.name?.message}
                                        icon={<User className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...formRegister('name', { required: 'الاسم الكامل مطلوب' })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                    <Input
                                        placeholder="name@example.com"
                                        error={errors.email?.message}
                                        icon={<Mail className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...formRegister('email', {
                                            required: 'البريد الإلكتروني مطلوب',
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'بريد غير صحيح' }
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رقم الهاتف</label>
                                    <Input
                                        placeholder="01xxxxxxxxx"
                                        error={errors.phone?.message}
                                        icon={<Phone className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...formRegister('phone', { pattern: { value: /^01[0-9]{9}$/, message: 'رقم هاتف غير صحيح' } })}
                                    />
                                </div>

                                {roleParam === 'student' && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">رقم ولي الأمر</label>
                                        <Input
                                            placeholder="رقم للمتابعة"
                                            error={errors.parentPhone?.message}
                                            icon={<Users className="w-5 h-5" />}
                                            className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                            {...formRegister('parentPhone')}
                                        />
                                    </div>
                                )}

                                {roleParam === 'teacher' && (
                                    <div className="space-y-2 relative">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">المادة التدريسية</label>
                                        <div className="relative">
                                            <BookOpen className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 z-10" />
                                            <select
                                                {...formRegister('subject', { required: 'المادة مطلوبة' })}
                                                className="w-full h-16 pr-14 pl-6 rounded-2xl font-bold bg-slate-50 border-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white focus:border-primary-500/30 outline-none transition-all appearance-none cursor-pointer text-slate-700"
                                            >
                                                <option value="">اختر المادة</option>
                                                <option value="math">رياضيات</option>
                                                <option value="physics">فيزياء</option>
                                                <option value="chemistry">كيمياء</option>
                                                <option value="arabic">لغة عربية</option>
                                                <option value="english">لغة إنجليزية</option>
                                            </select>
                                            <ChevronLeft className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 -rotate-90" />
                                        </div>
                                        {errors.subject && <span className="text-rose-500 text-[10px] font-black mt-1">{errors.subject.message}</span>}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">كلمة المرور</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.password?.message}
                                        icon={<Lock className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...formRegister('password', { required: 'كلمة المرور مطلوبة', minLength: { value: 6, message: '6 أحرف على الأقل' } })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">تأكيد كلمة المرور</label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.confirmPassword?.message}
                                        icon={<Lock className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...formRegister('confirmPassword', {
                                            required: 'تأكيد كلمة المرور مطلوب',
                                            validate: v => v === password || 'كلمات المرور غير متطابقة'
                                        })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 rounded-3xl text-lg font-black bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 transition-transform hover:scale-[1.01]"
                                loading={loading}
                                disabled={loading}
                            >
                                {loading ? 'جاري إنشاء الحساب...' : `إنشاء حساب ${currentConfig.title}`}
                                {!loading && <ArrowRight className="w-5 h-5 mr-1" />}
                            </Button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                                لديك حساب بالفعل؟{' '}
                                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-black ml-1 transition-colors underline-offset-4 hover:underline">
                                    سجل دخولك الآن
                                </Link>
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 flex items-center justify-center gap-6 opacity-20 grayscale grayscale-0 transition-opacity">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">DATA PRIVACY SECURED</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Register;
