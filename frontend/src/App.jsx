import React from 'react'
import Home from './pages/Home'
import { useEffect } from 'react'
import getCurrentUser from './features/getCurrentUser'
import { useDispatch } from 'react-redux'
import { setUserData } from './Redux/userSlice'
const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser()
      dispatch(setUserData(user))
      
    }
    getUser()
  }, [])
  return (
    <>
      <Home />
    </>
  )
}

export default App