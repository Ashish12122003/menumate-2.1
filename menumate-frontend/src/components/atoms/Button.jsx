// src/components/atoms/Button.jsx

import React from 'react';

/**
 * A reusable Button component styled with Tailwind CSS.
 * * @param {string} variant - 'primary' (default), 'secondary', or 'outline'.
 * @param {string} size - 'sm', 'md' (default), or 'lg'.
 * @param {boolean} disabled - Whether the button is disabled.
 * @param {string} className - Additional CSS classes to apply.
 * @param {function} onClick - Click handler function.
 * @param {React.Node} children - The content inside the button.
 */
const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    type = 'button', // Default HTML type
    ...rest // Capture any other props (like 'aria-label')
}) => {

    // --- 1. Base Styles ---
    const baseStyle = 
        'font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50';

    // --- 2. Size Styles ---
    const sizeMap = {
        sm: 'py-1.5 px-3 text-sm',
        md: 'py-2 px-4 text-base', // Default size
        lg: 'py-3 px-6 text-lg',
    };
    const sizeStyle = sizeMap[size];

    // --- 3. Variant Styles (using your defined color palette) ---
    const variantMap = {
        primary: disabled
            ? 'bg-primary/50 text-white cursor-not-allowed'
            : 'bg-primary text-white shadow-md hover:bg-red-700 focus:ring-primary', // primary: '#FF6347'
        
        secondary: disabled
            ? 'bg-gray-400 text-white cursor-not-allowed'
            : 'bg-secondary text-white shadow-md hover:bg-gray-700 focus:ring-secondary', // secondary: '#333333'
        
        outline: disabled
            ? 'border border-gray-300 text-gray-400 cursor-not-allowed'
            : 'border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    };
    const variantStyle = variantMap[variant];

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyle} ${sizeStyle} ${variantStyle} ${className}`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;