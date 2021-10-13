import React, { useContext,useCallback} from 'react'
import {Link, useHistory} from 'react-router-dom'
import Context from './context/context'
import {
AppBar,
Button,
Container,
Toolbar,
Typography,
Menu,
MenuItem
} 
from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useEffect } from 'react'
const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      textDecoration:"none"
    },
    menuButton: {
      marginRight: theme.spacing(2),
      borderColor: "gray",
      color:"white"
    },
    title: {
      flexGrow: 1,
    },
  }))

const Header = () =>{
    const styles= useStyles()
    const history = useHistory()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [blackTheme,setBlackTheme] = React.useState(false)
    const context = useContext(Context)

    useEffect(()=>{
      if(localStorage.getItem("theme") === 'black'){
        setBlackTheme(true)
        document.body.style.background = "#2C2929"
      }
      else{ 
        setBlackTheme(false)
        document.body.style.background = "#F7F7F7"
      }
    },[])
    const handleClick = useCallback((event) => {
      setAnchorEl(event.currentTarget);
    },[]);
  
    const handleClose = useCallback(() => {
      setAnchorEl(null);
    },[]);

    const changeTheme = useCallback(()=>{
      localStorage.setItem("theme",localStorage.getItem("theme")==="black"?"white":"black")
      setBlackTheme(localStorage.getItem('theme') === "black" ? true : false)
      document.body.style.background = `${localStorage.getItem("theme") === "black" ? "#2C2929" : "#F7F7F7"}`
    },[])
    useEffect(()=>{
      context.setTheme(blackTheme)
    },[blackTheme,context])
    const logOut = useCallback((e) =>{
      e.preventDefault()
      if(context.auth) fetch("/api/logout",{method:"POST"}).then(()=>{history.replace('/login');context.setAuth(false)})
    },[context,history])
    return (
        <AppBar title="TestToYou" position="static" style={{background: blackTheme && "#353535"}}>
        <Container >
          <Toolbar>
            <Typography variant="h6" className={styles.title}>
              Test<span style={{color:"lime"}}>To</span>You
            </Typography>
            {(context.loaded && !context.auth) ? <Button variant="outlined" className={styles.menuButton}>
              <Link style={{color:"white"}} to="/login">Войти</Link>
            </Button>:<Button onClick={handleClick} variant="outlined" className={styles.menuButton}>
              Меню
            </Button>
            }
            <Menu anchorEl={anchorEl}  open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}><Link className="menu-link" to="/profile">Профиль</Link></MenuItem>
              <MenuItem onClick={handleClose}><Link className="menu-link" to="/find">Поиск</Link></MenuItem>
              <MenuItem onClick={handleClose}><a className="menu-link" onClick={logOut} href="/#">Выйти</a></MenuItem>
            </Menu>
            <div onClick={changeTheme} style={{userSelect:"none"}}>
            {blackTheme ?
            <span style={{color:"yellow", cursor:"pointer"}}>&#9728;</span>:
            <span style={{color:"black", cursor:"pointer"}}>&#127761;</span>
            }
          </div>
          </Toolbar>
        </Container>
      </AppBar>
    )
}

export default React.memo(Header)