import { FC } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CallsPage from './pages/CallsPage';

const App: FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CallsPage />} />
      </Routes>
    </Router>
  );
};

export default App;