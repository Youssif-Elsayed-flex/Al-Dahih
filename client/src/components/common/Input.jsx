import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    type = 'text',
    placeholder,
    icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-dark-700 font-medium mb-2">
                    {label}
                </label>
            )}

            <div className="relative">
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                        {icon}
                    </div>
                )}

                <input
                    ref={ref}
                    type={type}
                    placeholder={placeholder}
                    className={`input ${icon ? 'pr-12' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
                    {...props}
                />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
