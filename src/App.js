import './App.css';
import Navbar from './Components/navbar';
import Topbar from './Components/topbar';
import Project from './Components/project';
import Login from './Components/login';
import Signup from './Components/signup';
import Dashboard from './Components/dashboard';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from './Components/contexts/AuthContext';
import PrivateRoute from './Components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider >
        <Routes>
          <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='dashboard' element={<Dashboard/>}/>
          </Route>
          <Route index path='/' element={<Navigate to='dashboard' replace />} />
          <Route path='login' element={<Login />} />
          <Route path='signup' element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
