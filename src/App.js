import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TaskList from './TaskList';
import AddTask from './AddTask';
import Home from './Home';
import FooterComp from './FooterComp';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/AddTask" exact element={<AddTask />} />
          <Route path="/List" exact element={<TaskList />} />
        </Routes>
      </Router>
      <FooterComp/>
      <ToastContainer />
    </div>
  );
}

export default App;
