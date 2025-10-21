/** @type {import('tailwindcss').Config} */
module.exports = {
  // Thay đổi: Thêm đường dẫn quét file
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './pages/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}