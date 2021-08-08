import React, { useContext, useEffect } from 'react'
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
    const context = useContext(Context)

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };

    const logOut = (e) =>{
      e.preventDefault()
      if(context.auth) fetch("/api/logout",{method:"POST"}).then(()=>{history.replace('/login');context.setAuth(false)})
    }
    return (
        <AppBar title="TestToYou" position="static">
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
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              <MenuItem onClick={handleClose}><Link to="/profile">Профиль</Link></MenuItem>
              <MenuItem onClick={handleClose}><a onClick={logOut} href="/#">Выйти</a></MenuItem>
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>
    )
}

export default React.memo(Header)