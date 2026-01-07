import nodemailer from 'nodemailer';

/**
 * إرسال بريد إلكتروني
 * @param {object} options - خيارات البريد (to, subject, html)
 */
export const sendEmail = async (options) => {
    try {
        // إنشاء transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // خيارات الرسالة
        const mailOptions = {
            from: `منصة الدحّيح التعليمية <${process.env.EMAIL_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        // إرسال البريد
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ تم إرسال البريد إلى: ${options.to}`);
        return info;

    } catch (error) {
        console.error(`❌ خطأ في إرسال البريد: ${error.message}`);
        throw new Error('فشل في إرسال البريد الإلكتروني');
    }
};

/**
 * قالب بريد الترحيب
 * @param {string} name - اسم الطالب
 * @returns {string} HTML content
 */
export const welcomeEmailTemplate = (name) => {
    return `
    <div style="font-family: Tajawal, Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #f97316; margin: 0; font-size: 28px;">🎓 منصة الدحّيح التعليمية</h1>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0f172a; margin-top: 0;">مرحبًا ${name}!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.8;">
          نحن سعداء بانضمامك إلى منصة الدحّيح التعليمية 🎉
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.8;">
          يمكنك الآن تصفّح الدورات المتاحة والبدء في رحلتك التعليمية معنا.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/courses" 
             style="display: inline-block; background-color: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
            استكشف الدورات
          </a>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.
        </p>
      </div>
    </div>
  `;
};

/**
 * قالب بريد الوصل
 * @param {object} data - بيانات الدفع (studentName, courseName, amount, transId, paidAt)
 * @returns {string} HTML content
 */
export const receiptEmailTemplate = (data) => {
    const { studentName, courseName, amount, transId, paidAt } = data;
    const formattedDate = new Date(paidAt).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return `
    <div style="font-family: Tajawal, Arial, sans-serif; direction: rtl; text-align: right; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #f97316; margin: 0; font-size: 28px;">✅ وصل دفع</h1>
      </div>
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #0f172a; margin-top: 0;">عزيزي ${studentName}</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.8;">
          تم استلام دفعتك بنجاح 🎉
        </p>
        <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">الدورة:</td>
              <td style="padding: 10px 0; color: #0f172a; font-weight: bold; text-align: left;">${courseName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">المبلغ:</td>
              <td style="padding: 10px 0; color: #f97316; font-weight: bold; font-size: 18px; text-align: left;">${amount} جنيه</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">رقم التحويل:</td>
              <td style="padding: 10px 0; color: #0f172a; text-align: left;">${transId || 'نقدي'}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #64748b; font-size: 14px;">التاريخ:</td>
              <td style="padding: 10px 0; color: #0f172a; text-align: left;">${formattedDate}</td>
            </tr>
          </table>
        </div>
        <p style="color: #64748b; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          احتفظ بهذا الوصل كمرجع لدفعتك.
        </p>
      </div>
    </div>
  `;
};
