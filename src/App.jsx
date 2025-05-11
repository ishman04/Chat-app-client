import React from "react"
import {Button} from "@/components/ui/button"
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom'
import Auth from "./pages/auth"
import Profile from "./pages/profile"
import Chat from "./pages/chat"
import { useAppStore } from "./store"
import { apiClient } from "./lib/api-client"

const PrivateRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to='/auth' />
}
const AuthRoute = ({children}) => {
  const {userInfo} = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to='/chat' /> : children
}

function App() {

  const {userInfo,setUserInfo} = useAppStore();
  const [loading,setLoading] = useState(true)

  useEffect(()=>{
    const getUserData = async()=>{
      try {
        const response = await apiClient.get()
      } catch (error) {
        
      }
    }
    if(!userInfo){
      getUserData()
    }
    else{
      setLoading(false);
    }
  },[userInfo,setUserInfo])

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
            }/>
          <Route path='/chat' element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
            }/>
          <Route path='/profile' element={<Profile/>}/>
          
          <Route path='*' element={<Navigate to='/auth'/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
