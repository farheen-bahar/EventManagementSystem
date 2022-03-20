import {Routes, Route, Navigate} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header/Header';
import Form from './components/Form/Form';
import './styles.css'
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import ReactDOM from 'react-dom';
import Spinner from './components/Spinner/Spinner';
import { useState  } from 'react';
import SessionContextProvider, { SessionConsumer } from './components/SessionCookie/SessionCookie';
import EventDetails from './components/Events/EventDetails';

function App() {
  const [user, setUser] = useState({})
 
  return (
    <SessionContextProvider>
    {
      ReactDOM.createPortal( <Spinner show={false}/>,document.getElementById('spinner-root'))
    }
    
        <div className="App">
        <Header />
        <Routes>
          <Route path='/login' element={<Form/>}/>
          <Route path='/events/details'  element={<EventDetails/>}/>
          <Route path='/events' element={<Home/>} />
          <Route path='/admin' element={<Admin/>}/>          
          <Route path='*' element={<Navigate replace to="/events"/>}/>
        </Routes>
      </div>
     
    </SessionContextProvider>
  );
}

export default App;
