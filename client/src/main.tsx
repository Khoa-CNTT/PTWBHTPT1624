import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "simplebar-react/dist/simplebar.min.css";
import App from "./App.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { AppWrapper } from "./components/system/common/PageMeta.tsx";
import { store } from './redux/store';
import { Provider } from 'react-redux';
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
        <ThemeProvider>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ThemeProvider>
    </Provider>
  </StrictMode>
);
