import Router from './router';
import ErrorBoundary from './components/common/ErrorBoundary';
import './styles/global.css';

function App() {
  return (
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  );
}

export default App;
