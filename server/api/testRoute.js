const {Router} = require("express")
const db = require("../db")
const forEach = require("lodash.foreach")
const getHash = require("../util/getHash")
const authMiddleware = require("../middleware/auth")
const router = Router()


router.post("/test/create",authMiddleware,async(req,res)=>{
    const body = req.body
    try{
        let url = getHash(7) 
        let id = req.session.userId
        await db.query("INSERT INTO tests (title,userid,url,show_correct_answer,tests,link_access) VALUES ($1,$2,$3,$4::boolean,$5::jsonb[],$6::boolean)",
        [body.testTitle,id,url,body.showCorrect,[...body.tests],body.linkAccess])
        res.send(true)
    }
    catch(e){
      console.log(e)
      res.status(500).send(false)
    }
})

router.get("/test/find/:url",async(req,res)=>{
  let url = req.params.url
  try{
    const test = await db.query("SELECT tests,title,id FROM tests WHERE url = $1",[url])
    if(test.rows.length){
      let rows = test.rows[0]
      forEach(rows.tests,(val)=>{
        forEach(val.variants,(vr)=>{
           delete vr.correct
        })
      })
      return res.send({rows,title:rows.title,testId:rows.id})
    }
    res.status(404).send([])
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.get("/find/test",async (req,res)=>{
  const title = req.query.title
  
  try{
    let test = await db.query("SELECT url,title,id,link_access FROM tests WHERE title ~* ($1)",[title])
    let rows =[]
    test.rows.forEach(row=>{
      if(!row.link_access){
        rows.push(row)
      }
    })
    res.send(rows)
  }
  catch(e){
    res.status(500).send([])
    console.log(e)
  }
})

router.get("/test/list",authMiddleware,async (req,res)=>{
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

router.post("/test/delete",authMiddleware,async (req,res)=>{
  for(let i =0; i < req.body.length;i++){
    try{
      await db.query("BEGIN")
      let id = await db.query("SELECT testid FROM finish_test WHERE testid = $1",[req.body[i]])
      if(id.rows.length){
        await db.query("DELETE FROM finish_test WHERE testid = $1",[id.rows[0].testid])
      }
      await db.query("DELETE FROM tests WHERE id = $1",[req.body[i]])
      await db.query('COMMIT')
    }catch(e){
      console.log(e)
      await db.query('ROLLBACK')
      return res.status(500).send("")
    }
  }
  res.send(true)
})

router.post("/test/finish",authMiddleware,async (req,res)=>{
  const body = req.body
  let count = 0
  try{
    const test = await db.query("SELECT tests,show_correct_answer FROM tests WHERE id = $1",[body.testId])
    const url = getHash(7)
        forEach(test.rows[0].tests,(val)=>{
            forEach(val.variants,(vr)=>{
                if(body.answers.some(b=> b.testId === val.id && vr.id === b.variant.id && vr.correct)){
                    count++ 
                }
            })
        })
        
  const percentages = count * 100 / test.rows[0].tests.length
  await db.query("INSERT INTO finish_test (name,testid,url,result,percentages,answers) VALUES ($1,$2,$3,$4,$5,$6::jsonb[])",
   [body.name,body.testId,url,`${count}/${test.rows[0].tests.length}`,percentages.toFixed(1),[...body.answers]])
   res.send({url})
  }
  catch(e){
    console.log(e)
    res.status(500).send({message:"Произошла ошибка при завершении теста"})
  }
})

router.get("/test/result/:url",async (req,res)=>{
  let url = req.params.url
  try{
    let result = await db.query("SELECT testid,result,percentages,answers FROM finish_test WHERE url = $1",[url])
    if(result.rows.length){
      let tests = await db.query("SELECT tests,show_correct_answer,title FROM tests WHERE id = $1",[result.rows[0].testid])
      let showCorrectAnswer = tests.rows[0].show_correct_answer
      
      let testsWithoutAnswer = [...tests.rows[0].tests]
      if(!showCorrectAnswer){
        forEach(testsWithoutAnswer,(val)=>{
          forEach(val.variants,(vr)=>{
            delete vr.correct
          })
        })
    }
     return res.send({title:tests.rows[0].title,tests:showCorrectAnswer ? tests.rows[0].tests : testsWithoutAnswer,answers:result.rows[0].answers,result:result.rows[0].result,percent:result.rows[0].percentages,showCorrectAnswer})
    }
    res.status(404).send([])
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.get("/test/results",authMiddleware,async(req,res)=>{
  const id = req.query.id
  try{
    const finishedTests = await db.query("SELECT name,percentages,result,url,id,testid FROM finish_test WHERE testid = (SELECT id FROM tests WHERE userid = $1 AND id = $2)",[req.session.userId,id])
    
    res.send(finishedTests.rows)
  }
  catch(e){
    console.log(e)
    res.status(500).send([])
  }
})

router.post("/test/result/delete",authMiddleware,async (req,res)=>{
  const selected = req.body
  for(let i =0; i < selected.length;i++){
    try{
      await db.query("DELETE FROM finish_test WHERE id = $1 AND EXISTS (SELECT id FROM tests WHERE id = $2 AND userid = $3 ) ",[selected[i].id,selected[i].testid,req.session.userId])
    }
    catch(e){
      console.log(e)
      return res.status(500).send([])
    }
  }
  res.send(Math.random().toString())
})

module.exports = router