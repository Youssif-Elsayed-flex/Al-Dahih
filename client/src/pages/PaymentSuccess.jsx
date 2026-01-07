import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import Container from '../components/common/Container';
import Button from '../components/common/Button';

const PaymentSuccess = () => {
    // Success animation
    const successAnimation = {
        v: "5.5.7",
        fr: 60,
        ip: 0,
        op: 90,
        w: 400,
        h: 400,
        nm: "Success Check",
        ddd: 0,
        assets: [],
        layers: [
            {
                ddd: 0,
                ind: 1,
                ty: 4,
                nm: "Circle",
                sr: 1,
                ks: {
                    o: { a: 0, k: 100 },
                    p: { a: 0, k: [200, 200, 0] },
                },
                ao: 0,
                shapes: [
                    {
                        ty: "gr",
                        it: [
                            {
                                ty: "el",
                                p: { a: 0, k: [0, 0] },
                                s: { a: 0, k: [300, 300] }
                            },
                            {
                                ty: "fl",
                                c: { a: 0, k: [0.31, 0.78, 0.47, 1] },
                                o: { a: 0, k: 100 }
                            }
                        ]
                    }
                ],
                ip: 0,
                op: 90,
                st: 0,
                bm: 0
            }
        ]
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-teal-900 py-12 px-4">
            <Container>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-2xl mx-auto text-center"
                >
                    {/* Success Animation */}
                    <div className="w-48 h-48 mx-auto mb-8">
                        <Lottie animationData={successAnimation} loop={false} />
                    </div>

                    {/* Success Message */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 border border-white/20"
                    >
                        <div className="text-8xl mb-6">✅</div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            تم إرسال طلب الدفع بنجاح!
                        </h1>
                        <p className="text-xl text-green-100 mb-8">
                            في انتظار تأكيد المحاسب للدفع
                        </p>

                        <div className="bg-white/10 rounded-xl p-6 mb-8 text-right">
                            <h3 className="text-white font-bold mb-4 text-lg">الخطوات التالية:</h3>
                            <ul className="space-y-3 text-green-100">
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">1️⃣</span>
                                    <span>سيقوم المحاسب بمراجعة طلب الدفع</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">2️⃣</span>
                                    <span>بعد التأكيد، سيتم تفعيل حجزك</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-2xl">3️⃣</span>
                                    <span>ستصلك رسالة بريد إلكتروني بالتأكيد</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/my-courses">
                                <Button variant="primary" size="lg">
                                    عرض دوراتي
                                </Button>
                            </Link>
                            <Link to="/courses">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-green-900"
                                >
                                    تصفح المزيد من الدورات
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </Container>
        </div>
    );
};

export default PaymentSuccess;
