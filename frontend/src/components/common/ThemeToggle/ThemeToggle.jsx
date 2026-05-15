import React from 'react';
import { useTheme } from '../../../hooks/useTheme';
import './ThemeToggle.css';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { id: 'light', icon: '☀️', label: 'Light' },
        { id: 'dark', icon: '🌙', label: 'Dark' },
        { id: 'system', icon: '💻', label: 'System' }
    ];

    const toggleTheme = () => {
        const currentIndex = themes.findIndex(t => t.id === theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex].id);
    };

    const currentThemeInfo = themes.find(t => t.id === theme);

    return (
        <button 
            className="theme-toggle-btn elevation-4" 
            onClick={toggleTheme}
            title={`Current Theme: ${currentThemeInfo.label}`}
        >
            {currentThemeInfo.icon}
        </button>
    );
}
