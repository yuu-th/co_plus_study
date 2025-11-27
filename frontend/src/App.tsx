import ErrorBoundary from './components/common/ErrorBoundary';
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
