import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
    withCredentials: true, // مهم جداً لإرسال الكوكيز
    headers: {
        'Content-Type': 'application/json',
    },
});

// معالجة الأخطاء تلقائياً
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // يمكن هنا تحديث حالة الـ Context لفقدان الجلسة
            // لكن يفضل عدم التوجيه المباشر حتى لا يؤثر على تجربة المستخدم
            // في حالة التحقق من الجلسة في الخلفية
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
