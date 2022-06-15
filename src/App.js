import "./App.css"
import React from 'react'
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Login from './components/Login'
import Registration from "./components/Registration"
import Profile from "./components/Profile"
import Test from './components/Test'
import Result from "./components/Result"
import Create from "./components/Create"
import TestsList from "./components/TestsList"
import NotFound from "./components/NotFound"
import Context from './components/context/context'
import { useEffect, useState } from "react"
import Home from "./components/Home"
import Find from "./components/Find"
import {PrivateRoute} from "./HOC/PrivateRoute"
import {createMuiTheme,MuiThemeProvider} from '@material-ui/core/styles'

let darkTheme = createMuiTheme({
  palette:{
    type:"dark",
    text:{
      primary:"#fff",
      secondary:"#fff"
    }
  }
})

function App() {
  const [loaded,setLoaded] = useState(false)
  const [login,setLogin] = useState(0)
  const [auth,setAuth] = useState(false)

  useEffect(()=>{
    setLoaded(false)
    fetch("/api/auth")
    .then(async res=>{
      let response = await res.json()
      setAuth(response.auth)
      setLoaded(true)
    })
  },[login])
  return (
    <Context.Provider value={{loaded,auth,setAuth}}>
      <MuiThemeProvider theme={darkTheme} >
      <Header />
      
      <Routes>
        <Route path="/" element={<Home/>}/>
        {(loaded && !auth) && <>
          <Route path="/login" element={<Login setLogin={setLogin}/>}/>
          <Route path="/registration" element={<Registration/>}/>
        </>}
        {loaded && <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>} >
            <Route path="test/list" element={<TestsList/>}/>
            <Route path="test/create" element={<Create/>}/>
        </Route>
        }
        <Route path="/test/:url" element={<Test/>} />
        <Route path="/find" element={<Find/>}/>
        <Route path="/result/:url" element={<Result/>} />
        {loaded && <Route path="*" element={<NotFound/>}></Route>}
      </Routes>
    </MuiThemeProvider>
    </Context.Provider>
  )
}

export default React.memo(App)
