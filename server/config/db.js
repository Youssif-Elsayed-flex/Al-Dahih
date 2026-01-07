import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    console.log(`✅ MongoDB متصل: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ خطأ في الاتصال بـ MongoDB: ${error.message}`);
    console.error(error.stack);
    console.warn('⚠️ تحذير: الخادم يعمل بدون اتصال بقاعدة البيانات. بعض الميزات لن تعمل.');
    global.isConnected = false;
    // process.exit(1);
    return false;
  }
};

export default connectDB;
