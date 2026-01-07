# ⚙️ دليل التثبيت والإعداد (Setup Guide)

هذا الدليل يشرح كيفية إعداد وتشغيل مشروع "منصة الدحّيح" على جهازك المحلي.

## المتطلبات المسبقة (Prerequisites)
تأكد من تثبيت البرامج التالية على جهازك:
1.  **Node.js** (الإصدار 18 أو أحدث).
2.  **MongoDB Atlas Account** (لإنشاء قاعدة البيانات).
3.  **Git** (لإدارة النسخ - اختياري).

---

## 1. إعداد السيرفر (Backend)

1.  انتقل إلى مجلد السيرفر:
    ```bash
    cd server
    ```
2.  ثبت المكتبات المطلوبة:
    ```bash
    npm install
    ```
3.  قم بإنشاء ملف باسم `.env` بجانب ملف `package.json`.
4.  أضف المحتوى التالي داخل الملف:
    ```env
    PORT=4000
    NODE_ENV=development
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/eldahih?retryWrites=true&w=majority
    JWT_SECRET=supersecretkey123
    # إعدادات البريد (اختياري حالياً)
    EMAIL_USER=your-email@gmail.com
    EMAIL_PASS=your-app-password
    ```
    > **تنبيه:** استبدل `<username>` و `<password>` ببيانات قاعدة بيانات MongoDB الخاصة بك.

5.  شغل السيرفر:
    ```bash
    npm run dev
    ```
    *   يجب أن تظهر رسالة: `✅ تم الاتصال بقاعدة البيانات بنجاح`
    *   ثم رسالة: `✅ تم إنشاء حساب الأدمن الافتراضي`

---

## 2. إعداد الواجهة الأمامية (Frontend)

1.  افتح نافذة terminal جديدة وانتقل لمجلد العميل:
    ```bash
    cd client
    ```
2.  ثبت المكتبات:
    ```bash
    npm install
    ```
3.  (اختياري) قم بإنشاء ملف `.env.development` إذا كنت تريد تغيير رابط الـ API:
    ```env
    VITE_API_URL=http://localhost:4000/api
    ```
4.  شغل الواجهة:
    ```bash
    npm run dev
    ```
    *   الموقع سيفتح على الرابط: `http://localhost:5173`

---

## 3. تسجيل الدخول الأول

1.  افتح المتصفح على `http://localhost:5173/login`.
2.  استخدم البيانات التالية:
    *   **Email:** `admin@eldahih.com`
    *   **Password:** `admin123`
3.  ستنتقل للوحة تحكم الأدمن، ومن هناك يمكنك:
    *   إضافة مدرسين ومحاسبين.
    *   إنشاء دورات جديدة.
    *   متابعة التسجيلات.

---

## ⚠️ مشاكل شائعة وحلولها

*   **خطأ Whitelist IP في MongoDB:**
    *   تأكد أنك سمحت للـ IP الخاص بك (أو `0.0.0.0/0`) في إعدادات Network Access على MongoDB Atlas.

*   **خطأ في الاتصال (Network Error):**
    *   تأكد أن السيرفر (Backend) يعمل في الخلفية.
    *   تأكد أن `VITE_API_URL` يشير إلى المنفذ الصحيح (4000).

*   **مشكلة في الكوكيز (Cookies):**
    *   المشروع يستخدم `httpOnly Cookies`. تأكد أن المتصفح يقبل الكوكيز من `localhost`.
