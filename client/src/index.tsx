import React from 'react';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

const container = document.getElementById('root');
const root = createRoot(container!); // createRoot(container!) if you use TypeScript
const user = JSON.parse(localStorage.getItem('user')!);

root.render(
    <React.StrictMode>
        <AuthProvider user={user}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>,
);