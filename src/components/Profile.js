import React, { useState,useCallback } from "react"
import { Container, Paper, Grid, Tabs,Tab } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import TestsList from "./TestsList"
import Create from "./Create"
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


const changeHandler = useCallback((e,newValue) =>{
  setActive(newValue)
},[])
  return (
    <main>
      <Container className={styles.container} >
        <Grid container spacing={1} justify="center">
          <Grid xs={11} item>
            <Paper >
            <Tabs onChange={changeHandler} variant="fullWidth" value={active} >
                <Tab className={styles.tabs} label="Мои тесты" />
                <Tab className={styles.tabs} label="Создать тест" />
            </Tabs>
            </Paper>
            
            {active === 0 ? <TestsList  /> : <Create setActive={setActive}/>}
            
          </Grid>
        </Grid>
      </Container>
    </main>
  )
}

export default Profile
