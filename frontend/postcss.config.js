/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // Usamos el nuevo plugin aquí
    autoprefixer: {},
  },
}