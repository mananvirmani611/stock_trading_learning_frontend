
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authentication from './components/Authentication';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Authentication />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
