import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'صيغة البريد الإلكتروني غير صحيحة'],
    },
    password: {
        type: String,
        required: [true, 'كلمة المرور مطلوبة'],
        minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
        select: false, // لا تُرجع كلمة المرور افتراضيًا
    },
    phone: {
        type: String,
        trim: true,
    },
    parentPhone: {
        type: String,
        trim: true,
    },
    birthDate: {
        type: Date,
    },
    educationLevel: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String, // Cloudinary URL
        default: 'https://res.cloudinary.com/demo/image/upload/avatar-placeholder.png',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    resetToken: {
        type: String,
    },
}, {
    timestamps: true,
});

// تشفير كلمة المرور قبل الحفظ
studentSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// method للتحقق من كلمة المرور
studentSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Student = mongoose.model('Student', studentSchema);

export default Student;
