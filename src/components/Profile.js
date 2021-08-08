import React, { useState,useCallback } from "react"
import { Container, Paper, Grid, Tabs,Tab,TabPanel,TabContext } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import EnhancedTable from "./MyTests"
import Create from "./Create"
const useStyles = makeStyles(theme =>({
    tabs:{
        flexGrow: 1,
        width:"100%"
    },
    container:{
        marginTop:theme.spacing(1)
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
            <Paper  >
            <Tabs onChange={changeHandler} variant="fullWidth" value={active} >
                <Tab className={styles.tabs} label="Мои тесты" />
                <Tab className={styles.tabs} label="Создать тест" />
            </Tabs>
            </Paper>
            <Paper elevation={7} style={{marginTop:"5px"}}>
              {active === 0 ? <EnhancedTable  /> : <Create setActive={setActive}/>}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </main>
  )
}

export default Profile
