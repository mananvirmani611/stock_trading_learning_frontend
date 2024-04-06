
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Authentication from './components/Authentication';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<Authentication />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
