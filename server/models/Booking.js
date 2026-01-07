import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
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
    monthYear: {
        type: String, // Format: "2025-06"
        required: [true, 'الشهر والسنة مطلوبان'],
        match: [/^\d{4}-\d{2}$/, 'صيغة الشهر والسنة يجب أن تكون YYYY-MM'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'confirmed', 'cancelled'],
            message: '{VALUE} ليست حالة صحيحة',
        },
        default: 'pending',
    },
}, {
    timestamps: true,
});

// منع الحجز المكرر لنفس الطالب في نفس الدورة والشهر
bookingSchema.index({ student: 1, course: 1, monthYear: 1 }, { unique: true });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
