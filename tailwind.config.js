/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { red: { 50:'#fdf2f2',100:'#fbe0e0',600:'#c8102e',700:'#a50d26',800:'#850a1e' }, gold: { 100:'#f7efd2',400:'#d4af37',600:'#a8841c' } },
      fontFamily: { sans: ['"Noto Sans"','"Noto Sans SC"','"PingFang SC"','"Microsoft YaHei"','system-ui','sans-serif'] }
    }
  },
  plugins: []
}
