const {Router} = require("express")
const forEach = require("lodash.foreach")
const {validate,ValidationError} = require('express-validation');
const authMiddleware = require("../../middleware/auth")
const ratingSchema = require("../../schemes/rating")
const db = require("../../db")
const router = Router()

router.post("/add/rating",[authMiddleware,validate(ratingSchema)],async (req,res)=>{
    const {rating,testId} = req.body
    
    let count = {}
    try{
      const userRating = await db.query("SELECT id FROM rating WHERE userid =$1 AND testid =$2",[req.session.userId,testId])
     
      if(userRating.rows.length){
        await db.query("UPDATE rating SET rating = $1 WHERE userid = $2 AND testid = $3",[rating,req.session.userId,testId]) 
      }else{
        await db.query("INSERT INTO rating (rating,userid,testid) VALUES ($1,$2,$3)",[rating,req.session.userId,testId])
      }
      const allRating =  await db.query("SELECT id,rating FROM rating WHERE testid =$1",[testId])
      forEach(allRating.rows,(row)=>{
        
        if(!count[row.rating]){
          count[row.rating] = 1
        } 
        else count[row.rating] += 1
      })
      let num1 =0
      let num2 =0
      for (let i = 1; i <= 5; i++) {
        num1 += (i * count[i] || 0)
        num2 += (count[i] || 0)
      }
      let averageRating = num1 / num2
      await db.query("UPDATE tests SET rating = $1 WHERE id = $2", [averageRating,testId])
      return res.send({message:"Оценка тесту успешно добавлена"})
    }
    catch(e){
      return res.status(500).send({message:"Что-то пошло не так при добавления оценки теста"})
    }
})

  router.use("/test/add/rating",(err,req,res,next)=>{
    if (err instanceof ValidationError) {
      return res.status(err.statusCode).json({message:"Оценка теста должна быть от 1 до 5"})
    }
    return res.status(500).json({message:"Произошла неизвестная ошибка"})
  })

module.exports = router