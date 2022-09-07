import React, { useState,useCallback, useEffect } from "react"
import { Container, Paper, Grid, Tabs,Tab } from "@material-ui/core"
import { Outlet,useNavigate,useLocation } from "react-router-dom"
import { makeStyles } from "@material-ui/core/styles"
import { useAuth } from "../hooks/useAuth"
const useStyles = makeStyles(theme =>({
    tabs:{
        flexGrow: 1,
        width:"100%"
    },
    container:{
        marginTop:theme.spacing(1),
        
    }
}))

const Profile = () => {
const [active,setActive] = useState(0)
const styles = useStyles()
const navigate = useNavigate()
const location = useLocation()


const changeHandler = useCallback((e,value) =>{

  if(value === 0) navigate("test/list")
  else navigate("test/create")
  setActive(value)
},[navigate])
  useEffect(()=>{
   let path = location.pathname.split("/").pop()
   if(path === "list"){
     setActive(0)
   }else setActive(1)

  },[location.pathname])
  return (
    
      <Container className={styles.container} >
        <Grid container  spacing={1} justify="center" >
          <Grid xs={12} item >
            <Paper >
            <Tabs onChange={changeHandler} variant="fullWidth" value={active} >
                <Tab className={styles.tabs} label="Мои тесты" />
                <Tab className={styles.tabs} label="Создать тест" />
            </Tabs>
            </Paper>
            
              <Outlet/>
            
          </Grid>
        </Grid>
      </Container>
    
  )
}

export default Profile
