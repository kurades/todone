import './App.css';
import Navbar from './Components/navbar';
import Topbar from './Components/topbar';
import Project from './Components/project';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes
} from "react-router-dom";
function App() {
  return (
    <Router>
        <Navbar />
        <div className="ml-72 mt-10">
          <Topbar />
          
        </div>
        <Routes>
          <Route path='/' element={<Project/>} />
        </Routes>
    </Router>
  );
}

export default App;
