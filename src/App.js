import "./App.css"
import React from 'react'
import { Switch, Route } from "react-router-dom"
import Header from "./components/Header"
import Login from './components/Login'
import Profile from "./components/Profile"
import Test from './components/Test'
import Result from "./components/Result"
import Context from './components/context/context'
import { useEffect, useState } from "react"
import Home from "./components/Home"
import Find from "./components/Find"
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
  // const changeTheme = React.memo(()=>createMuiTheme(getTheme(theme)),[theme])

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
      
      <Switch>
        <Route path="/" exact component={Home}/>
        {(loaded && !auth) && <Route path="/login" render={()=><Login setLogin={setLogin} />} />}
        {(loaded && auth) && <Route path="/profile" component={Profile} />}
        <Route path="/test/:url" component={Test} />
        <Route path="/find" component={Find}/>
        <Route path="/result/:url" component={Result} />
      </Switch>
      
    </MuiThemeProvider>
    </Context.Provider>
  )
}

export default React.memo(App)
