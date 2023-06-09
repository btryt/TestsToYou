import React, {  useRef, useState,useEffect } from 'react'
import ReCAPTCHA from "react-google-recaptcha";

import {
    Container,
    Grid,
    FormGroup,
    TextField,
    Paper,
    Button,
    Typography
  } from "@material-ui/core"
  import { makeStyles } from "@material-ui/core/styles"
import Alert from './Alert'
import { useAuth } from '../hooks/useAuth';
  
  const useStyles = makeStyles((theme) => ({
    input:{
        margin:theme.spacing(1),
    },
    paper:{
        padding:theme.spacing(2),
        height:"400px",
        
        display:"flex",
        flexDirection:"column",
        justifyContent:"center",
        alignItems:"center"
    },
    button:{
        margin: theme.spacing(1),
        padding: theme.spacing(1)
    },
    form:{
      width:"100%"
    }
  }))
const Login = () =>{
    const {login} = useAuth()
    const [validRecaptcha,setValidRecaptcha] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const styles = useStyles()
    const loginEmail = useRef()
    const loginPassword = useRef()


    useEffect(()=>{
      if(errorMessage){
        setTimeout(()=>{
          setErrorMessage(null)
        },10000)
      }
    },[errorMessage])
    return (
        
        <Container style={{minHeight:"80vh",display:"flex"}} maxWidth="lg">
          <Grid
            container
            alignItems="center"
            justify="center"
            
          >
            <Grid item  md={7} xs={12} >
             <Paper elevation={3} className={styles.paper}>
               <Typography variant="h6">Войти</Typography>
              <FormGroup className={styles.form} >
                <TextField inputRef={loginEmail} type="email" className={styles.input}variant="outlined" autoFocus label="Почта"/>
                <TextField inputRef={loginPassword} type="password" className={styles.input} variant="outlined" label="Пароль"/>
                <Button onClick={() => login({setErrorMessage,loginEmail,loginPassword})} className={styles.button} variant="contained" color="primary">
                    Войти
                </Button>
              </FormGroup>
              {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
            </Paper>
            </Grid>
          </Grid>
        </Container>
        
    
    )
}

export default Login