import React, { useRef } from 'react';
import './Button.css';

export default function Button({ children, onClick, type = 'button', disabled = false, fullWidth = false, loading = false, ...props }) {
    const buttonRef = useRef(null);

    // Ripple effect implementation
    const createRipple = (event) => {
        const button = buttonRef.current;
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add("ripple");

        const ripple = button.getElementsByClassName("ripple")[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
        
        if (onClick) onClick(event);
    };

    return (
        <button
            ref={buttonRef}
            type={type}
            className={`material-btn ${fullWidth ? 'full-width' : ''}`}
            onClick={createRipple}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? <span className="material-spinner"></span> : children}
        </button>
    );
}
