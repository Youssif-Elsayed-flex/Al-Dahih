import jwt from 'jsonwebtoken';

/**
 * توليد JWT Token
 * @param {string} id - معرف المستخدم
 * @returns {string} JWT token
 */
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

/**
 * التحقق من JWT Token
 * @param {string} token - JWT token
 * @returns {object} payload مفكوك
 */
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('التوكن غير صالح');
    }
};
