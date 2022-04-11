import './static/css/styles.css'
import './static/css/font-awesome.css';
import './static/css/dialog.css';
import './static/css/bootstrap.min.css';

import { BrowserRouter } from "react-router-dom";
import MainRouter from "./components/MainRouter";
import ToastContainer from './components/toast/ToastContainer'

function App() {

  return (
    <div className="vh-100">
      <BrowserRouter>
        <ToastContainer />
        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
