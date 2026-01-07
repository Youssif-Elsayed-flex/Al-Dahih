import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 overflow-hidden">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
