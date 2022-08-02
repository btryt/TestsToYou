const forEach = require("lodash.foreach")
const {Router} = require("express")
const db = require("../../db")
const authMiddleware = require("../../middleware/auth")
const router = Router()


router.get("/results",authMiddleware,async(req,res)=>{
    const id = req.query.id
    try{
      const finishedTests = await db.query("SELECT name,percentages,result,url,id,testid,to_char(finish_time,'YYYY-MM-DD HH24:MI:SS') AS finish_time FROM finish_test WHERE testid = (SELECT id FROM tests WHERE userid = $1 AND id = $2)",[req.session.userId,id])
      const averageRating = await db.query("SELECT rating FROM tests WHERE id = $1",[id])
      const usersRating = await db.query("SELECT login, users.id, rating FROM users INNER JOIN rating ON rating.userid = users.id AND rating.testid = $1 ",[id])
      let averagePercentage = 0
      const numOfCompletedTest = finishedTests.rows.length
      forEach(finishedTests.rows,el=>{
        averagePercentage += parseInt(el.percentages)
      })
      let percent = averagePercentage !== 0 ? (averagePercentage / numOfCompletedTest).toFixed(1) : 0
      res.send({rows:finishedTests.rows,averagePercentage: percent,averageRating:averageRating.rows[0].rating,numOfCompletedTest,usersRating:usersRating.rows})
    }
    catch(e){
      console.log(e)
      res.status(500).send([])
    }
  })
  
module.exports = router