import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar';

const DashboardLayout = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex" dir="rtl">
            {/* Sidebar fixed to the right */}
            <Sidebar />

            {/* Main Content Area - Offset by sidebar width (80 = 20rem = 320px) */}
            <main className="flex-1 mr-80 transition-all duration-300 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
