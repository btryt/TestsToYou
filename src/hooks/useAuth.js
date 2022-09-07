import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../components/context/authContext"
const AuthProvider = ({children})=>{
    const location = useNavigate()
    const [isAuth,setIsAuth] = useState(false)
    const [loaded,setLoaded] = useState(false)
    

    const checkAuth = () =>{
        setLoaded(false)
        fetch("/api/auth")
        .then(async res=>{
          let response = await res.json()
          setIsAuth(response.auth)
          setLoaded(true)
        })
    }

    useEffect(()=>{
        checkAuth()
    },[])


    const logOut = (e) => {
        e.preventDefault()
        fetch("/api/logout", { method: "POST" }).then((res)=>{
            if(res.ok){
                setIsAuth(false)
                location('/login',{replace:true})
            }
        })
    }

    const login = ({setErrorMessage,loginEmail,loginPassword})=>{
        setErrorMessage("")
        if(loginEmail.current.value.trim() && loginPassword.current.value.trim()){
          fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},
          body:JSON.stringify({email:loginEmail.current.value.trim(),password:loginPassword.current.value.trim()})})
          .then(async res =>{
            let response = await res.json()
            if(res.ok){
              checkAuth()
              location("/profile/test/list",{replace:true})
            }
            else setErrorMessage(response.message)
          })
        } 
      }

      const registration = ({setErrorMessage,setMessage,regEmail,regPassword,userLogin,setValidRecaptcha,errorMessage})=>{
        setErrorMessage('')
        setMessage('')
        if(regEmail.current.value.trim() && regPassword.current.value.trim() && userLogin.current.value.trim() ){
          const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          
          if(!re.test(regEmail.current.value.trim())){
            setErrorMessage("Невалидный формат почты")
          }
          else if(regPassword.current.value.trim().length < 7 || regPassword.current.value.trim().length > 20){
            setErrorMessage("Длина пароля должа быть от 7 до 20 символов")
          }
          else if(userLogin.current.value.trim().length > 10){
            setErrorMessage("Длина логина не более 10 символов")
          }
          else if(!errorMessage.trim()){
            fetch("/api/registration",{method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email:regEmail.current.value.trim(),password:regPassword.current.value.trim(),login:userLogin.current.value.trim()})})
            .then(async res =>{
              let response = await res.json()
              if(res.ok) setMessage(response.message)
              else setErrorMessage(response.message)
              setValidRecaptcha(false)
            })
           
          }
        }
      }
    return(
        <AuthContext.Provider value={{isAuth,setIsAuth,login,registration,logOut,loaded}}>
            {children}
        </AuthContext.Provider>
    )
}

export {AuthProvider}

export function useAuth() {
    return useContext(AuthContext)
}