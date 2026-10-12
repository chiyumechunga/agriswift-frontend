// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './index.css';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { refetchOnWindowFocus: false, retry: 2, staleTime: 1000 * 60 * 5 },
        mutations: { retry: 0 }, // auth mutations shouldn't silently retry
    },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        {/* Order matters:
            QueryClient  → so auth + pages can use useQuery/useMutation
            BrowserRouter → the ONE and ONLY router in the app
            AuthProvider  → inside the router, so guards can use <Navigate>/useLocation */}
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>
);