import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    GraduationCap,
    CreditCard,
    Smartphone,
    BookOpen,
    Clock,
    ShieldCheck,
    ArrowLeft,
    Sparkles,
    Users,
    TrendingUp,
    Star
} from 'lucide-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';
import back from '../assets/back.jpg';

const Home = () => {
    return (
        <div className="min-h-screen bg-white font-header">
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-primary-100/40 blur-[130px] rounded-full" />
                    <div className="absolute bottom-[10%] left-[-10%] w-[40%] h-[40%] bg-blue-100/30 blur-[120px] rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#0ea5e9 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                </div>

                <Container className="relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-center lg:text-right"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-50 text-primary-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8"
                            >
                                <Sparkles className="w-3.5 h-3.5" /> منصة الدحيح التعليمية - بوابتك للتفوق
                            </motion.div>

                            <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.15] tracking-tight">
                                تعلم بذكاء <br />
                                <span className="text-primary-600">وتفوق مع النخبة</span>
                            </h1>

                            <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed max-w-xl lg:ml-0 lg:mr-auto">
                                انضم للآلاف من الطلاب المتفوقين واستمتع بتجربة تعليمية فريدة مع أفضل المعلمين في مختلف التخصصات.
                            </p>

                            <div className="flex flex-wrap gap-5 justify-center lg:justify-start">
                                <Link to="/courses">
                                    <Button className="h-16 px-10 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 shadow-2xl shadow-slate-200 flex items-center gap-3 transition-transform hover:scale-105">
                                        استكشف دوراتنا <BookOpen className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="h-16 px-10 rounded-2xl bg-white text-slate-700 border border-slate-100 hover:bg-slate-50 font-black shadow-sm transition-transform hover:scale-105">
                                        سجل مجاناً الآن
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-12 pt-12 border-t border-slate-50 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-40 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> دفع آمن تماماً
                                </div>
                                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-slate-400">
                                    <Users className="w-4 h-4 text-blue-500" /> +5000 طالب نشط
                                </div>
                                <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-tighter text-slate-400">
                                    <Star className="w-4 h-4 text-orange-400" /> تقييم 4.9/5
                                </div>
                            </div>
                        </motion.div>

                        {/* Hero Image Section */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative z-20">
                                <div className="absolute inset-0 bg-primary-600/5 blur-[100px] rounded-full scale-75 animate-pulse" />
                                <img
                                    src={back}
                                    alt="Learning Center"
                                    className="w-full max-w-xl mx-auto rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border-8 border-white transform hover:rotate-2 transition-transform duration-700"
                                />
                            </div>

                            {/* Floating Stats Card 1 */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-6 -right-6 z-30 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden md:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">معدل النجاح</p>
                                        <p className="text-xl font-black text-slate-800">98%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Stats Card 2 */}
                            <motion.div
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="absolute -bottom-10 -left-6 z-30 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden md:block"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase">طلابنا</p>
                                        <p className="text-xl font-black text-slate-800">+10k</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </Container>
            </section>

            {/* Features Grid */}
            <section className="py-32 bg-slate-50/50">
                <Container>
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
                        >
                            لماذا يفضلنا <span className="text-primary-600">المتفوقون</span>؟
                        </motion.h2>
                        <p className="text-slate-500 font-bold max-w-2xl mx-auto uppercase tracking-wide text-xs">نحن لا نقدم مجرد دورات، بل نصنع قصص نجاح حقيقية.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { icon: GraduationCap, title: 'نخبة المعلمين', desc: 'نتعامل مع أرقى الكفاءات التعليمية لضمان وصول المعلومة بأفضل طريقة.', color: 'text-primary-600', bg: 'bg-primary-50' },
                            { icon: CreditCard, title: 'دفع سهل وآمن', desc: 'خيارات دفع مرنة تشمل فودافون كاش والتحصيل المباشر بكل أمان.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                            { icon: Smartphone, title: 'تعلم من أي مكان', desc: 'منصتنا مهيأة تماماً للعمل على كافة الأجهزة بمختلف أحجامها.', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { icon: BookOpen, title: 'محتوى حصري', desc: 'مذكرات واختبارات دورية صممت خصيصاً لطلاب المنصة فقط.', color: 'text-orange-600', bg: 'bg-orange-50' },
                            { icon: Clock, title: 'مواعيد مرنة', desc: 'محاضرات مسجلة ومباشرة تتيح لك اختيار الوقت المناسب لدراستك.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                            { icon: ShieldCheck, title: 'متابعة دورية', desc: 'تقارير فنية ودراسية لولي الأمر لمتابعة تقدم الطالب خطوة بخطوة.', color: 'text-rose-600', bg: 'bg-rose-50' },
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group"
                            >
                                <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-4">{feature.title}</h3>
                                <p className="text-slate-500 font-bold text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative">
                <div className="absolute inset-0 bg-slate-900 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[50%] h-full bg-primary-600/10 blur-[120px] rounded-full translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[50%] h-full bg-blue-600/5 blur-[100px] rounded-full -translate-x-1/2" />
                </div>

                <Container className="relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                            ابدأ رحلتك نحو <br />
                            <span className="text-primary-400">القمة اليوم</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium mb-12 max-w-2xl mx-auto">
                            كن واحداً من عائلة الدحيح التعليمية واستمتع بخصومات حصرية عند أول اشتراك لك في المنصة.
                        </p>
                        <Link to="/register">
                            <Button className="h-20 px-16 rounded-[2rem] bg-primary-600 text-white font-black hover:bg-primary-500 shadow-2xl shadow-primary-900/40 text-xl transition-all hover:scale-105">
                                انضم إلينا الآن <ArrowLeft className="w-6 h-6 mr-3" />
                            </Button>
                        </Link>
                    </motion.div>
                </Container>
            </section>

            {/* Stats Footer */}
            <section className="py-24 border-t border-slate-50">
                <Container>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        {[
                            { label: 'طلاب نشطون', val: '+5,000' },
                            { label: 'ساعات تعليمية', val: '+10,000' },
                            { label: 'مدرّس محترف', val: '+50' },
                            { label: 'نسبة الرضا', val: '99%' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <h4 className="text-4xl md:text-5xl font-black text-slate-900 mb-2">{stat.val}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
        </div>
    );
};

export default Home;
