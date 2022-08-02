const {Router} = require("express")
const db = require("../../db")
const authMiddleware = require("../../middleware/auth")
const router = Router()

router.get("/list",authMiddleware,async (req,res)=>{
    try{
      let id =req.session.userId
      let tests = await db.query("SELECT title,id,url FROM tests WHERE userid = $1",[id])
      if(tests.rows.length){
          return res.send(tests.rows)
      }
      res.send([])
    }
    catch(e){
      console.log(e)
      res.status(500).send([])
    }
})

module.exports = router