import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'عنوان الدورة مطلوب'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    pricePerMonth: {
        type: Number,
        required: [true, 'سعر الدورة مطلوب'],
        min: [0, 'السعر لا يمكن أن يكون سالبًا'],
    },
    daysPerWeek: [{
        type: String,
        enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    }],
    startAt: {
        type: Date,
    },
    endAt: {
        type: Date,
    },
    maxStudents: {
        type: Number,
        default: 20,
        min: 1,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    coverImage: {
        type: String, // Cloudinary URL
        default: 'https://res.cloudinary.com/demo/image/upload/course-placeholder.png',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});

// إضافة virtual للحصول على عدد الطلاب المسجلين
courseSchema.virtual('enrolledCount', {
    ref: 'Booking',
    localField: '_id',
    foreignField: 'course',
    count: true,
});

const Course = mongoose.model('Course', courseSchema);

export default Course;
