import { useState, useEffect } from 'react';

export function useTheme() {
    const [theme, setTheme] = useState(() => {
        // Options: 'light', 'dark', 'system'
        return localStorage.getItem('agro_theme') || 'system';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        
        const applyTheme = (currentTheme) => {
            if (currentTheme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                root.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
            } else {
                root.setAttribute('data-theme', currentTheme);
            }
        };

        applyTheme(theme);
        localStorage.setItem('agro_theme', theme);

        // Listen for system theme changes if set to system
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (theme === 'system') applyTheme('system');
        };
        
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);

    }, [theme]);

    return { theme, setTheme };
}
