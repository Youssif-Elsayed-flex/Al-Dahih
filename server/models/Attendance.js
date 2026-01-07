import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'الطالب مطلوب'],
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'الدورة مطلوبة'],
    },
    date: {
        type: Date,
        required: [true, 'التاريخ مطلوب'],
        default: Date.now,
    },
    status: {
        type: String,
        enum: {
            values: ['present', 'absent'],
            message: '{VALUE} ليست حالة صحيحة',
        },
        required: [true, 'حالة الحضور مطلوبة'],
    },
}, {
    timestamps: true,
});

// منع تسجيل الحضور المكرر لنفس الطالب في نفس الدورة واليوم
attendanceSchema.index({ student: 1, course: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
