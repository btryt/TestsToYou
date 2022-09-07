import "./App.css"
import React from "react"
import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Login from "./components/Login"
import Registration from "./components/Registration"
import Profile from "./components/Profile"
import Test from "./components/Test"
import Result from "./components/Result"
import Create from "./components/Create"
import TestsList from "./components/TestsList"
import NotFound from "./components/NotFound"
import Find from "./components/Find"
import { PrivateRoute } from "./HOC/PrivateRoute"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useAuth } from "./hooks/useAuth"

let darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    text: {
      primary: "#fff",
      secondary: "#fff",
    },
  },
})

function App() {
  const { loaded, isAuth } = useAuth()

  return (
    <MuiThemeProvider theme={darkTheme}>
      <Header />

      <Routes>
        {loaded && !isAuth && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/registration" element={<Registration />} />
          </>
        )}
        {loaded && (
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }>
            <Route path="test/list" element={<TestsList />} />
            <Route path="test/create" element={<Create />} />
          </Route>
        )}
        <Route path="/test/:url" element={<Test />} />
        <Route path="/find" element={<Find />} />
        <Route path="/result/:url" element={<Result />} />
        {loaded && <Route path="*" element={<NotFound />}></Route>}
      </Routes>
    </MuiThemeProvider>
  )
}

export default React.memo(App)
