const {Router} = require("express")
const db = require("../../db")
const authMiddleware = require("../../middleware/auth")
const fs = require("fs")
const path = require("path")
const router = Router()

router.post("/delete",authMiddleware,async (req,res)=>{
    for(let i =0; i < req.body.length;i++){
      try{
        let userID = req.session.userId
        await db.query("DELETE FROM tests WHERE id = $1 AND userid = $2",[req.body[i],userID])
        fs.rm(path.join(__dirname,`../uploads/${req.body[i]}`),{recursive:true},(err)=>{
          if(err) console.log(err)
        })
      }catch(e){
        console.log(e)
        return res.status(500).send(false)
      }
    }
    res.send(true)
  })
  

module.exports = router