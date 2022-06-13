import React, { useCallback, useRef, useState } from 'react'
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
import { useNavigate } from 'react-router-dom'
  
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
const Login = ({setLogin}) =>{
    const location = useNavigate()
    const [validRecaptcha,setValidRecaptcha] = useState(false)
    const [error,setError] = useState('')
    const [message,setMessage] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const styles = useStyles()
    const regEmail = useRef()
    const regPassword = useRef()
    const loginEmail = useRef()
    const loginPassword = useRef()

    const registration = useCallback(()=>{
      setError('')
      setErrorMessage('')
      setMessage('')
      if(regEmail.current.value.trim() && regPassword.current.value.trim() && validRecaptcha){
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        if(!re.test(regEmail.current.value.trim())){
          setError("Невалидный формат почты")
        }
        else if(regPassword.current.value.trim().length < 7 || regPassword.current.value.trim().length > 20){
          setError("Длина пароля должа быть от 7 до 20 символов")
        }
        else if(!error.trim()){
          fetch("/api/registration",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email:regEmail.current.value.trim(),password:regPassword.current.value.trim()})})
          .then(async res =>{
            let response = await res.json()
            if(res.ok) setMessage(response.message)
            else setErrorMessage(response.message)
            setValidRecaptcha(false)
          })
         
        }
      }
    },[error,validRecaptcha])

    const login = useCallback(()=>{
      setErrorMessage("")
      if(loginEmail.current.value.trim() && loginPassword.current.value.trim()){
        fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email:loginEmail.current.value.trim(),password:loginPassword.current.value.trim()})})
        .then(async res =>{
          let response = await res.json()
          if(res.ok){
            setLogin(response)
            location("/profile/test/list",{replace:true})
          }
          else setErrorMessage(response.message)
        })
      } 
    },[setLogin,location])

    const recaptcha = useCallback(() =>{
      setValidRecaptcha(true)
    },[])
    const expiredRecaptcha = useCallback(() =>{
      setValidRecaptcha(false)
    },[])
    return (
        <main>
        <Container style={{width:"100%"}} maxWidth="lg">
          <Grid
            container
            spacing={5}
            alignItems="center"
            justify="center"
            style={{ height: "80vh" }}
          >
            <Grid item sm={6}>
             <Paper elevation={3} className={styles.paper}>
               <Typography variant="h6">Войти</Typography>
              <FormGroup className={styles.form} >
                <TextField inputRef={loginEmail} type="email" className={styles.input} variant="outlined" label="email"/>
                <TextField inputRef={loginPassword} type="password" className={styles.input} variant="outlined" label="password"/>
                <Button onClick={login} className={styles.button} variant="outlined" color="primary">
                    Войти
                </Button>
              </FormGroup>
              {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
            </Paper>
            </Grid>
            <Grid item sm={6}>
             <Paper elevation={3} className={styles.paper}>
             <Typography variant="h6">Регистрация</Typography>
              <FormGroup className={styles.form} >
                <TextField inputRef={regEmail} type="email" className={styles.input} variant="outlined" label="email"/>
                <TextField inputRef={regPassword} type="password" className={styles.input} variant="outlined" label="password"/>
                <small style={{marginLeft:"8px"}}>Пароль должен быть от 7 до 20 символов</small>
                <Button onClick={registration} className={styles.button} variant="outlined" color="primary">
                    Регистрация
                </Button>
               <ReCAPTCHA sitekey="6LdCqbYbAAAAAKPcfcFUHPrEfBchHSOJlBaG3U0-" onExpired={expiredRecaptcha} onChange={recaptcha}/>
  
              </FormGroup>
              {error && <Alert variant="error">{error}</Alert>}
              {errorMessage && <Alert variant="error">{errorMessage}</Alert>}
              {message && <Alert>{message}</Alert>}
            </Paper>
            </Grid>
          </Grid>
        </Container>
        
      </main>
    )
}

export default React.memo(Login)