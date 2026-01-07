import { motion } from 'framer-motion';
import Lottie from 'lottie-react';

const Success = ({ 
  title,
  message,
  action,
  actionLabel,
}) => {
  // Success checkmark animation
  const successAnimation = {
    v: "5.5.7",
    fr: 60,
    ip: 0,
    op: 90,
    w: 400,
    h: 400,
    nm: "Success Check",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Circle",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          p: { a: 0, k: [200, 200, 0] },
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            it: [
              {
                ty: "el",
                p: { a: 0, k: [0, 0] },
                s: { a: 0, k: [300, 300] }
              },
              {
                ty: "fl",
                c: { a: 0, k: [0.31, 0.78, 0.47, 1] },
                o: { a: 0, k: 100 }
              }
            ]
          }
        ],
        ip: 0,
        op: 90,
        st: 0,
        bm: 0
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="w-48 h-48 mx-auto mb-6">
        <Lottie animationData={successAnimation} loop={false} />
      </div>
      
      <div className="text-8xl mb-6">✅</div>
      
      <h3 className="text-3xl font-bold text-dark-900 mb-3">
        {title}
      </h3>
      
      <p className="text-dark-600 mb-8 max-w-md mx-auto text-lg">
        {message}
      </p>
      
      {action && actionLabel && (
        <button
          onClick={action}
          className="btn-primary"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
};

export default Success;
