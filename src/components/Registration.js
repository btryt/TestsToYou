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
    const [validRecaptcha,setValidRecaptcha] = useState(true)
    const styles = useStyles()
    const [message,setMessage] = useState('')
    const [errorMessage,setErrorMessage] = useState('')
    const regEmail = useRef()
    const regPassword = useRef()

    const registration = useCallback(()=>{
        setErrorMessage('')
        setMessage('')
        if(regEmail.current.value.trim() && regPassword.current.value.trim() && validRecaptcha){
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          
          if(!re.test(regEmail.current.value.trim())){
            setErrorMessage("Невалидный формат почты")
          }
          else if(regPassword.current.value.trim().length < 7 || regPassword.current.value.trim().length > 20){
            setErrorMessage("Длина пароля должа быть от 7 до 20 символов")
          }
          else if(!errorMessage.trim()){
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
      },[errorMessage,validRecaptcha])

      const recaptcha = useCallback(() =>{
        setValidRecaptcha(true)
      },[])
      const expiredRecaptcha = useCallback(() =>{
        setValidRecaptcha(false)
      },[])

      useEffect(()=>{
        if(errorMessage){
          setTimeout(()=>{
            setErrorMessage(null)
          },10000)
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
          <Grid item sm={7}>
           <Paper elevation={3} className={styles.paper}>
           <Typography variant="h6">Регистрация</Typography>
            <FormGroup className={styles.form} >
              <TextField inputRef={regEmail} type="email" className={styles.input} variant="outlined" autoFocus  label="email"/>
              <TextField inputRef={regPassword} type="password" className={styles.input} variant="outlined" label="password"/>
              <small style={{marginLeft:"8px"}}>Пароль должен быть от 7 до 20 символов</small>
              <Button onClick={registration} className={styles.button} variant="contained" color="primary">
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