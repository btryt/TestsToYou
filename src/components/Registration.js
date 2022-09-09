import React, { useCallback, useRef, useState,useEffect } from 'react'
import {
    Container,
    Grid,
    FormGroup,
    TextField,
    Paper,
    Button,
    Typography,
  } from "@material-ui/core"
  import { makeStyles } from "@material-ui/core/styles"
  import Alert from './Alert'
import { useAuth } from '../hooks/useAuth'

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


  const Registration = () =>{
    const {registration} = useAuth()
    const [validRecaptcha,setValidRecaptcha] = useState(true)
    const styles = useStyles()
    const [message,setMessage] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const regEmail = useRef()
    const regPassword = useRef()
    const userLogin = useRef()

      const recaptcha = () =>{
        setValidRecaptcha(true)
      }
      const expiredRecaptcha = () =>{
        setValidRecaptcha(false)
      }

      useEffect(()=>{
        if(errorMessage){
          setTimeout(()=>{
            setErrorMessage("")
          },4000)
        }
      },[errorMessage])

    return (
        <Container style={{width:"100%",height:"80vh",display:"flex"}} maxWidth="lg">
        <Grid
          container
          spacing={5}
          alignItems="center"
          justify="center"
         
        >
          <Grid item md={7} xs={12}>
           <Paper elevation={3} className={styles.paper}>
           <Typography variant="h6">Регистрация</Typography>
            <FormGroup className={styles.form} >
              <TextField inputRef={userLogin} type="login" helperText="Длина логина не более 10 символов" className={styles.input}variant="outlined" autoFocus label="Логин"/>
            
              <TextField inputRef={regEmail} type="email" className={styles.input} variant="outlined"  label="Почта"/>
              <TextField inputRef={regPassword} type="password" helperText="Пароль должен быть от 7 до 20 символов" className={styles.input} variant="outlined" label="Пароль"/>
              
              <Button onClick={()=>registration({setErrorMessage,setMessage,regEmail,regPassword,userLogin,setValidRecaptcha,errorMessage})} className={styles.button} variant="contained" color="primary">
                  Регистрация
              </Button>
             {/* <ReCAPTCHA sitekey="6LdCqbYbAAAAAKPcfcFUHPrEfBchHSOJlBaG3U0-" onExpired={expiredRecaptcha} onChange={recaptcha}/> */}

            </FormGroup>
            {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
            {message && <Alert>{message}</Alert>}
          </Paper>
          </Grid>
        </Grid>
      </Container>
    )
  }
  
  export default Registration