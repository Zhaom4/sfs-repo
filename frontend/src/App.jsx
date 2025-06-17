import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
 
import { Routes, Route} from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Routes>
      <Route path='/' element={<WelcomePage/>}/>
      {/* <Route path='/auth' element={<Authorization/>}/> */}
      <Route path='/mainpg' element={<MainPage/>}/>
    </Routes>
    </>

  )
}

export default App
