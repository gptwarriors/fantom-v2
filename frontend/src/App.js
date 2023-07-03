import './App.css';
import Dashboard from './components/Dashboard';
import HomePage from './components/HomePage';
import {
  BrowserRouter as Router,
  Route, Routes
} from "react-router-dom";
import WarriorPage from './components/WarriorPage';
import VideoPage from './components/NftPage'
import {Chain} from 'wagmi'
import { WagmiConfig, createConfig, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import Threetrial from './components/Threetrial';
import ChatPage from './components/chatpage';
import MyPage from './components/Mypage';







function App() {
  return (
    <div className="App">
        
      <Router>
        <Routes>
          <Route exact path="/" element={<MyPage/>}/>
          <Route exact path='/dashboard' element={<Dashboard />} />
          {/* <Route exact path='/mint' element={<HomePage />} /> */}
          <Route exact path='/mint' element={<WarriorPage />} />
          <Route  path='/nft/:id' element={<VideoPage/>} />
          <Route exact path='/three' element={<Threetrial/>}/>
          <Route path='/live' element={<ChatPage/>}/>
        </Routes>
      </Router>
     
    </div>
  );
}

export default App; 
