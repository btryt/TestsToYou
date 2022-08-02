const forEach = require("lodash.foreach")
const {Router} = require("express")
const db = require("../../db")
const router = Router()

router.get("/t/:url",async(req,res)=>{
    let url = req.params.url
    try{
      const test = await db.query("SELECT tests,title,id FROM tests WHERE url = $1",[url])
      const userLogin = await db.query("SELECT login FROM users WHERE EXISTS (SELECT id FROM tests WHERE userid = users.id AND url = $1 )",[url])
      if(test.rows.length){
        let rows = test.rows[0]
        forEach(rows.tests,(val)=>{
          forEach(val.variants,(vr)=>{
             delete vr.correct
          })
        })
        return res.send({rows,title:rows.title,testId:rows.id,userLogin:userLogin.rows[0].login})
      }
      res.status(404).send([])
    }
    catch(e){
      console.log(e)
      res.status(500).send([])
    }
  })

module.exports = router