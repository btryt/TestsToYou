const {Router} = require("express")
const bcrypt = require("bcrypt")
const db = require("../db")
const router = Router()

router.post("/registration",async(req,res)=>{
    const {email,password} = req.body
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)){
      return res.status(400).send({message:"Невалидный формат почты"})
    }
    if(password.length > 15 || password.length < 5){
      return res.status(400).send({message:"Длина пароля дложна быть от 5 до 15 символов"})
    }
    const hash = bcrypt.hashSync(password,5)
    try{
        let user = await db.query("SELECT email FROM users WHERE email = $1",[email])
        if(user.rows.length){
            return res.status(409).send({message:"Пользователь с такой почтой уже зарегистрирован"})
        }
        await db.query("INSERT INTO users (email,password) VALUES ($1,$2)",[email,hash])

        res.send({message:"Пользователь зарегистрирован"})
    }
    catch(e){
      console.log(e)
      res.status(500).send({message:"Произошла ошибка при регистрции пользователя"})
    }
})

router.post("/login",async(req,res)=>{
    const {email,password} = req.body
    try{
      let user = await db.query("SELECT email,password,id FROM users WHERE email = $1",[email])
      if(user.rows.length){
          let validPassword = await bcrypt.compare(password,user.rows[0].password)
          if(validPassword){
              req.session.auth = true
              req.session.userId = user.rows[0].id
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
  req.session.auth = false
  req.session.userId = null
  res.send(true)
})

router.get("/auth",(req,res)=>{
  if(req.session.auth){
    return res.send({auth:true})
  }
  res.send({auth:false})
})
module.exports = router