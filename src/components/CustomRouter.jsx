import { createBrowserRouter } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import MainPage from './pages/customer/MainPage'
import { Routes, Route} from 'react-router-dom'
import CoursePage from './pages/customer/CoursePage'
import Favorites from './pages/customer/Favorites'
import { useEffect, useRef } from 'react'
import { CourseProvider } from './contexts/CourseContext'
import MyCourses from './pages/customer/MyCourses'
import Donations from './pages/customer/Donations'
import { CursorProvider } from './contexts/CursorContext'
import SignupPage from './pages/SignupPage'
import { UserProvider } from './contexts/UserContext'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPasswordPage from './pages/ResetPasswordPage'
import Settings from './pages/customer/Settings'
import Tutor from './pages/customer/Tutoring'

const router = createBrowserRouter([
  {
    path: '/',
    element: <WelcomePage />,
  },
  {
    path: 'mainpg',
    element: {
            <ProtectedRoute>
            <MainPage />
            </ProtectedRoute>},
  }
]);
export default router;
