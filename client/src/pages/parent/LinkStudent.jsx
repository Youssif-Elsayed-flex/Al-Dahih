import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { UserPlus, Mail, ArrowRight, Link2 } from 'lucide-react';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Swal from 'sweetalert2';

const LinkStudent = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const mutation = useMutation({
        mutationFn: async (data) => {
            return axios.post('/parents/link-student', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['parent-children']);
            Swal.fire({
                icon: 'success',
                title: 'تم ربط الطالب بنجاح',
                text: 'يمكنك الآن متابعة تقدمه الدراسي',
                confirmButtonText: 'العودة للوحة التحكم',
                background: '#ffffff',
                color: '#0f172a',
                confirmButtonColor: '#0f172a'
            }).then(() => {
                navigate('/parent');
            });
            reset();
        },
        onError: (error) => {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response?.data?.message || 'حدث خطأ أثناء ربط الطالب',
                background: '#ffffff',
                color: '#0f172a'
            });
        }
    });

    const onSubmit = (data) => mutation.mutate(data);

    return (
        <div className="min-h-screen bg-slate-50 py-12 font-header" dir="rtl">
            <Container>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto"
                >
                    <Card className="bg-white border border-slate-100 p-10 rounded-[3rem] shadow-2xl">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 mx-auto mb-6 bg-primary-50 rounded-3xl flex items-center justify-center">
                                <Link2 className="w-10 h-10 text-primary-600" />
                            </div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">ربط طالب جديد</h1>
                            <p className="text-slate-500 text-sm font-bold">
                                أدخل البريد الإلكتروني لابنك المسجل في المنصة
                            </p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mr-2">
                                    البريد الإلكتروني للطالب
                                </label>
                                <Input
                                    {...register('studentEmail', {
                                        required: 'البريد الإلكتروني مطلوب',
                                        pattern: {
                                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                            message: 'صيغة البريد غير صحيحة'
                                        }
                                    })}
                                    placeholder="student@example.com"
                                    icon={<Mail className="w-5 h-5" />}
                                    className="h-16 rounded-2xl px-6 font-bold bg-slate-50 border-none"
                                    error={errors.studentEmail?.message}
                                />
                            </div>

                            <Button
                                type="submit"
                                loading={mutation.isPending}
                                className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
                            >
                                ربط الطالب
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </form>

                        <p className="text-center text-slate-400 text-xs font-bold mt-8">
                            تأكد من أن الطالب مسجل بالفعل في المنصة
                        </p>
                    </Card>
                </motion.div>
            </Container>
        </div>
    );
};

export default LinkStudent;
