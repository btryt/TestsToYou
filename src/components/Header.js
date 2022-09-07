import React, { useCallback } from "react"
import { Link } from "react-router-dom"
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Box,
  Drawer,
  List,
  ListItem,
  Divider,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import { useAuth } from "../hooks/useAuth"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textDecoration: "none",
  },
  menuButton: {
    marginRight: "8px",
    borderColor: "gray",
    color: "white",
  },
  "menu-link": {
    color: "white",
    width: "100%",
    padding: theme.spacing(2),
  },
  list: {
    padding: 0,
  },
  title: {
    flexGrow: 1,
  },
  smMenu: {
    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  linkList: {
    [theme.breakpoints.up("xs")]: {
      display: "block",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
}))

const Header = () => {
  const {logOut,isAuth,loaded} = useAuth()
  const styles = useStyles()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [open, setOpen] = React.useState(false)


  const handleClick = useCallback((event) => {
    setAnchorEl(event.currentTarget)
  }, [])

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])


  const toggleHandler = useCallback((op)=>{
      setAnchorEl(null)
      setOpen(op)
  },[])
  return (
    <>
      <AppBar
        title="TestToYou"
        position="static"
        style={{ background: "#353535" }}
      >
        <Container>
          <Toolbar>
            <Typography variant="h6" className={styles.title}>
              Test<span style={{ color: "lime" }}>To</span>You
            </Typography>
            {loaded && !isAuth ? (
              <>
                <Box className={styles.linkList}>
                  <Link style={{ color: "white" }} to="/login">
                    <Button variant="outlined" className={styles.menuButton}>
                      Войти
                    </Button>
                  </Link>
                  <Link style={{ color: "white" }} to="/registration">
                    <Button variant="outlined" className={styles.menuButton}>
                      Регистрация
                    </Button>
                  </Link>
                </Box>
                <Box className={styles.smMenu}>
                  <Button  onClick={handleClick}   variant="outlined" className={styles.menuButton}  >
                    <span style={{ fontSize: "20px" }} onClick={()=>toggleHandler(true)}>&#8801;</span>
                  </Button>
                  </Box>
                  </>):<><Box className={styles.linkList}>
                  <Button onClick={handleClick} variant="outlined" className={styles.menuButton} > Меню </Button>
                   <Menu anchorEl={anchorEl}  open={Boolean(anchorEl)} onClose={handleClose}>
                     <MenuItem onClick={handleClose}>
                       <Link style={{ color: "white" }} className="menu-link" to="/profile/test/list" > Профиль</Link>
                      </MenuItem>
                     <MenuItem onClick={handleClose}>
                      <Link style={{ color: "white" }} className="menu-link"  to="/find" > Поиск</Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <a style={{ color: "white" }} className="menu-link" onClick={(e)=>logOut(e)}href="/#" > Выйти  </a>
                      </MenuItem>
                    </Menu> 
                  </Box>
                    <Box className={styles.smMenu}>
                    <Button  onClick={() =>toggleHandler(true)}   variant="outlined" className={styles.menuButton}  >
                      <span style={{ fontSize: "20px" }} onClick={()=>toggleHandler(true)}>&#8801;</span>
                    </Button>
                    </Box>
                  </>
                  }
                  <Box className={styles.smMenu}>
                  <Drawer anchor="top" open={open} onClose={()=>toggleHandler(false)}>
                    {(!isAuth ? [
                      { text: "Регистрация", link: "/registration" },
                      { text: "Войти", link: "/login" },
                      { text: "Поиск", link: "/find" },
                    ]:[
                      { text: "Профиль", link: "/profile/test/list" },
                      { text: "Поиск", link: "/find" },
                      { text: "Выйти", link: "" },
                    ]).map((obj) => (
                      <React.Fragment key={obj.text}>
                        <List className={styles.list}>
                          <ListItem className={styles.list}>
                            {obj.text !== "Выйти" ? <Link to={obj.link} onClick={()=>toggleHandler(false)} className={styles["menu-link"]}>
                              {obj.text}
                            </Link>:<a  className={styles["menu-link"]} onClick={(e)=>{logOut(e);toggleHandler(false)}}href="/login" > Выйти  </a>}
                          </ListItem>
                        </List>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </Drawer>
              </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default React.memo(Header)