import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Users,
    BookOpen,
    Calendar,
    CreditCard,
    GraduationCap,
    ChevronLeft,
    UserCheck,
    Clock
} from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../context/AuthContext';

const ParentDashboard = () => {
    const { user } = useAuth();

    const { data: children, isLoading } = useQuery({
        queryKey: ['parent-children'],
        queryFn: async () => {
            const { data } = await axios.get('/parents/my-children');
            return data.data;
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loading message="جاري تحميل بيانات الأبناء..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 font-header" dir="rtl">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                            لوحة ولي الأمر
                        </span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        مرحباً، <span className="text-primary-600">{user?.name}</span>
                    </h1>
                    <p className="text-slate-500 font-medium">
                        تابع تقدم أبنائك الدراسي ومدفوعاتهم من هنا
                    </p>
                </motion.div>

                {children?.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {children.map((child, i) => (
                            <motion.div
                                key={child._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Card className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all group">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center">
                                            <GraduationCap className="w-8 h-8 text-primary-600" />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black ${child.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                                            {child.isActive ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800 mb-2">{child.name}</h3>
                                    <p className="text-slate-400 text-sm font-bold mb-2">{child.email}</p>
                                    {child.educationLevel && (
                                        <p className="text-xs font-bold text-primary-600 bg-primary-50 inline-block px-3 py-1 rounded-lg mb-6">
                                            {child.educationLevel}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-6 border-t border-slate-50">
                                        <Link
                                            to={`/parent/child/${child._id}/courses`}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-400"
                                        >
                                            <BookOpen className="w-5 h-5" />
                                            <span className="text-[10px] font-black">الدورات</span>
                                        </Link>
                                        <Link
                                            to={`/parent/child/${child._id}/payments`}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-400"
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            <span className="text-[10px] font-black">المدفوعات</span>
                                        </Link>
                                        <Link
                                            to={`/parent/child/${child._id}/attendance`}
                                            className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-primary-50 hover:text-primary-600 transition-colors text-slate-400"
                                        >
                                            <Calendar className="w-5 h-5" />
                                            <span className="text-[10px] font-black">الحضور</span>
                                        </Link>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-white border border-slate-100 p-16 rounded-[3rem] shadow-sm">
                        <EmptyState
                            icon={<Users className="w-16 h-16" />}
                            title="لم تقم بربط أي طالب بعد"
                            message="قم بربط حساب ابنك عن طريق بريده الإلكتروني لمتابعة تقدمه الدراسي"
                        />
                        <div className="mt-8 text-center">
                            <Link
                                to="/parent/link-student"
                                className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black transition-colors"
                            >
                                <UserCheck className="w-5 h-5" />
                                ربط طالب جديد
                            </Link>
                        </div>
                    </Card>
                )}
            </Container>
        </div>
    );
};

export default ParentDashboard;
