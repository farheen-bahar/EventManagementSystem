import {Routes, Route,  Navigate} from 'react-router-dom'

import Header from './components/Header/Header';
import Form from './components/Form/Form';
import './styles.css'
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';

function App() {
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path='/' element={<Form/>}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='*' element={<Navigate replace to="/home"/>}/>
      </Routes>
    </div>
  );
}

export default App;
