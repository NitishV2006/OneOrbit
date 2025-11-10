import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './hooks/useTheme';

// FIX: The global JSX namespace declaration has been moved to types.ts to be loaded with other type definitions.
// This ensures it's available across the entire application's type-checking context.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const RootSpinner: React.FC = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    backgroundColor: 'var(--bg-primary)' 
  }}>
    <div className="animate-spin" style={{
      borderRadius: '50%',
      width: '4rem',
      height: '4rem',
      borderTop: '4px solid var(--color-primary)',
      borderRight: '4px solid transparent',
      borderBottom: '4px solid var(--color-primary)',
      borderLeft: '4px solid transparent',
    }} />
  </div>
);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Suspense fallback={<RootSpinner />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </React.StrictMode>
);
