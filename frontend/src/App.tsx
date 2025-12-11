import ErrorBoundary from '@/shared/components/ErrorBoundary';
import Router from './router';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
