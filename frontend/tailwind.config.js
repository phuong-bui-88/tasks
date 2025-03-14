export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'dropdownFade': 'dropdownFade 0.2s ease',
                'fadeIn': 'fadeIn 0.3s ease',
            },
            keyframes: {
                dropdownFade: {
                    '0%': { opacity: 0, transform: 'translateY(-8px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: 0, transform: 'translateY(-10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
            },
        },
    },
    plugins: [],
}
