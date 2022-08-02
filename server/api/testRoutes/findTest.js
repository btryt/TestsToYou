const {Router} = require("express")
const db = require("../../db")
const router = Router()

router.get("/find",async (req,res)=>{
    const title = req.query.title
    const c = Number(req.query.c) === 0 ? 1 : Number(req.query.c)
    try{
      let count = await db.query("SELECT COUNT(id) FROM tests WHERE title ~* $1",[`(${title})`])
      let test = await db.query("SELECT login,url,title, tests.id,link_access FROM users INNER JOIN tests ON  tests.userid = users.id AND title ~* $1 LIMIT $2",[`(${title})`, 5 * Number(c)])
      let rows = []
      test.rows.forEach(row=>{
        if(!row.link_access){
          rows.push(row)
        }
      })
      res.send({rows,numberOfRows:Number(count.rows[0].count)})
    }
    catch(e){
      res.status(500).send([])
      console.log(e)
    }
  })

module.exports = router