import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Calendar, Users, ChevronLeft, Star, Clock } from 'lucide-react';
import Card from '../common/Card';

const CourseCard = ({ course }) => {
    return (
        <Link to={`/courses/${course._id}`}>
            <Card hover={true} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden h-full flex flex-col group p-0">
                {/* Course Image */}
                <div className="relative h-56 overflow-hidden">
                    <img
                        src={course.coverImage || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <div className="absolute top-6 left-6">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2">
                            <span className="text-lg font-black text-primary-600">{course.pricePerMonth}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ج.م / شهر</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6">
                        <div className="bg-slate-900/80 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                            <Clock className="w-3 h-3 text-primary-400" /> {course.gradeLevel || 'كافة المستويات'}
                        </div>
                    </div>
                </div>

                {/* Course Content */}
                <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-orange-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">مادة دراسية معتمدة</span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-800 mb-4 line-clamp-1 group-hover:text-primary-600 transition-colors">
                        {course.title}
                    </h3>

                    <p className="text-slate-500 font-bold text-xs mb-8 line-clamp-2 leading-relaxed flex-1">
                        {course.description || 'محتوى تعليمي متقدم مصمم خصيصاً لضمان تفوقك الدراسي في هذه المادة.'}
                    </p>

                    {/* Course Quick Info */}
                    <div className="grid grid-cols-2 gap-4 pb-8 border-b border-slate-50">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 truncate">{course.teacher?.name || 'مدرّس المادة'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                                <Users className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600">{course.maxStudents || '--'} مقعد</span>
                        </div>
                    </div>

                    {/* Footer / CTA */}
                    <div className="pt-6 flex items-center justify-between">
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3.5 h-3.5" /> متاح الآن
                        </span>
                        <div className="flex items-center gap-1 text-xs font-black text-slate-900 group-hover:text-primary-600 transition-colors">
                            عرض التفاصيل <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default CourseCard;
