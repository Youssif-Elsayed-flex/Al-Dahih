import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';


// Load env vars
dotenv.config();
console.log('ENV LOADED, JWT_SECRET:', process.env.JWT_SECRET ? 'Exists' : 'Missing');

// Connect to MySQL
// Connect to PostgreSQL
import { connectDB } from './config/db.pg.js';
connectDB().then((isConnected) => {
    global.isConnected = isConnected;
    if (isConnected) {
        seedAdmin();
    }
});

import { seedAdmin } from './utils/seedAdmin.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import coursesRoutes from './routes/courses.routes.js';
import bookingsRoutes from './routes/bookings.routes.js';
import paymentsRoutes from './routes/payments.routes.js';
import studentsRoutes from './routes/students.routes.js';
import employeesRoutes from './routes/employees.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import parentsRoutes from './routes/parents.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'تم تجاوز الحد الأقصى من الطلبات، حاول مرة أخرى لاحقاً',
});
app.use('/api', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/parents', parentsRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'مرحباً بك في API منصة الدحّيح التعليمية 🎓',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            bookings: '/api/bookings',
            payments: '/api/payments',
            students: '/api/students',
            employees: '/api/employees',
            dashboard: '/api/dashboard',
        },
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'المسار غير موجود',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('خطأ في الخادم:', err.message);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'خطأ في الخادم',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎓  منصة الدحّيح التعليمية - الخادم يعمل الآن          ║
║                                                           ║
║   📡  المنفذ: ${PORT}                                      ║
║   🌍  البيئة: ${process.env.NODE_ENV || 'development'}    ║
║   🔗  الرابط: http://localhost:${PORT}                    ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    // server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    // process.exit(1);
});

export default app;
