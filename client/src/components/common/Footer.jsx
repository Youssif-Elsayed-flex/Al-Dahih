import Container from './Container';

const Footer = () => {
    return (
        <footer className="bg-gradient-primary text-white mt-auto">
            <Container>
                <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                                <span className="text-2xl">🎓</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">منصة الدحّيح التعليمية</h3>
                                <p className="text-sm text-primary-200">EL DAHEH CENTER</p>
                            </div>
                        </div>
                        <p className="text-dark-100 leading-relaxed max-w-md">
                            منصة تعليمية متكاملة تقدم أفضل الدورات التدريبية للطلاب في مصر
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-primary-300">روابط سريعة</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-dark-100 hover:text-primary-300 transition-colors">
                                    الرئيسية
                                </a>
                            </li>
                            <li>
                                <a href="/courses" className="text-dark-100 hover:text-primary-300 transition-colors">
                                    الدورات
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-dark-100 hover:text-primary-300 transition-colors">
                                    من نحن
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold mb-4 text-primary-300">تواصل معنا</h4>
                        <ul className="space-y-2 text-dark-100">
                            <li className="flex items-center gap-2">
                                <span>📧</span>
                                <span>info@eldahih.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📱</span>
                                <span>01012345678</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <span>📍</span>
                                <span>القاهرة، مصر</span>
                            </li>
                            <li>
                                <a
                                    href="https://www.facebook.com/profile.php?id=61561075059027&locale=ar_AR"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-primary-300 transition-colors"
                                >
                                    <span>📘</span>
                                    <span>تابعنا على فيسبوك</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-dark-700 py-6 text-center text-dark-200">
                    <p>&copy; 2026 منصة الدحّيح التعليمية. جميع الحقوق محفوظة.</p>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
