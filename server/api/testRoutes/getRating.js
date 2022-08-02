const {Router} = require("express")
const db = require("../../db")
const router = Router()

router.get("/rating",async (req,res)=>{
    const id = req.query.id
    try{
  
      const test = await db.query("SELECT rating FROM tests WHERE id = $1",[id])
      const numberOfUsers = await db.query("SELECT COUNT(id) FROM rating WHERE testid = $1",[id])
      
      if(test.rows.length){
       return  res.send({rating:test.rows[0].rating,numberOfUsers:numberOfUsers.rows[0].count})
      }
      res.status(404).send({message:"Тест не найден"})
    }
    catch(e){
      res.status(500).send({message:"Произошла ошибка"})
    }
  
  })

module.exports = router