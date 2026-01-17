/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Status colors for tuition payment
                paid: '#10b981', // green
                unpaid: '#ef4444', // red
                // Primary brand colors - warm, professional tones
                primary: {
                    50: '#fef3e2',
                    100: '#fde4b8',
                    200: '#fbd48a',
                    300: '#f9c35c',
                    400: '#f7b73a',
                    500: '#f5ab18',
                    600: '#f3a015',
                    700: '#f09211',
                    800: '#ee840e',
                    900: '#eb6808',
                },
            },
            screens: {
                // Mobile-first breakpoints
                'xs': '360px',
                'sm': '640px',
            },
            minHeight: {
                'touch': '44px', // Minimum touch target size
            },
            minWidth: {
                'touch': '44px',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
