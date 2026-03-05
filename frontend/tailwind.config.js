/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#f3f4f6",
                glass: "rgba(255, 255, 255, 0.7)",
                glassBorder: "rgba(255, 255, 255, 0.3)",
            },
        },
    },
    plugins: [],
};
