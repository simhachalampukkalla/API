import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import './index.css';
import App from './App.jsx';

function FallbackUI({ error, resetErrorBoundary }) {
    return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      background: "rgba(190, 54, 54, 0.2)",
      color: "white",
      zIndex: 9999
    }}>
      <h1>Something went wrong 🚨</h1>
      <p>{error.message}</p>
      <button style = {{ marginTop: "20px" }} className ="formbtn" onClick={resetErrorBoundary}>Retry</button>
    </div>
  );

}

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <ErrorBoundary
      FallbackComponent={FallbackUI}
      onReset={() => window.location.reload()}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>
);