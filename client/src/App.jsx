import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Courses from './pages/Courses';
import CourseDetails from './pages/CourseDetails';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import MyPayments from './pages/MyPayments';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ManageEmployees from './pages/dashboard/ManageEmployees';
import ManageCourses from './pages/dashboard/ManageCourses';
import ManageBookings from './pages/dashboard/ManageBookings';
import ManageStudents from './pages/dashboard/ManageStudents';

import Reports from './pages/dashboard/Reports';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import AccountantDashboard from './pages/dashboard/AccountantDashboard';

import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Create Query Client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        {/* Public Pages with MainLayout (Navbar/Footer) */}
                        <Route element={<MainLayout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/courses" element={<Courses />} />
                            <Route path="/courses/:id" element={<CourseDetails />} />

                            {/* Protected Student Routes in MainLayout */}
                            <Route
                                path="/booking/:courseId"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <Booking />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/payment/:bookingId"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <Payment />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/payment-success"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <PaymentSuccess />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-courses"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <MyCourses />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/my-payments"
                                element={
                                    <ProtectedRoute requireStudent>
                                        <MyPayments />
                                    </ProtectedRoute>
                                }
                            />
                        </Route>

                        {/* Employee Dashboard Routes with DashboardLayout (Sidebar) */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute requireEmployee>
                                    <DashboardLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<AdminDashboard />} />
                            <Route path="employees" element={<ManageEmployees />} />
                            <Route path="courses" element={<ManageCourses />} />
                            <Route path="bookings" element={<ManageBookings />} />
                            <Route path="students" element={<ManageStudents />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="teacher" element={<TeacherDashboard />} />
                            <Route path="accountant" element={<AccountantDashboard />} />
                        </Route>

                        {/* 404 - No Layout or maybe MainLayout */}
                        <Route
                            path="*"
                            element={
                                <MainLayout>
                                    <div className="min-h-screen flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-8xl mb-4">🚧</div>
                                            <h2 className="text-3xl font-bold text-dark-900 mb-2">
                                                الصفحة قيد الإنشاء
                                            </h2>
                                            <p className="text-dark-600">
                                                نعمل على إضافة هذه الصفحة قريباً
                                            </p>
                                        </div>
                                    </div>
                                </MainLayout>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
