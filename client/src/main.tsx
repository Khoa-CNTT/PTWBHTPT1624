import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AppWrapper } from './components/common/PageMeta.tsx';
import './index.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // hoặc theme khác
import 'primereact/resources/primereact.min.css';
import 'swiper/swiper-bundle.css';
import 'simplebar-react/dist/simplebar.min.css';
createRoot(document.getElementById('root')!).render(
    <ThemeProvider>
        <AppWrapper>
            <App />
        </AppWrapper>
    </ThemeProvider>,
);
