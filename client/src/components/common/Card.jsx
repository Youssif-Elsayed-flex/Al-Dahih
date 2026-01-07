import { motion } from 'framer-motion';

const Card = ({
    children,
    className = '',
    hover = true,
    glass = false,
    onClick,
}) => {
    const baseClasses = 'rounded-xl p-6 transition-all duration-300';
    const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer' : '';
    const glassClasses = glass ? 'glass' : 'bg-white shadow-md';

    return (
        <motion.div
            className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {children}
        </motion.div>
    );
};

export default Card;
