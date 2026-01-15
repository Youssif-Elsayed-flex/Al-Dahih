export const authorize = (...roles) => {
    return (req, res, next) => {
        if (req.userType !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'غير مصرّح، هذه الصلاحية للموظفين فقط',
            });
        }

        if (req.user.role !== 'admin' && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `غير مصرّح، هذه الصلاحية لـ ${roles.join(' أو ')} فقط`,
            });
        }

        next();
    };
};

export const studentOnly = (req, res, next) => {
    if (req.userType !== 'student') {
        return res.status(403).json({
            success: false,
            message: 'غير مصرّح، هذه الصلاحية للطلاب فقط',
        });
    }
    next();
};

export const parentOnly = (req, res, next) => {
    if (req.userType !== 'parent') {
        return res.status(403).json({
            success: false,
            message: 'غير مصرّح، هذه الصلاحية لأولياء الأمور فقط',
        });
    }
    next();
};

export const adminOnly = (req, res, next) => {
    if (req.userType !== 'employee' || req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'غير مصرّح، هذه الصلاحية للأدمن فقط',
        });
    }
    next();
};
