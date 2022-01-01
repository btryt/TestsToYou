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
const useStyles = makeStyles((t) => ({
    root: {
      flexGrow: 1,
      textDecoration:"none"
    },
    menuButton: {
      marginRight: "8px",
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
    
    const context = useContext(Context)

    
    const handleClick = useCallback((event) => {
      setAnchorEl(event.currentTarget);
    },[]);
  
    const handleClose = useCallback(() => {
      setAnchorEl(null);
    },[]);

    const logOut = useCallback((e) =>{
      e.preventDefault()
      if(context.auth) fetch("/api/logout",{method:"POST"}).then(()=>{history.replace('/login');context.setAuth(false)})
    },[context,history])
    return (
        <AppBar title="TestToYou" position="static" style={{background:"#353535"}}>
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
            <Menu anchorEl={anchorEl}   open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}><Link style={{color:"white"}} className="menu-link" to="/profile">Профиль</Link></MenuItem>
              <MenuItem onClick={handleClose}><Link style={{color:"white"}} className="menu-link" to="/find">Поиск</Link></MenuItem>
              <MenuItem onClick={handleClose}><a style={{color:"white"}} className="menu-link" onClick={logOut} href="/#">Выйти</a></MenuItem>
            </Menu>
            
          </Toolbar>
        </Container>
      </AppBar>
    )
}

export default React.memo(Header)