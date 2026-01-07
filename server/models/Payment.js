import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'الطالب مطلوب'],
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: [true, 'الحجز مطلوب'],
    },
    amount: {
        type: Number,
        required: [true, 'المبلغ مطلوب'],
        min: [0, 'المبلغ لا يمكن أن يكون سالبًا'],
    },
    method: {
        type: String,
        enum: {
            values: ['vodafoneCash', 'card', 'cash'],
            message: '{VALUE} ليست طريقة دفع صحيحة',
        },
        required: [true, 'طريقة الدفع مطلوبة'],
    },
    status: {
        type: String,
        enum: {
            values: ['pending', 'paid', 'failed'],
            message: '{VALUE} ليست حالة صحيحة',
        },
        default: 'pending',
    },
    transId: {
        type: String, // كود التحويل من فودافون أو Stripe transaction ID
        trim: true,
    },
    receiptUrl: {
        type: String, // Cloudinary URL للوصل
    },
    paidAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

// تحديث تاريخ الدفع تلقائيًا عند تغيير الحالة إلى "paid"
paymentSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'paid' && !this.paidAt) {
        this.paidAt = new Date();
    }
    next();
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
