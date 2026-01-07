import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import axios from '../../api/axios.config';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      await axios.post('/auth/reset-password', { email: data.email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في إرسال البريد');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-12 px-4">
        <Container>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card className="glass-dark border-dark-700">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                تم الإرسال بنجاح!
              </h2>
              <p className="text-dark-200 mb-6">
                تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور
              </p>
              <Button
                variant="primary"
                onClick={() => navigate('/login')}
              >
                العودة لتسجيل الدخول
              </Button>
            </Card>
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-primary-900 py-12 px-4">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <Card className="glass-dark border-dark-700">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-4xl">🔒</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                استعادة كلمة المرور
              </h1>
              <p className="text-dark-300">
                أدخل بريدك الإلكتروني لإرسال رابط الاستعادة
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6"
              >
                {error}
              </motion.div>
            )}

            {/* Reset Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                icon={<span>📧</span>}
                error={errors.email?.message}
                className="bg-dark-700 border-dark-600 text-white placeholder:text-dark-400"
                {...register('email', {
                  required: 'البريد الإلكتروني مطلوب',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'صيغة البريد الإلكتروني غير صحيحة',
                  },
                })}
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                إرسال رابط الاستعادة
              </Button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
              >
                ← العودة لتسجيل الدخول
              </button>
            </div>
          </Card>
        </motion.div>
      </Container>
    </div>
  );
};

export default ResetPassword;
