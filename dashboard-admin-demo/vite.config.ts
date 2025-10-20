// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//       '@mui/styled-engine': '@emotion/styled', // ✅ trỏ đúng engine
//     },
//   },
// });

// // vite.config.ts
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// // import path from 'path';

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     alias: {
//     },
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
