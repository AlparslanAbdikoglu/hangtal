import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n/config';

import { MyStoreProvider } from './MyStoreContext';

createRoot(document.getElementById('root')!).render(
  
    <MyStoreProvider>
      <App />
    </MyStoreProvider>
);
