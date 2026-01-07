import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Card from '../common/Card';

const CourseCard = ({ course }) => {
    return (
        <Link to={`/courses/${course._id}`}>
            <Card hover={true} className="overflow-hidden h-full flex flex-col">
                {/* Course Image */}
                <div className="relative h-48 -m-6 mb-4 overflow-hidden">
                    <img
                        src={course.coverImage || '/placeholder-course.jpg'}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {course.pricePerMonth} جنيه/شهر
                    </div>
                </div>

                {/* Course Content */}
                <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-dark-900 mb-2 line-clamp-2">
                        {course.title}
                    </h3>

                    <p className="text-dark-600 text-sm mb-4 line-clamp-3 flex-1">
                        {course.description || 'دورة تعليمية مميزة'}
                    </p>

                    {/* Course Info */}
                    <div className="space-y-2 text-sm">
                        {course.teacher && (
                            <div className="flex items-center gap-2 text-dark-700">
                                <span>👨‍🏫</span>
                                <span>{course.teacher.name}</span>
                            </div>
                        )}

                        {course.daysPerWeek && course.daysPerWeek.length > 0 && (
                            <div className="flex items-center gap-2 text-dark-700">
                                <span>📅</span>
                                <span>{course.daysPerWeek.length} أيام أسبوعياً</span>
                            </div>
                        )}

                        <div className="flex items-center gap-2 text-dark-700">
                            <span>👥</span>
                            <span>
                                {course.maxStudents} طالب كحد أقصى
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <motion.div
                        className="mt-4 bg-gradient-accent text-white text-center py-3 rounded-lg font-bold"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        عرض التفاصيل
                    </motion.div>
                </div>
            </Card>
        </Link>
    );
};

export default CourseCard;
