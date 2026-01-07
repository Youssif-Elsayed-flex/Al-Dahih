import { motion } from 'framer-motion';

const EmptyState = ({ 
  icon = '📭',
  title,
  message,
  action,
  actionLabel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-16"
    >
      <div className="text-8xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-dark-900 mb-2">
        {title}
      </h3>
      <p className="text-dark-600 mb-6 max-w-md mx-auto">
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

export default EmptyState;
