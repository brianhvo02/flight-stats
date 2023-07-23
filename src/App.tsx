import './App.scss';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Flight from './pages/Flight';

const App = () => {
    return (
        <div className="app">
            <Routes>
                <Route path='/' Component={Home} />
                <Route path='/flights/:flightId' Component={Flight} />
            </Routes>
        </div>
    );
}

export default App;
