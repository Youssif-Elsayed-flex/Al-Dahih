import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Container from './Container';
import Button from './Button';
import logo from '../../assets/logo.jpg';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, isAuthenticated, logout, isStudent, isEmployee } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleRegisterClick = (e) => {
        e.preventDefault();

        Swal.fire({
            title: '<strong>سجل حساب جديد</strong>',
            icon: 'info',
            html: `
                <div class="flex flex-col gap-4 py-4">
                    <button id="reg-student" class="swal2-confirm swal2-styled" style="background-color: #f97316; width: 100%; margin: 0;">تسجيل كطالب 👨‍🎓</button>
                    <button id="reg-parent" class="swal2-confirm swal2-styled" style="background-color: #10b981; width: 100%; margin: 0;">تسجيل كولي أمر 👨‍👩‍👦</button>
                    <button id="reg-teacher" class="swal2-confirm swal2-styled" style="background-color: #3b82f6; width: 100%; margin: 0;">تسجيل كمدرس 👨‍🏫</button>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            focusConfirm: false,
            didOpen: () => {
                const studentBtn = Swal.getPopup().querySelector('#reg-student');
                const parentBtn = Swal.getPopup().querySelector('#reg-parent');
                const teacherBtn = Swal.getPopup().querySelector('#reg-teacher');

                studentBtn.addEventListener('click', () => {
                    Swal.close();
                    navigate('/register?role=student');
                });
                parentBtn.addEventListener('click', () => {
                    Swal.close();
                    navigate('/register?role=parent');
                });
                teacherBtn.addEventListener('click', () => {
                    Swal.close();
                    navigate('/register?role=teacher');
                });
            }
        });
    };

    return (
        <motion.nav
            className="sticky top-0 z-50 bg-gradient-primary shadow-lg backdrop-blur-md"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Container>
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <img className='w-full h-full object-contain rounded-full border-2 border-primary-500' src={logo} alt="logo of eldahih" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">الدحّيح</h1>
                            <p className="text-xs text-primary-200">منصة تعليمية</p>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-white hover:text-primary-300 transition-colors duration-300 font-medium">الرئيسية</Link>
                        <Link to="/courses" className="text-white hover:text-primary-300 transition-colors duration-300 font-medium">الدورات</Link>

                        {isAuthenticated && isStudent && (
                            <>
                                <Link to="/my-courses" className="text-white hover:text-primary-300 transition-colors duration-300 font-medium">دوراتي</Link>
                                <Link to="/my-payments" className="text-white hover:text-primary-300 transition-colors duration-300 font-medium">المدفوعات</Link>
                            </>
                        )}

                        {isAuthenticated && isEmployee && (
                            <Link to="/dashboard" className="text-white hover:text-primary-300 transition-colors duration-300 font-medium">لوحة التحكم</Link>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile">
                                    <motion.div className="flex items-center gap-2 text-white hover:text-primary-300 transition-colors duration-300" whileHover={{ scale: 1.05 }}>
                                        <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
                                            <span className="text-sm font-bold">{user?.name?.[0] || 'م'}</span>
                                        </div>
                                        <span className="hidden md:block font-medium">{user?.name}</span>
                                    </motion.div>
                                </Link>
                                <Button variant="outline" size="sm" onClick={handleLogout} className="border-white text-white hover:bg-white hover:text-dark-900">تسجيل الخروج</Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm" className="text-white hover:text-primary-300 hover:bg-white/10">تسجيل الدخول</Button>
                                </Link>
                                <a href="#" onClick={handleRegisterClick}>
                                    <Button variant="primary" size="sm">سجل الآن</Button>
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </Container>
        </motion.nav>
    );
};

export default Navbar;
