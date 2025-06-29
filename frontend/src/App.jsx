import './App.css'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<WelcomePage/>}/>
      {/* <Route path='/auth' element={<Authorization/>}/> */}
      <Route path='/mainpg' element={<MainPage/>}/>
      <Route path='/course/:id' element={<CoursePage/>}/>
      <Route path='/favorites' element={<Favorites/>}/>
    </Routes>
    </>

  )
}

export default App
