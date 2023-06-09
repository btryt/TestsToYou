const {Router} = require("express")
const bcrypt = require("bcrypt")
const db = require("../db")
const router = Router()

router.post("/registration",async(req,res)=>{
    if(req.session.auth){
      return res.status(403).send({message:"Уже авторизован"})
    }
    const {email,password,login} = req.body
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
      return res.status(400).send({message:"Невалидный формат почты"})
    }
    if(password.length > 20 || password.length < 7){
      return res.status(400).send({message:"Длина пароля должна быть от 7 до 20 символов"})
    }
    if(login.length > 10){
      return res.status(400).send({message:"Длина логина не более 10 символов"})
    }
    const hash = bcrypt.hashSync(password,5)
    try{
        let userEmail = await db.query("SELECT email FROM users WHERE email = $1",[email])
        let userLogin = await db.query("SELECT login FROM users WHERE login = $1",[login])
        if(userEmail.rows.length){
             return res.status(403).send({message:"Пользователь с такой почтой уже зарегистрирован"})
        }
        else if(userLogin.rows.length){
            return res.status(403).send({message:"Пользователь с таким логином уже существует"})
        }
       else await db.query("INSERT INTO users (email,password,login) VALUES ($1,$2,$3)",[email,hash,login])

        res.send({message:"Пользователь зарегистрирован"})
    }
    catch(e){
      console.log(e)
      res.status(500).send({message:"Произошла ошибка при регистрации пользователя"})
    }
})

router.post("/login",async(req,res)=>{
    if(req.session.auth){
      return res.status(403).send({message:"Уже авторизован"})
    }
    const {email,password} = req.body
    try{
      let user = await db.query("SELECT email,password,login,id FROM users WHERE email = $1",[email])
      if(user.rows.length){
          let validPassword = await bcrypt.compare(password,user.rows[0].password)
          if(validPassword){
              req.session.auth = true
              req.session.userId = user.rows[0].id
              req.session.login = user.rows[0].login
              res.send(Math.random().toString())
          }
        else res.status(400).send({message:"Неверный пароль"})
      }
      else res.status(404).send({message:"Пользователь не найден"})
    }
    catch(e){
      console.log(e)
      res.status(500).send({message:"Произошла ошибка при попытке войти"})
    }
})

router.post("/logout",(req,res)=>{
  if(req.session.auth){
    req.session.destroy((err)=>{
      if(err) return res.status(400).send(false)
    })
  }
  res.send(true)
})

router.get("/auth",(req,res)=>{
  if(req.session.auth){
    return res.send({auth:true})
  }
  res.send({auth:false})
})
module.exports = router