/**
 * Middleware للتحقق من الدور الوظيفي (Role-Based Access Control)
 * @param  {...string} roles - الأدوار المسموح بها
 */
export const authorize = (...roles) => {
    return (req, res, next) => {
        // التحقق من نوع المستخدم
        if (req.userType !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'غير مصرّح، هذه الصلاحية للموظفين فقط',
            });
        }

        // التحقق من الدور (الأدمن دايماً مسموح له)
        if (req.user.role !== 'admin' && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `غير مصرّح، هذه الصلاحية لـ ${roles.join(' أو ')} فقط`,
            });
        }

        next();
    };
};

/**
 * Middleware للتحقق من أن المستخدم طالب
 */
export const studentOnly = (req, res, next) => {
    if (req.userType !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'غير مصرّح، هذه الصلاحية للطلاب فقط',
        });
    }
    next();
};
