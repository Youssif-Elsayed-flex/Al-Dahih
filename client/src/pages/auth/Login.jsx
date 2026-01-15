import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, ChevronLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const onSubmit = async (data) => {
        setLoading(true);
        setError('');
        const result = await login(data.email, data.password);
        if (result.success) {
            if (result.user.userType === 'employee') {
                navigate('/dashboard');
            } else if (result.user.userType === 'parent') {
                navigate('/parent');
            } else {
                navigate('/courses');
            }
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
                        x: [0, 30, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-primary-100/40 blur-[130px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -30, 0],
                        y: [0, 20, 0],
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-blue-100/30 blur-[140px] rounded-full"
                />
            </div>

            <Container className="relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-md w-[500px] mx-auto"
                >
                    <div className="bg-white border w-[100%]  border-slate-100 p-10 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                        {/* Top Gradient Bar */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-400 via-primary-600 to-blue-500" />

                        {/* Logo section */}
                        <div className="text-center mb-12">
                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-slate-900 flex items-center justify-center shadow-2xl shadow-slate-200 group-hover:scale-110 transition-transform duration-500"
                            >
                                <Sparkles className="w-10 h-10 text-primary-400" />
                            </motion.div>

                            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">
                                عـودة <span className="text-primary-600">للمنصة</span>
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                                سجل دخولك لمتابعة تفوقك يا دحّيح
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
                                    <span className="shrink-0">⚠️</span>
                                    <p className="text-xs font-black">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">البريد الإلكتروني</label>
                                    <Input
                                        placeholder="yourname@example.com"
                                        error={errors.email?.message}
                                        icon={<Mail className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...register('email', {
                                            required: 'البريد الإلكتروني مطلوب',
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: 'صيغة البريد الإلكتروني غير صحيحة',
                                            },
                                        })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mr-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">كلمة المرور</label>
                                        <Link to="/reset-password" name="reset-password-link" className="text-[10px] font-black text-primary-500 hover:text-primary-600 uppercase tracking-widest">نسيت السر؟</Link>
                                    </div>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        error={errors.password?.message}
                                        icon={<Lock className="w-5 h-5" />}
                                        className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-slate-50 focus:bg-white focus:border-primary-500/30 transition-all"
                                        {...register('password', {
                                            required: 'كلمة المرور مطلوبة',
                                        })}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-18 rounded-3xl text-lg font-black bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 transition-transform hover:scale-[1.02]"
                                loading={loading}
                                disabled={loading}
                            >
                                دخول للمنصة <LogIn className="w-5 h-5" />
                            </Button>
                        </form>

                        {/* Links */}
                        <div className="mt-12 pt-8 border-t border-slate-50 text-center">
                            <p className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
                                ليس لديك حساب؟{' '}
                                <Link
                                    to="/register"
                                    className="text-primary-600 hover:text-primary-700 font-black ml-1 transition-colors"
                                >
                                    سجل الآن مجاناً
                                </Link>
                            </p>
                        </div>

                        {/* Trust Footer */}
                        <div className="mt-8 flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span className="text-[8px] font-black uppercase tracking-tighter">Secure Educational Portal Access</span>
                        </div>
                    </div>
                </motion.div>
            </Container>
        </div>
    );
};

export default Login;
