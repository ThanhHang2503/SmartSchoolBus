import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { StyledEngineProvider } from '@mui/material/styles';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import './index.css'
// import App from './App.tsx'
import AdminDashboard from './pages/adminDashboard'
const theme = createTheme();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AdminDashboard />
      </ThemeProvider>
    </StyledEngineProvider>
  </StrictMode>
);


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
