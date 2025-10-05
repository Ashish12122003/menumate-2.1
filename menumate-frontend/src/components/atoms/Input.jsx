// src/components/atoms/Input.jsx

import React from 'react';

/**
 * A reusable Input component styled with Tailwind CSS.
 *
 * @param {string} type - HTML input type (e.g., 'text', 'password', 'number').
 * @param {string} placeholder - Placeholder text.
 * @param {string} value - The current value of the input.
 * @param {function} onChange - Change handler function.
 * @param {boolean} disabled - Whether the input is disabled.
 * @param {string} className - Additional CSS classes to apply.
 * @param {object} rest - Other standard input attributes (name, id, required, etc.).
 */
const Input = React.forwardRef(({
    type = 'text',
    placeholder = '',
    value,
    onChange,
    disabled = false,
    className = '',
    ...rest
}, ref) => {

    const baseStyle = 
        'w-full p-3 border border-gray-300 rounded-lg ' +
        'text-gray-700 transition-shadow duration-200 ' +
        'focus:ring-2 focus:ring-accent focus:border-accent'; 
        // Using 'accent' color for focus ring as defined in the Frontend Docs [cite: 279]

    const disabledStyle = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
    
    // Combine styles, prioritizing custom className
    const finalClassName = `${baseStyle} ${disabledStyle} ${className}`;

    return (
        <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={finalClassName}
            {...rest}
        />
    );
});

Input.displayName = 'Input';

export default Input;