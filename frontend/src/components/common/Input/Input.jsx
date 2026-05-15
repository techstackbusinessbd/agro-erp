import React, { useState } from 'react';
import './Input.css';

export default function Input({ label, type = 'text', value, onChange, id, required = false, ...props }) {
    const [focused, setFocused] = useState(false);

    return (
        <div className={`material-input-group ${focused || value ? 'active' : ''}`}>
            <input
                id={id}
                type={type}
                className="material-input"
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                required={required}
                {...props}
            />
            <label htmlFor={id} className="material-label">{label}</label>
            <div className="material-line"></div>
        </div>
    );
}
