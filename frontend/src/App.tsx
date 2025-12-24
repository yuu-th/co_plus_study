import { QueryClientProvider } from '@tanstack/react-query';
import ErrorBoundary from '@/shared/components/ErrorBoundary';
import { queryClient, AuthProvider } from '@/lib';
import Router from './router';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
