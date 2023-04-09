import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Join from './components/Join'
import Main from './components/Main'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Join/>}/>
          <Route path='/main' element={<Main/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
