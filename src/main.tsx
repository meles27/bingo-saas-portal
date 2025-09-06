import TimeAgo from 'javascript-time-ago';
import { createRoot } from 'react-dom/client';
import { IconContext } from 'react-icons';
import App from './App.tsx';
import './index.css';

import en from 'javascript-time-ago/locale/en';
import ru from 'javascript-time-ago/locale/ru';
import { ThemeProvider } from './components/theme-provider.tsx';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

createRoot(document.getElementById('root')!).render(
  <IconContext.Provider
    value={{
      size: '1.5rem',
      color: 'blue',
      className: 'text-neutral-600/60'
    }}>
    <ThemeProvider defaultTheme="dark" storageKey="theme-name">
      <App />
    </ThemeProvider>
  </IconContext.Provider>
);
